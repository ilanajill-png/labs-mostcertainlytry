const ALLOWED_ORIGINS = new Set([
  "https://labs.mostcertainlytry.com",
  "http://localhost:8787",
  "http://127.0.0.1:8787"
]);

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://labs.mostcertainlytry.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Sheriff-Admin-Token",
    "Access-Control-Max-Age": "86400"
  };
}

function jsonResponse(request, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(request),
      "Content-Type": "application/json; charset=utf-8"
    }
  });
}

function clean(value) {
  return String(value || "").trim();
}

function hasAdminToken(request, env) {
  const expected = clean(env.ADMIN_TOKEN);
  const provided = clean(request.headers.get("X-Sheriff-Admin-Token"));
  return Boolean(expected && provided && provided === expected);
}

function closingCase(current, patch) {
  return clean(current.status) !== "Closed" && clean(patch.status) === "Closed";
}

function normalizeNotificationConsent(input = {}) {
  const optedIn = Boolean(input.optedIn);
  const contact = clean(input.contact);
  const consentText = clean(input.consentText);
  const consentedAt = clean(input.consentedAt);
  return {
    optedIn: optedIn && Boolean(contact && consentText),
    channel: optedIn ? "email" : "",
    contact,
    consentText,
    consentedAt: consentedAt || null
  };
}

function normalizeCase(input) {
  const now = new Date().toISOString();
  const id = clean(input.id) || `sheriff-case-${Date.now()}`;
  const status = clean(input.status) || "Open";
  return {
    ...input,
    id,
    status,
    openedAt: clean(input.openedAt) || now,
    updatedAt: now,
    closedAt: status === "Closed" ? clean(input.closedAt) || now : null,
    caseTitle: clean(input.caseTitle),
    reportedBy: clean(input.reportedBy),
    location: clean(input.location),
    caseType: clean(input.caseType),
    urgency: clean(input.urgency),
    desiredOutcome: clean(input.desiredOutcome || "understand"),
    description: clean(input.description),
    mediaDescription: clean(input.mediaDescription),
    mediaAttachments: Array.isArray(input.mediaAttachments) ? input.mediaAttachments : [],
    actionLane: Array.isArray(input.actionLane) ? input.actionLane : [],
    solutionStatus: input.solutionStatus && typeof input.solutionStatus === "object" ? input.solutionStatus : {},
    notificationConsent: normalizeNotificationConsent(input.notificationConsent),
    notificationLog: Array.isArray(input.notificationLog) ? input.notificationLog : []
  };
}

function redactCase(issue, request, env) {
  if (hasAdminToken(request, env)) return issue;
  const notificationConsent = issue.notificationConsent
    ? {
        ...issue.notificationConsent,
        contact: issue.notificationConsent.contact ? "[redacted]" : "",
        redacted: Boolean(issue.notificationConsent.contact)
      }
    : normalizeNotificationConsent();
  return { ...issue, notificationConsent };
}

function providerStatus(env) {
  return {
    email: Boolean(env.RESEND_API_KEY && env.FROM_EMAIL)
  };
}

function databaseStatus(env) {
  return {
    d1Bound: Boolean(env.DB)
  };
}

function evidenceStatus(env) {
  return {
    r2Bound: Boolean(env.EVIDENCE)
  };
}

function safeFileName(name) {
  return clean(name).replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "evidence";
}

async function sendEmail(env, issue, message) {
  if (!providerStatus(env).email) return { sent: false, reason: "email provider not configured" };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: issue.notificationConsent.contact,
      subject: `Sheriff Lone Star update: ${issue.caseTitle}`,
      text: message,
      headers: {
        "X-Entity-Ref-ID": issue.id
      }
    })
  });
  return {
    sent: response.ok,
    status: response.status,
    reason: response.ok ? "sent" : await response.text()
  };
}

