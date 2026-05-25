const fieldGrid = document.querySelector("#field-grid");
const fieldForm = document.querySelector("#field-form");
const generatedCard = document.querySelector("#generated-card");
const moodFilter = document.querySelector("#mood-filter");
const fieldSearch = document.querySelector("#field-search");

let fieldNotes = [];

async function loadFieldNotes() {
  const response = await fetch("field-guide-data.json");
  fieldNotes = await response.json();
  populateMoodFilter(fieldNotes);
  renderFieldNotes(fieldNotes);
  renderGeneratedCard();
}

function populateMoodFilter(notes) {
  const moods = [...new Set(notes.map((note) => note.mood))].sort();
  moodFilter.insertAdjacentHTML(
    "beforeend",
    moods.map((mood) => `<option value="${mood}">${mood}</option>`).join("")
  );
}

function fieldCard(note) {
  const tags = note.tags.map((tag) => `<span>${tag}</span>`).join("");
  return `
    <article class="field-card">
      <div class="card-meta">
        <span>${note.mood}</span>
        <span>${note.timeOfDay}</span>
      </div>
      <h2>${note.title}</h2>
      <p class="project-type">${note.location}</p>
      <dl>
        <div><dt>Archetype</dt><dd>${note.archetype}</dd></div>
        <div><dt>Field mark</dt><dd>${note.fieldMark}</dd></div>
        <div><dt>Observed behavior</dt><dd>${note.observedBehavior}</dd></div>
        <div><dt>Tiny detail</dt><dd>${note.tinyDetail}</dd></div>
      </dl>
      <blockquote>${note.captionSeed}</blockquote>
      <div class="tool-list">${tags}</div>
    </article>
  `;
}

function renderFieldNotes(notes) {
  fieldGrid.innerHTML = notes.map(fieldCard).join("");
}

function getGeneratedNote() {
  const data = new FormData(fieldForm);
  const title = data.get("title") || "Main Street Micro-Sighting";
  const mood = data.get("mood") || "Curious";
  const timeOfDay = data.get("timeOfDay") || "Anytime";
  const archetype = data.get("archetype") || "Local detail collector";
  const tinyDetail = data.get("tinyDetail") || "A small detail stood out enough to become the whole point.";
  const observedBehavior = data.get("observedBehavior") || "Walks slowly, notices one useful thing, and turns it into a note for later.";

  return {
    title,
    location: "Main Street Schertz",
    mood,
    timeOfDay,
    archetype,
    fieldMark: "Looks ordinary until it becomes a caption.",
    observedBehavior,
    tinyDetail,
    captionSeed: `${title}: ${tinyDetail}`,
    tags: ["draft", "main street", "schertz"]
  };
}

function renderGeneratedCard() {
  generatedCard.innerHTML = `
    <p class="kicker">Draft Field Note</p>
    ${fieldCard(getGeneratedNote()).replace('<article class="field-card">', "").replace("</article>", "")}
  `;
}

function filterFieldNotes() {
  const mood = moodFilter.value;
  const query = fieldSearch.value.trim().toLowerCase();

  const filtered = fieldNotes.filter((note) => {
    const haystack = `${note.title} ${note.location} ${note.mood} ${note.timeOfDay} ${note.archetype} ${note.tinyDetail} ${note.captionSeed} ${note.tags.join(" ")}`.toLowerCase();
    const matchesMood = mood === "all" || note.mood === mood;
    const matchesQuery = !query || haystack.includes(query);
    return matchesMood && matchesQuery;
  });

  renderFieldNotes(filtered);
}

fieldForm.addEventListener("input", renderGeneratedCard);
moodFilter.addEventListener("change", filterFieldNotes);
fieldSearch.addEventListener("input", filterFieldNotes);
loadFieldNotes();
