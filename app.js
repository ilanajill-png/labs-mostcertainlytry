const grid = document.querySelector("#project-grid");
const rows = document.querySelector("#project-rows");
const searchInput = document.querySelector("#search");
const statusFilter = document.querySelector("#status-filter");
const projectCount = document.querySelector("#project-count");

let projects = [];

async function loadProjects() {
  const response = await fetch("projects.json");
  projects = await response.json();
  projectCount.textContent = projects.length;
  renderProjects(projects);
}

function renderProjects(items) {
  grid.innerHTML = items.map(projectCard).join("");
  rows.innerHTML = items.map(projectRow).join("");
}

function projectCard(project) {
  const tools = project.tools.map((tool) => `<span>${tool}</span>`).join("");
  return `
    <article class="project-card">
      <div class="card-meta">
        <span>${project.type}</span>
        <span>${project.status}</span>
      </div>
      <h2><a href="${project.url}">${project.title}</a></h2>
      <p>${project.summary}</p>
      <div class="tool-list">${tools}</div>
      <a class="text-link" href="${project.url}">Open case study</a>
    </article>
  `;
}

function projectRow(project) {
  return `
    <tr>
      <th scope="row"><a href="${project.url}">${project.title}</a></th>
      <td>${project.type}</td>
      <td><span class="status">${project.status}</span></td>
      <td>${project.date}</td>
      <td>${project.outcome}</td>
    </tr>
  `;
}

function filterProjects() {
  const query = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;

  const filtered = projects.filter((project) => {
    const haystack = `${project.title} ${project.type} ${project.status} ${project.summary} ${project.tools.join(" ")}`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    const matchesStatus = status === "all" || project.status === status;
    return matchesSearch && matchesStatus;
  });

  renderProjects(filtered);
}

searchInput.addEventListener("input", filterProjects);
statusFilter.addEventListener("change", filterProjects);
loadProjects();

