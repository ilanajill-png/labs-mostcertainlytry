const grid = document.querySelector("#project-grid");
const rows = document.querySelector("#project-rows");
const searchInput = document.querySelector("#search");
const statusFilter = document.querySelector("#status-filter");
const categoryFilter = document.querySelector("#category-filter");
const projectCount = document.querySelector("#project-count");
const categoryCount = document.querySelector("#category-count");
const publishedCount = document.querySelector("#published-count");

let projects = [];

async function loadProjects() {
  const response = await fetch("projects.json");
  projects = await response.json();
  updateStats(projects);
  populateCategories(projects);
  renderProjects(projects);
}

function updateStats(items) {
  const categories = new Set(items.map((project) => project.category));
  const published = items.filter((project) => project.status === "Published");

  projectCount.textContent = items.length;
  categoryCount.textContent = categories.size;
  publishedCount.textContent = published.length;
}

function populateCategories(items) {
  const categories = [...new Set(items.map((project) => project.category))].sort();
  categoryFilter.innerHTML = '<option value="all">All categories</option>';
  categoryFilter.insertAdjacentHTML(
    "beforeend",
    categories.map((category) => `<option value="${category}">${category}</option>`).join("")
  );
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
        <span>${project.category}</span>
        <span>${project.status}</span>
      </div>
      <h2><a href="${project.url}">${project.title}</a></h2>
      <p class="project-type">${project.type}</p>
      <p>${project.summary}</p>
      <div class="tool-list">${tools}</div>
      <a class="text-link" href="${project.url}">Open project</a>
    </article>
  `;
}

function projectRow(project) {
  return `
    <tr>
      <th scope="row"><a href="${project.url}">${project.title}</a></th>
      <td>${project.category}</td>
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
  const category = categoryFilter.value;

  const filtered = projects.filter((project) => {
    const haystack = `${project.title} ${project.category} ${project.type} ${project.status} ${project.summary} ${project.tools.join(" ")}`.toLowerCase();
    const matchesSearch = !query || haystack.includes(query);
    const matchesStatus = status === "all" || project.status === status;
    const matchesCategory = category === "all" || project.category === category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  renderProjects(filtered);
}

searchInput.addEventListener("input", filterProjects);
statusFilter.addEventListener("change", filterProjects);
categoryFilter.addEventListener("change", filterProjects);
loadProjects();
