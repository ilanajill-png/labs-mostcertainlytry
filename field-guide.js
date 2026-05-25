const fieldGrid = document.querySelector("#field-grid");
const fieldForm = document.querySelector("#field-form");
const generatedCard = document.querySelector("#generated-card");
const logTypeFilter = document.querySelector("#log-type-filter");
const fieldSearch = document.querySelector("#field-search");

let fieldNotes = [];

async function loadFieldNotes() {
  const response = await fetch("field-guide-data.json");
  fieldNotes = await response.json();
  populateLogTypeFilter(fieldNotes);
  renderFieldNotes(fieldNotes);
  renderGeneratedCard();
}

function populateLogTypeFilter(notes) {
  const logTypes = [...new Set(notes.map((note) => note.logType))].sort();
  logTypeFilter.insertAdjacentHTML(
    "beforeend",
    logTypes.map((logType) => `<option value="${logType}">${logType}</option>`).join("")
  );
}

function fieldCard(note) {
  const tags = note.tags.map((tag) => `<span>${tag}</span>`).join("");
  return `
    <article class="field-card">
      <div class="card-meta">
        <span>${note.logType}</span>
        <span>${note.whenWhere}</span>
      </div>
      <h2>${note.title}</h2>
      <p class="project-type">${note.roomVibe}</p>
      <dl>
        <div><dt>Best takeaway</dt><dd>${note.takeaway}</dd></div>
        <div><dt>Quote / moment</dt><dd>${note.moment}</dd></div>
        <div><dt>People / follow-ups</dt><dd>${note.followUps}</dd></div>
        <div><dt>Content angle</dt><dd>${note.contentAngle}</dd></div>
        <div><dt>Next move</dt><dd>${note.nextMove}</dd></div>
      </dl>
      <blockquote>${note.logline}</blockquote>
      <div class="tool-list">${tags}</div>
    </article>
  `;
}

function renderFieldNotes(notes) {
  fieldGrid.innerHTML = notes.map(fieldCard).join("");
}

function getGeneratedNote() {
  const data = new FormData(fieldForm);
  const title = data.get("title") || "AI Meetup Captain's Log";
  const logType = data.get("logType") || "Useful";
  const whenWhere = data.get("whenWhere") || "After the meetup";
  const roomVibe = data.get("roomVibe") || "The room had enough signal to turn into a real note, even if the details still need sorting.";
  const takeaway = data.get("takeaway") || "One practical idea was worth keeping.";
  const moment = data.get("moment") || "A specific example made the topic feel real enough to keep.";
  const followUps = data.get("followUps") || "Follow up with anyone who shared a concrete workflow, tool, or local connection.";
  const contentAngle = data.get("contentAngle") || "Turn the strongest takeaway into a short post or private reference note.";
  const nextMove = data.get("nextMove") || "Decide whether to attend the next one, message someone, or test the idea.";

  return {
    title,
    logType,
    whenWhere,
    roomVibe,
    takeaway,
    moment,
    followUps,
    contentAngle,
    nextMove,
    logline: `${title}: ${takeaway}`,
    tags: ["draft", "captains log", "ai meetup"]
  };
}

function renderGeneratedCard() {
  generatedCard.innerHTML = `
    <p class="kicker">Draft Captain's Log</p>
    ${fieldCard(getGeneratedNote()).replace('<article class="field-card">', "").replace("</article>", "")}
  `;
}

function filterFieldNotes() {
  const logType = logTypeFilter.value;
  const query = fieldSearch.value.trim().toLowerCase();

  const filtered = fieldNotes.filter((note) => {
    const haystack = `${note.title} ${note.logType} ${note.whenWhere} ${note.roomVibe} ${note.takeaway} ${note.moment} ${note.followUps} ${note.contentAngle} ${note.nextMove} ${note.logline} ${note.tags.join(" ")}`.toLowerCase();
    const matchesLogType = logType === "all" || note.logType === logType;
    const matchesQuery = !query || haystack.includes(query);
    return matchesLogType && matchesQuery;
  });

  renderFieldNotes(filtered);
}

fieldForm.addEventListener("input", renderGeneratedCard);
logTypeFilter.addEventListener("change", filterFieldNotes);
fieldSearch.addEventListener("input", filterFieldNotes);
loadFieldNotes();
