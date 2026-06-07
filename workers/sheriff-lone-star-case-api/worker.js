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

function normalizeCase(input) {
  const now = new Date().toISOString();
  const id = clean(input.id) || `sheriff-case-${Date.now()}`;
  return {
    ...input,
    id,
    status: clean(input.status) || "Open",
    openedAt: clean(input.openedAt) || now,
    updatedAt: now,
    closedAt: input.closedAt || null,
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
    solutionStatus: input.solutionStatus && typeof input.solutionStatus === "object" ? input.solutionStatus : {}
  };
}

async function listCases(env, request) {
  const result = await env.DB.prepare(
    "SELECT id, status, updated_at, data FROM cases ORDER BY datetime(updated_at) DESC LIMIT 200"
  ).all();
  const cases = (result.results || []).map((row) => JSON.parse(row.data));
  return jsonResponse(request, { cases });
}

async function getCase(env, request, id) {
  const row = await env.DB.prepare("SELECT data FROM cases WHERE id = ?").bind(id).first();
  if (!row) return jsonResponse(request, { error: "Case not found" }, 404);
  return jsonResponse(request, { case: JSON.parse(row.data) });
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
  return jsonResponse(request, { case: issue }, 201);
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
  return jsonResponse(request, { case: issue });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(request) });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const parts = path.split("/").filter(Boolean);

    try {
      if (request.method === "GET" && path === "/cases") return listCases(env, request);
      if (request.method === "GET" && parts[0] === "cases" && parts[1]) return getCase(env, request, parts[1]);
      if (request.method === "POST" && path === "/cases") return upsertCase(env, request);
      if (request.method === "PUT" && parts[0] === "cases" && parts[1]) return updateCase(env, request, parts[1]);
      return jsonResponse(request, { error: "Not found" }, 404);
    } catch (error) {
      return jsonResponse(request, { error: error.message || "Sheriff API error" }, 500);
    }
  }
};