async function sendCaseNotification(env, issue, message) {
  const consent = issue.notificationConsent || {};
  if (!consent.optedIn) return { sent: false, reason: "no notification consent" };
  if (consent.channel === "email") return sendEmail(env, issue, message);
  return { sent: false, reason: "unsupported notification channel" };
}

async function listCases(env, request) {
  const result = await env.DB.prepare(
    "SELECT id, status, updated_at, data FROM cases ORDER BY datetime(updated_at) DESC LIMIT 200"
  ).all();
  const cases = (result.results || []).map((row) => redactCase(JSON.parse(row.data), request, env));
  return jsonResponse(request, { cases });
}

async function healthCheck(env, request) {
  return jsonResponse(request, {
    ok: true,
    service: "sheriff-lone-star-case-api",
    database: databaseStatus(env),
    evidence: evidenceStatus(env),
    providers: providerStatus(env)
  });
}

async function getCase(env, request, id) {
  const row = await env.DB.prepare("SELECT data FROM cases WHERE id = ?").bind(id).first();
  if (!row) return jsonResponse(request, { error: "Case not found" }, 404);
  return jsonResponse(request, { case: redactCase(JSON.parse(row.data), request, env) });
}

async function upsertCase(env, request) {
  const input = await request.json();
  const issue = normalizeCase(input);
  await env.DB.prepare(
    "INSERT INTO cases (id, status, opened_at, updated_at, data) VALUES (?, ?, ?, ?, ?) " +
      "ON CONFLICT(id) DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at, data = excluded.data"
  )
    .bind(issue.id, issue.status, issue.openedAt, issue.updatedAt, JSON.stringify(issue))
    .run();
  return jsonResponse(request, { case: redactCase(issue, request, env) }, 201);
}

async function updateCase(env, request, id) {
  const existing = await env.DB.prepare("SELECT data FROM cases WHERE id = ?").bind(id).first();
  if (!existing) return jsonResponse(request, { error: "Case not found" }, 404);
  const patch = await request.json();
  const current = JSON.parse(existing.data);
  if (closingCase(current, patch) && !hasAdminToken(request, env)) {
    return jsonResponse(request, { error: "Closing a case requires Sheriff admin token" }, 403);
  }
  const issue = normalizeCase({ ...current, ...patch, id });
  await env.DB.prepare(
    "UPDATE cases SET status = ?, updated_at = ?, data = ? WHERE id = ?"
  )
    .bind(issue.status, issue.updatedAt, JSON.stringify(issue), id)
    .run();
  return jsonResponse(request, { case: redactCase(issue, request, env) });
}

async function closeCase(env, request, id) {
  if (!hasAdminToken(request, env)) {
    return jsonResponse(request, { error: "Closing a case requires Sheriff admin token" }, 403);
  }
  const existing = await env.DB.prepare("SELECT data FROM cases WHERE id = ?").bind(id).first();
  if (!existing) return jsonResponse(request, { error: "Case not found" }, 404);
  const body = request.headers.get("Content-Length") === "0" ? {} : await request.json().catch(() => ({}));
  const current = JSON.parse(existing.data);
  const issue = normalizeCase({
    ...current,
    ...body,
    id,
    status: "Closed",
    closedAt: new Date().toISOString()
  });
  await env.DB.prepare(
    "UPDATE cases SET status = ?, updated_at = ?, data = ? WHERE id = ?"
  )
    .bind(issue.status, issue.updatedAt, JSON.stringify(issue), id)
    .run();
  return jsonResponse(request, { case: issue });
}

