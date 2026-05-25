const fieldGrid = document.querySelector("#field-grid");
const fieldForm = document.querySelector("#field-form");
const generatedCard = document.querySelector("#generated-card");
const signalFilter = document.querySelector("#signal-filter");
const fieldSearch = document.querySelector("#field-search");

let fieldNotes = [];

async function loadFieldNotes() {
  const response = await fetch("field-guide-data.json");
  fieldNotes = await response.json();
  populateSignalFilter(fieldNotes);
  renderFieldNotes(fieldNotes);
  renderGeneratedCard();
}

function populateSignalFilter(notes) {
  const signals = [...new Set(notes.map((note) => note.signal))].sort();
  signalFilter.insertAdjacentHTML(
    "beforeend",
    signals.map((signal) => `<option value="${signal}">${signal}</option>`).join("")
  );
}

function fieldCard(note) {
  const tags = note.tags.map((tag) => `<span>${tag}</span>`).join("");
  return `
    <article class="field-card">
      <div class="card-meta">
        <span>${note.signal}</span>
        <span>${note.when}</span>
      </div>
      <h2>${note.title}</h2>
      <p class="project-type">${note.venue}</p>
      <dl>
        <div><dt>Best for</dt><dd>${note.bestFor}</dd></div>
        <div><dt>Room read</dt><dd>${note.roomRead}</dd></div>
        <div><dt>Question to ask</dt><dd>${note.questionToAsk}</dd></div>
        <div><dt>Follow-up note</dt><dd>${note.followUpNote}</dd></div>
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
  const title = data.get("title") || "AI Meetup Recon Note";
  const signal = data.get("signal") || "Beginner-friendly";
  const when = data.get("when") || "Next available date";
  const venue = data.get("venue") || "Austin / San Antonio area";
  const bestFor = data.get("bestFor") || "Anyone deciding whether the room is worth the drive, the RSVP, or the follow-up.";
  const questionToAsk = data.get("questionToAsk") || "What is the most useful real-world AI workflow you have seen this month?";
  const followUpNote = data.get("followUpNote") || "Capture one practical takeaway, one person to follow up with, and one post-worthy detail.";

  return {
    title,
    venue,
    signal,
    when,
    bestFor,
    roomRead: "Useful if the topic is concrete enough to produce one workflow, one contact, or one clean content angle.",
    questionToAsk,
    followUpNote,
    captionSeed: `${title}: ${followUpNote}`,
    tags: ["draft", "ai meetup", "field note"]
  };
}

function renderGeneratedCard() {
  generatedCard.innerHTML = `
    <p class="kicker">Draft Field Note</p>
    ${fieldCard(getGeneratedNote()).replace('<article class="field-card">', "").replace("</article>", "")}
  `;
}

function filterFieldNotes() {
  const signal = signalFilter.value;
  const query = fieldSearch.value.trim().toLowerCase();

  const filtered = fieldNotes.filter((note) => {
    const haystack = `${note.title} ${note.venue} ${note.signal} ${note.when} ${note.bestFor} ${note.roomRead} ${note.questionToAsk} ${note.followUpNote} ${note.captionSeed} ${note.tags.join(" ")}`.toLowerCase();
    const matchesSignal = signal === "all" || note.signal === signal;
    const matchesQuery = !query || haystack.includes(query);
    return matchesSignal && matchesQuery;
  });

  renderFieldNotes(filtered);
}

fieldForm.addEventListener("input", renderGeneratedCard);
signalFilter.addEventListener("change", filterFieldNotes);
fieldSearch.addEventListener("input", filterFieldNotes);
loadFieldNotes();
