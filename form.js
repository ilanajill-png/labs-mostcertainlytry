const form = document.querySelector("#project-form");
const card = document.querySelector("#form-card");
const output = document.querySelector("#json-output");

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getProject() {
  const data = new FormData(form);
  const title = data.get("title") || "Untitled Project";
  const id = slugify(title) || "untitled-project";

  return {
    id,
    title,
    type: data.get("type") || "Experiment",
    status: data.get("status") || "Draft",
    date: data.get("date") || new Date().toISOString().slice(0, 10),
    tools: (data.get("tools") || "")
      .split(",")
      .map((tool) => tool.trim())
      .filter(Boolean),
    summary: data.get("summary") || "Short project summary goes here.",
    outcome: data.get("outcome") || "Describe the shipped result or current learning.",
    url: `projects/${id}.html`,
    source: `docs/${id}.md`
  };
}

function renderPreview() {
  const project = getProject();
  const tools = project.tools.map((tool) => `<span>${tool}</span>`).join("");

  card.innerHTML = `
    <div class="card-meta">
      <span>${project.type}</span>
      <span>${project.status}</span>
    </div>
    <h2>${project.title}</h2>
    <p>${project.summary}</p>
    <div class="tool-list">${tools}</div>
  `;

  output.textContent = JSON.stringify(project, null, 2);
}

form.addEventListener("input", renderPreview);
renderPreview();

