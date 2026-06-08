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

function normalizeInvestigationWorkflow(input = {}, caseStatus = "Open") {
  const now = new Date().toISOString();
  const closed = clean(caseStatus) === "Closed";
  const status = closed ? "resolved" : clean(input.status) || "queued";
  return {
    ...input,
    status,
    assignedTo: clean(input.assignedTo) || "Sheriff Lone Star",
    queuedAt: clean(input.queuedAt) || now,
    updatedAt: now,
    lastRunAt: clean(input.lastRunAt) || null,
    nextAction: clean(input.nextAction) || (closed
      ? "Case closed; no further investigation scheduled."
      : "Start active investigation from the stored case prompt."),
    evidenceMode: clean(input.evidenceMode) || "Use D1 case context and metadata; inspect actual media only when it is attached in chat or uploaded to evidence storage.",
    resultSummary: clean(input.resultSummary),
    blocker: clean(input.blocker),
    runLog: Array.isArray(input.runLog) ? input.runLog : []
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
    investigationWorkflow: normalizeInvestigationWorkflow(input.investigationWorkflow, status),
    followUpResponses: Array.isArray(input.followUpResponses) ? input.followUpResponses : [],
    evidenceEmailLog: Array.isArray(input.evidenceEmailLog) ? input.evidenceEmailLog : [],
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
    r2Bound: Boolean(env.EVIDENCE),
    googleDriveConfigured: Boolean(env.GOOGLE_DRIVE_FOLDER_ID && (
      (env.GOOGLE_CLIENT_EMAIL && env.GOOGLE_PRIVATE_KEY) ||
      (env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET && env.GOOGLE_OAUTH_REFRESH_TOKEN)
    ))
  };
}

function safeFileName(name) {
  return clean(name).replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "evidence";
}

function base64UrlEncode(input) {
  const bytes = input instanceof Uint8Array ? input : new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function pemToArrayBuffer(pem) {
  const normalized = clean(pem).replace(/\\n/g, "\n");
  const base64 = normalized
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s+/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes.buffer;
}

async function signJwt(env) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: env.GOOGLE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/drive.file",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now
  };
  const signingInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claim))}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(env.GOOGLE_PRIVATE_KEY),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput)
  );
  return `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;
}

async function getGoogleAccessToken(env) {
  if (env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET && env.GOOGLE_OAUTH_REFRESH_TOKEN) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
        refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN,
        grant_type: "refresh_token"
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.access_token) {
      throw new Error(`Google OAuth refresh failed: ${result.error_description || result.error || response.status}`);
    }
    return result.access_token;
  }

  const assertion = await signJwt(env);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.access_token) {
    throw new Error(`Google Drive auth failed: ${result.error_description || result.error || response.status}`);
  }
  return result.access_token;
}

async function uploadFileToDrive(env, id, file) {
  const token = await getGoogleAccessToken(env);
  const quotaProject = clean(env.GOOGLE_QUOTA_PROJECT || "personal-agent-1-496921");
  const name = `${id}-${Date.now()}-${safeFileName(file.name)}`;
  const metadata = {
    name,
    parents: [env.GOOGLE_DRIVE_FOLDER_ID],
    description: `Las Jaras Sheriff evidence for case ${id}; original file ${clean(file.name)}.`
  };
  const mediaType = file.type || "application/octet-stream";
  const session = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,mimeType,size,webViewLink,parents", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Goog-User-Project": quotaProject,
      "X-Upload-Content-Type": mediaType,
      "X-Upload-Content-Length": String(file.size)
    },
    body: JSON.stringify(metadata)
  });
  if (!session.ok) {
    const body = await session.text();
    throw new Error(`Google Drive upload session failed: ${body || session.status}`);
  }
  const location = session.headers.get("Location");
  if (!location) throw new Error("Google Drive upload session did not return an upload URL");

  const response = await fetch(location, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": mediaType,
      "X-Goog-User-Project": quotaProject,
      "Content-Length": String(file.size)
    },
    body: await file.arrayBuffer()
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Google Drive upload failed: ${result.error?.message || JSON.stringify(result) || response.status}`);
  }
  return {
    name: clean(file.name),
    type: mediaType,
    sizeBytes: file.size,
    size: `${Math.round(file.size / 1024)} KB`,
    driveFileId: result.id,
    driveName: result.name,
    driveWebViewLink: result.webViewLink || "",
    storedIn: "Google Drive",
    uploadedAt: new Date().toISOString()
  };
}