async function createCaseUpdate(env, request, id) {
  if (!hasAdminToken(request, env)) {
    return jsonResponse(request, { error: "Case updates require Sheriff admin token" }, 403);
  }
  const existing = await env.DB.prepare("SELECT data FROM cases WHERE id = ?").bind(id).first();
  if (!existing) return jsonResponse(request, { error: "Case not found" }, 404);
  const body = await request.json();
  const current = JSON.parse(existing.data);
  const message = clean(body.message);
  if (!message) return jsonResponse(request, { error: "Update message is required" }, 400);
  const notification = await sendCaseNotification(env, current, message);
  const entry = {
    id: `case-update-${Date.now()}`,
    createdAt: new Date().toISOString(),
    message,
    publicNote: clean(body.publicNote),
    notification
  };
  const issue = normalizeCase({
    ...current,
    notificationLog: [...(current.notificationLog || []), entry]
  });
  await env.DB.prepare(
    "UPDATE cases SET status = ?, updated_at = ?, data = ? WHERE id = ?"
  )
    .bind(issue.status, issue.updatedAt, JSON.stringify(issue), id)
    .run();
  return jsonResponse(request, { case: issue, update: entry, providers: providerStatus(env) });
}

async function uploadCaseEvidence(env, request, id) {
  if (!env.EVIDENCE) {
    return jsonResponse(request, { error: "R2 evidence storage is not configured" }, 503);
  }
  const existing = await env.DB.prepare("SELECT data FROM cases WHERE id = ?").bind(id).first();
  if (!existing) return jsonResponse(request, { error: "Case not found" }, 404);

  const form = await request.formData();
  const files = form.getAll("mediaFiles").filter((file) => file && typeof file === "object" && "arrayBuffer" in file);
  if (!files.length) return jsonResponse(request, { error: "No evidence files were provided" }, 400);

  const maxBytes = 25 * 1024 * 1024;
  const current = JSON.parse(existing.data);
  const uploaded = [];
  for (const file of files) {
    if (file.size > maxBytes) {
      return jsonResponse(request, { error: `${file.name} is over the 25 MB mobile upload limit` }, 413);
    }
    const key = `cases/${id}/evidence/${Date.now()}-${safeFileName(file.name)}`;
    await env.EVIDENCE.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
      customMetadata: {
        caseId: id,
        originalName: clean(file.name),
        uploadedAt: new Date().toISOString()
      }
    });
    uploaded.push({
      name: clean(file.name),
      type: file.type || "application/octet-stream",
      sizeBytes: file.size,
      size: `${Math.round(file.size / 1024)} KB`,
      r2Key: key,
      storedIn: "Cloudflare R2",
      uploadedAt: new Date().toISOString()
    });
  }

  const existingAttachments = Array.isArray(current.mediaAttachments) ? current.mediaAttachments : [];
  const issue = normalizeCase({
    ...current,
    id,
    mediaAttachments: [...existingAttachments, ...uploaded]
  });
  await env.DB.prepare(
    "UPDATE cases SET status = ?, updated_at = ?, data = ? WHERE id = ?"
  )
    .bind(issue.status, issue.updatedAt, JSON.stringify(issue), id)
    .run();
  return jsonResponse(request, { case: redactCase(issue, request, env), evidence: uploaded });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request) });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const parts = path.split("/").filter(Boolean);

    try {
      if (request.method === "GET" && (path === "/" || path === "/health")) return healthCheck(env, request);
      if (request.method === "GET" && path === "/cases") return listCases(env, request);
      if (request.method === "GET" && parts[0] === "cases" && parts[1]) return getCase(env, request, parts[1]);
      if (request.method === "POST" && path === "/cases") return upsertCase(env, request);
      if (request.method === "POST" && parts[0] === "cases" && parts[1] && parts[2] === "close") return closeCase(env, request, parts[1]);
      if (request.method === "POST" && parts[0] === "cases" && parts[1] && parts[2] === "updates") return createCaseUpdate(env, request, parts[1]);
      if (request.method === "POST" && parts[0] === "cases" && parts[1] && parts[2] === "evidence") return uploadCaseEvidence(env, request, parts[1]);
      if (request.method === "PUT" && parts[0] === "cases" && parts[1]) return updateCase(env, request, parts[1]);
      return jsonResponse(request, { error: "Not found" }, 404);
    } catch (error) {
      return jsonResponse(request, { error: error.message || "Sheriff API error" }, 500);
    }
  }
};