async function deleteDriveFile(env, fileId) {
  const token = await getGoogleAccessToken(env);
  const quotaProject = clean(env.GOOGLE_QUOTA_PROJECT || "personal-agent-1-496921");
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "X-Goog-User-Project": quotaProject
    }
  });
  if (!response.ok && response.status !== 404) {
    const body = await response.text();
    throw new Error(`Google Drive cleanup failed: ${body || response.status}`);
  }
}

async function cleanupCaseEvidence(env, current) {
  const attachments = Array.isArray(current.mediaAttachments) ? current.mediaAttachments : [];
  const r2Attachments = attachments.filter((item) => clean(item.r2Key));
  const driveAttachments = attachments.filter((item) => clean(item.driveFileId));
  if (r2Attachments.length && !env.EVIDENCE) {
    throw new Error("R2 evidence cleanup requires the EVIDENCE binding");
  }
  if (driveAttachments.length && !evidenceStatus(env).googleDriveConfigured) {
    throw new Error("Google Drive evidence cleanup requires Drive credentials");
  }

  if (env.EVIDENCE) {
    await Promise.all(r2Attachments.map((item) => env.EVIDENCE.delete(item.r2Key)));
  }
  if (evidenceStatus(env).googleDriveConfigured) {
    await Promise.all(driveAttachments.map((item) => deleteDriveFile(env, item.driveFileId)));
  }

  return {
    deletedAt: new Date().toISOString(),
    deletedR2Objects: r2Attachments.length,
    deletedDriveFiles: evidenceStatus(env).googleDriveConfigured ? driveAttachments.length : 0,
    clearedAttachmentRecords: attachments.length,
    retainedEvidence: false,
    policy: "Evidence files and attachment records are removed when a case is marked closed."
  };
}

async function closeoutCase(env, current, patch, id) {
  const evidenceCleanup = await cleanupCaseEvidence(env, current);
  return normalizeCase({
    ...current,
    ...patch,
    id,
    status: "Closed",
    closedAt: new Date().toISOString(),
    mediaAttachments: [],
    evidenceCleanup
  });
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
  const issue = closingCase(current, patch)
    ? await closeoutCase(env, current, patch, id)
    : normalizeCase({ ...current, ...patch, id });
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
  const issue = await closeoutCase(env, current, body, id);
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
  const status = evidenceStatus(env);
  if (!env.EVIDENCE && !status.googleDriveConfigured) {
    return jsonResponse(request, {
      error: "Evidence storage is not configured",
      required: "Configure R2 or set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_DRIVE_FOLDER_ID Worker secrets/vars."
    }, 503);
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
    if (env.EVIDENCE) {
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
    } else {
      uploaded.push(await uploadFileToDrive(env, id, file));
    }
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
      if (request.method === "GET" && (path === "/" || path === "/health")) return await healthCheck(env, request);
      if (request.method === "GET" && path === "/cases") return await listCases(env, request);
      if (request.method === "GET" && parts[0] === "cases" && parts[1]) return await getCase(env, request, parts[1]);
      if (request.method === "POST" && path === "/cases") return await upsertCase(env, request);
      if (request.method === "POST" && parts[0] === "cases" && parts[1] && parts[2] === "close") return await closeCase(env, request, parts[1]);
      if (request.method === "POST" && parts[0] === "cases" && parts[1] && parts[2] === "updates") return await createCaseUpdate(env, request, parts[1]);
      if (request.method === "POST" && parts[0] === "cases" && parts[1] && parts[2] === "evidence") return await uploadCaseEvidence(env, request, parts[1]);
      if (request.method === "PUT" && parts[0] === "cases" && parts[1]) return await updateCase(env, request, parts[1]);
      return jsonResponse(request, { error: "Not found" }, 404);
    } catch (error) {
      return jsonResponse(request, { error: error.message || "Sheriff API error" }, 500);
    }
  }
};
