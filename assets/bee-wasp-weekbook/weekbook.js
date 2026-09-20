(() => {
  "use strict";

  const DB_NAME = "mct-bee-wasp-weekbook";
  const STORE = "weeks";
  const DB_VERSION = 1;
  const BOUNDS = { nelat: 29.80, nelng: -98.10, swlat: 29.20, swlng: -98.85 };
  const TAXA = { apocrita: 124417, bees: 630955, ants: 47336 };
  const TASKS = [
    ["flowers", "Watch flowering plants for at least 10 minutes"],
    ["nests", "Check bare soil, hollow stems, wood, and leaf edges"],
    ["photo", "Photograph at least one bee or wasp if present"],
    ["context", "Record the plant, surface, behavior, or weather"]
  ];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const state = {
    db: null,
    year: new Date().getFullYear(),
    records: new Map(),
    selectedPhoto: "",
    existingPhoto: "",
    deleteTarget: null,
    species: [],
    speciesDisplayLimit: 1000,
    speciesLoadedMonth: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = (value = "") => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("show"), 2800);
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "key" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function dbRequest(mode, action) {
    return new Promise((resolve, reject) => {
      const tx = state.db.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      const request = action(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function loadRecords() {
    const all = await dbRequest("readonly", store => store.getAll());
    state.records = new Map(all.map(record => [record.key, record]));
  }

  async function saveRecord(record) {
    state.records.set(record.key, record);
    await dbRequest("readwrite", store => store.put(record));
  }

  function isoWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return { year: d.getUTCFullYear(), week: Math.ceil((((d - yearStart) / 86400000) + 1) / 7) };
  }

  function weeksInYear(year) { return isoWeek(new Date(year, 11, 28)).week; }

  function weekMonday(year, week) {
    const jan4 = new Date(year, 0, 4, 12);
    const day = jan4.getDay() || 7;
    const monday = new Date(jan4);
    monday.setDate(jan4.getDate() - day + 1 + (week - 1) * 7);
    return monday;
  }

  function dateISO(date) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function weekKey(year, week) { return `${year}-W${String(week).padStart(2, "0")}`; }

  function blankRecord(year, week) {
    return { key: weekKey(year, week), year, week, tasks: { flowers: false, nests: false, photo: false, context: false }, noSightings: false, observations: [], updatedAt: new Date().toISOString() };
  }

  function getRecord(year, week) { return state.records.get(weekKey(year, week)) || blankRecord(year, week); }

  function recordComplete(record) {
    return TASKS.every(([id]) => record.tasks?.[id]) || (record.noSightings && record.tasks?.flowers && record.tasks?.nests);
  }

  function formatWeekRange(year, week) {
    const start = weekMonday(year, week);
    const end = new Date(start); end.setDate(start.getDate() + 6);
    const startText = start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const endText = end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    return `${startText}–${endText}`;
  }

  function initializeYears() {
    const select = $("#year-select");
    const current = new Date().getFullYear();
    for (let year = current - 2; year <= current + 2; year++) select.add(new Option(String(year), String(year), year === state.year, year === state.year));
  }

  function observationMarkup(obs, key) {
    const title = obs.name || (obs.kind === "bee" ? "Unidentified bee" : obs.kind === "wasp" ? "Unidentified wasp" : "Unidentified hymenopteran");
    const context = [obs.date, obs.plant, obs.behavior, obs.location].filter(Boolean).map(escapeHTML).join(" · ");
    return `<article class="bw-observation ${obs.photo ? "" : "no-photo"}" data-observation-id="${escapeHTML(obs.id)}">
      ${obs.photo ? `<img src="${obs.photo}" alt="Photograph of ${escapeHTML(title)}">` : ""}
      <div class="bw-observation-content"><header><div><h4>${escapeHTML(title)}</h4><p>${escapeHTML(obs.kind || "unsure")}</p></div></header>
      ${context ? `<p>${context}</p>` : ""}${obs.note ? `<p>${escapeHTML(obs.note)}</p>` : ""}
      <div class="bw-observation-actions"><button class="bw-text-button" data-action="edit" data-week="${key}" data-id="${escapeHTML(obs.id)}" type="button">Edit</button><button class="bw-text-button" data-action="delete" data-week="${key}" data-id="${escapeHTML(obs.id)}" type="button">Delete</button></div></div>
    </article>`;
  }

  function weekMarkup(year, week) {
    const record = getRecord(year, week);
    const current = isoWeek(new Date());
    const isCurrent = current.year === year && current.week === week;
    const complete = recordComplete(record);
    const sightings = record.observations?.length || 0;
    return `<details class="bw-week ${isCurrent ? "current" : ""}" data-key="${record.key}" ${isCurrent ? "open" : ""}>
      <summary><span class="bw-week-number">${week}</span><span class="bw-week-title"><strong>${isCurrent ? "This week" : `Week ${week}`}</strong><span>${formatWeekRange(year, week)}</span></span><span class="bw-week-badges">${complete ? '<b class="bw-badge done">Complete</b>' : '<b class="bw-badge">Open</b>'}${sightings ? `<b class="bw-badge sighting">${sightings} sighting${sightings === 1 ? "" : "s"}</b>` : ""}</span></summary>
      <div class="bw-week-body"><div class="bw-task-grid">${TASKS.map(([id, label]) => `<label class="bw-task"><input type="checkbox" data-action="task" data-task="${id}" ${record.tasks?.[id] ? "checked" : ""}><span>${label}</span></label>`).join("")}</div>
      <div class="bw-week-actions"><button class="bw-button primary small" data-action="add" type="button">Add bee or wasp</button><label class="bw-no-sightings"><input type="checkbox" data-action="none" ${record.noSightings ? "checked" : ""}> Surveyed; no sightings</label></div>
      <div class="bw-observations">${(record.observations || []).map(obs => observationMarkup(obs, record.key)).join("")}</div></div>
    </details>`;
  }

  function filteredWeeks() {
    const filter = $("#week-filter").value;
    const query = $("#week-search").value.trim().toLowerCase();
    const total = weeksInYear(state.year);
    return Array.from({ length: total }, (_, index) => index + 1).filter(week => {
      const record = getRecord(state.year, week);
      const complete = recordComplete(record);
      const sightings = record.observations?.length || 0;
      if (filter === "open" && complete) return false;
      if (filter === "complete" && !complete) return false;
      if (filter === "sightings" && !sightings) return false;
      if (!query) return true;
      const haystack = JSON.stringify(record).toLowerCase();
      return haystack.includes(query) || `week ${week}`.includes(query);
    });
  }

  function renderWeeks() {
    const weeks = filteredWeeks();
    $("#week-list").innerHTML = weeks.map(week => weekMarkup(state.year, week)).join("");
    $("#week-empty").hidden = weeks.length > 0;
    updateStats();
  }

  function updateStats() {
    const total = weeksInYear(state.year);
    const records = Array.from({ length: total }, (_, i) => getRecord(state.year, i + 1));
    const complete = records.filter(recordComplete).length;
    const sightings = records.reduce((sum, r) => sum + (r.observations?.length || 0), 0);
    const photos = records.reduce((sum, r) => sum + (r.observations || []).filter(o => o.photo).length, 0);
    let streak = 0;
    const current = isoWeek(new Date());
    const startWeek = current.year === state.year ? Math.min(current.week, total) : total;
    for (let week = startWeek; week >= 1; week--) { if (recordComplete(getRecord(state.year, week))) streak++; else break; }
    $("#stat-weeks").textContent = complete;
    $("#stat-weeks-total").textContent = `of ${total}`;
    $("#stat-sightings").textContent = sightings;
    $("#stat-photos").textContent = photos;
    $("#stat-streak").textContent = streak;
    $("#progress-bar").style.width = `${Math.round(complete / total * 100)}%`;
  }

  async function updateWeekInput(input) {
    const details = input.closest(".bw-week");
    const [yearText, weekText] = details.dataset.key.split("-W");
    const record = structuredClone(getRecord(Number(yearText), Number(weekText)));
    if (input.dataset.action === "task") record.tasks[input.dataset.task] = input.checked;
    if (input.dataset.action === "none") record.noSightings = input.checked;
    record.updatedAt = new Date().toISOString();
    await saveRecord(record);
    renderWeeks();
  }

  function openSighting(key, id = "") {
    const [yearText, weekText] = key.split("-W");
    const record = getRecord(Number(yearText), Number(weekText));
    const obs = id ? record.observations.find(item => item.id === id) : null;
    $("#sighting-form").reset();
    $("#sighting-week").value = key;
    $("#sighting-id").value = obs?.id || "";
    $("#dialog-week-label").textContent = `Week ${Number(weekText)} · ${formatWeekRange(Number(yearText), Number(weekText))}`;
    $("#obs-date").value = obs?.date || dateISO(new Date());
    $("#obs-kind").value = obs?.kind || "bee";
    $("#obs-name").value = obs?.name || "";
    $("#obs-plant").value = obs?.plant || "";
    $("#obs-behavior").value = obs?.behavior || "";
    $("#obs-location").value = obs?.location || "";
    $("#obs-note").value = obs?.note || "";
    state.selectedPhoto = "";
    state.existingPhoto = obs?.photo || "";
    updatePhotoPreview(state.existingPhoto);
    $("#sighting-dialog").showModal();
  }

  function updatePhotoPreview(src) {
    const wrap = $("#photo-preview-wrap");
    wrap.hidden = !src;
    if (src) $("#photo-preview").src = src;
    else $("#photo-preview").removeAttribute("src");
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("The photograph could not be read."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("This image format is not supported by the browser. Try JPEG or PNG."));
        image.onload = () => {
          const max = 1600;
          const ratio = Math.min(1, max / Math.max(image.width, image.height));
          const width = Math.max(1, Math.round(image.width * ratio));
          const height = Math.max(1, Math.round(image.height * ratio));
          const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
          const context = canvas.getContext("2d", { alpha: false });
          context.fillStyle = "#fff"; context.fillRect(0, 0, width, height); context.drawImage(image, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", .82));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function saveSighting(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const key = $("#sighting-week").value;
    const [yearText, weekText] = key.split("-W");
    const record = structuredClone(getRecord(Number(yearText), Number(weekText)));
    const id = $("#sighting-id").value || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
    const item = {
      id, date: $("#obs-date").value, kind: $("#obs-kind").value, name: $("#obs-name").value.trim(), plant: $("#obs-plant").value.trim(),
      behavior: $("#obs-behavior").value.trim(), location: $("#obs-location").value.trim(), note: $("#obs-note").value.trim(),
      photo: state.selectedPhoto || state.existingPhoto || "", updatedAt: new Date().toISOString()
    };
    const existingIndex = record.observations.findIndex(obs => obs.id === id);
    if (existingIndex >= 0) record.observations[existingIndex] = item; else record.observations.push(item);
    if (item.photo) record.tasks.photo = true;
    if (item.plant || item.behavior || item.note) record.tasks.context = true;
    record.noSightings = false; record.updatedAt = new Date().toISOString();
    await saveRecord(record);
    $("#sighting-dialog").close(); renderWeeks(); toast("Sighting saved in this browser.");
  }

  async function confirmDelete(key, id) {
    state.deleteTarget = { key, id };
    const dialog = $("#confirm-dialog");
    dialog.showModal();
    const result = await new Promise(resolve => dialog.addEventListener("close", () => resolve(dialog.returnValue), { once: true }));
    if (result !== "confirm") return;
    const [yearText, weekText] = key.split("-W");
    const record = structuredClone(getRecord(Number(yearText), Number(weekText)));
    record.observations = record.observations.filter(obs => obs.id !== id);
    record.updatedAt = new Date().toISOString(); await saveRecord(record); renderWeeks(); toast("Sighting deleted.");
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob); const link = document.createElement("a");
    link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  }

  function csvCell(value) { return `"${String(value ?? "").replaceAll('"', '""')}"`; }

  async function exportJSON() {
    const all = await dbRequest("readonly", store => store.getAll());
    download(`bee-wasp-weekbook-${dateISO(new Date())}.json`, JSON.stringify({ format: "mct-bee-wasp-weekbook", version: 1, exportedAt: new Date().toISOString(), records: all }, null, 2), "application/json");
    toast("Complete backup downloaded.");
  }

  async function exportCSV() {
    const all = await dbRequest("readonly", store => store.getAll());
    const rows = [["Year", "Week", "Week start", "Survey complete", "No sightings", "Date", "Group", "Identification", "Plant or surface", "Behavior", "General location", "Notes", "Has photo"]];
    all.sort((a,b) => a.key.localeCompare(b.key)).forEach(record => {
      const observations = record.observations?.length ? record.observations : [{}];
      observations.forEach(obs => rows.push([record.year, record.week, dateISO(weekMonday(record.year, record.week)), recordComplete(record), record.noSightings, obs.date || "", obs.kind || "", obs.name || "", obs.plant || "", obs.behavior || "", obs.location || "", obs.note || "", Boolean(obs.photo)]));
    });
    download(`bee-wasp-weekbook-${dateISO(new Date())}.csv`, rows.map(row => row.map(csvCell).join(",")).join("\n"), "text/csv;charset=utf-8");
    toast("Spreadsheet export downloaded.");
  }

  async function importJSON(file) {
    const text = await file.text(); const data = JSON.parse(text);
    if (data.format !== "mct-bee-wasp-weekbook" || !Array.isArray(data.records)) throw new Error("This is not a Weekbook backup.");
    for (const record of data.records) { if (!record.key || !Array.isArray(record.observations)) continue; await dbRequest("readwrite", store => store.put(record)); }
    await loadRecords(); renderWeeks(); toast(`${data.records.length} weekly records restored.`);
  }

  function apiURL(path, extra = {}) {
    const params = new URLSearchParams({ nelat: BOUNDS.nelat, nelng: BOUNDS.nelng, swlat: BOUNDS.swlat, swlng: BOUNDS.swlng, quality_grade: "research", captive: "false", ...extra });
    return `https://api.inaturalist.org/v1/${path}?${params}`;
  }

  async function fetchAllSpecies(month) {
    const key = `mct-bw-species-${month || "all"}`;
    const cached = JSON.parse(localStorage.getItem(key) || "null");
    if (cached && Date.now() - cached.savedAt < 7 * 86400000) return cached.items;
    const extra = { taxon_id: TAXA.apocrita, per_page: 500, page: 1, ...(month ? { month } : {}) };
    const first = await fetch(apiURL("observations/species_counts", extra));
    if (!first.ok) throw new Error(`iNaturalist returned ${first.status}`);
    const firstData = await first.json(); let results = firstData.results || [];
    const pages = Math.ceil((firstData.total_results || 0) / 500);
    for (let page = 2; page <= pages; page++) {
      const response = await fetch(apiURL("observations/species_counts", { ...extra, page }));
      if (!response.ok) throw new Error(`iNaturalist returned ${response.status}`);
      results = results.concat((await response.json()).results || []);
    }
    const items = results.map(result => {
      const ancestors = result.taxon?.ancestor_ids || [];
      if (ancestors.includes(TAXA.ants) || result.taxon?.id === TAXA.ants) return null;
      const kind = ancestors.includes(TAXA.bees) || result.taxon?.id === TAXA.bees ? "bee" : "wasp";
      return { id: result.taxon.id, name: result.taxon.name, common: result.taxon.preferred_common_name || "", count: result.count, kind };
    }).filter(Boolean).sort((a,b) => b.count - a.count || (a.common || a.name).localeCompare(b.common || b.name));
    try { localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), items })); } catch (_) { /* cache is optional */ }
    return items;
  }

  async function fetchHistogram(taxon) {
    const response = await fetch(apiURL("observations/histogram", { taxon_id: taxon, date_field: "observed", interval: "month_of_year" }));
    if (!response.ok) throw new Error(`iNaturalist returned ${response.status}`);
    const data = await response.json(); const months = data.results?.month_of_year || {};
    return Array.from({ length: 12 }, (_, i) => Number(months[String(i + 1)] || 0));
  }

  async function loadSeasonChart() {
    const cacheKey = "mct-bw-histogram";
    let data = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (!data || Date.now() - data.savedAt > 7 * 86400000) {
      const [apocrita, bees, ants] = await Promise.all([fetchHistogram(TAXA.apocrita), fetchHistogram(TAXA.bees), fetchHistogram(TAXA.ants)]);
      data = { savedAt: Date.now(), bees, wasps: apocrita.map((value, i) => Math.max(0, value - bees[i] - ants[i])) };
      try { localStorage.setItem(cacheKey, JSON.stringify(data)); } catch (_) { /* optional */ }
    }
    const max = Math.max(...data.bees, ...data.wasps, 1);
    $("#season-chart").innerHTML = MONTHS.map((month, i) => `<div class="bw-month-bars" title="${month}: ${data.bees[i]} bee records; ${data.wasps[i]} wasp records"><div class="bw-bar-pair"><i class="bee" style="height:${Math.max(2, data.bees[i] / max * 100)}%"></i><i class="wasp" style="height:${Math.max(2, data.wasps[i] / max * 100)}%"></i></div><b>${month}</b></div>`).join("");
  }

  async function loadSpecies() {
    const month = Number($("#species-month").value);
    state.speciesDisplayLimit = 1000;
    $("#species-status").textContent = "Loading local iNaturalist species…";
    try {
      state.species = await fetchAllSpecies(month);
      state.speciesLoadedMonth = month;
      renderSpecies();
    } catch (error) {
      $("#species-status").textContent = `Live species data could not load: ${error.message}. Try again when connected.`;
      $("#species-list").innerHTML = "";
      $("#species-total").textContent = "Live source unavailable";
      $("#species-scope").textContent = "Your private weekly records still work offline.";
    }
  }

  function renderSpecies() {
    const group = $("#species-group").value;
    const query = $("#species-search").value.trim().toLowerCase();
    const base = state.species.filter(item => group === "all" || item.kind === group);
    const likelyIds = new Set(base.slice(0, 12).map(item => item.id));
    const filtered = base.filter(item => !query || `${item.common} ${item.name}`.toLowerCase().includes(query));
    const shown = filtered.slice(0, state.speciesDisplayLimit);
    const period = state.speciesLoadedMonth ? MONTHS[state.speciesLoadedMonth - 1] : "all-year";
    const beeCount = base.filter(item => item.kind === "bee").length;
    const waspCount = base.filter(item => item.kind === "wasp").length;
    $("#species-total").textContent = `${base.length} recorded species`;
    $("#species-scope").textContent = `${period} selection · ${beeCount} bees · ${waspCount} wasps. Bold marks the 12 most frequently recorded in the selected group.`;
    $("#species-status").textContent = `Showing ${shown.length} of ${filtered.length} matching species.`;
    $("#species-list").innerHTML = shown.map(item => {
      const label = item.common || item.name;
      const display = likelyIds.has(item.id) ? `<strong>${escapeHTML(label)}</strong>` : `<span>${escapeHTML(label)}</span>`;
      const scientific = item.common ? `<em>${escapeHTML(item.name)}</em>` : "";
      return `<li class="${item.kind}"><i class="bw-group-dot" aria-hidden="true"></i><span><a href="https://www.inaturalist.org/taxa/${item.id}" target="_blank" rel="noreferrer">${display}${scientific}</a></span><small title="iNaturalist observations in this period">${item.count}</small></li>`;
    }).join("");
    $("#species-more").hidden = shown.length >= filtered.length;
  }

  function bindEvents() {
    $("#year-select").addEventListener("change", event => { state.year = Number(event.target.value); renderWeeks(); });
    $("#week-filter").addEventListener("change", renderWeeks);
    $("#week-search").addEventListener("input", renderWeeks);
    $("#jump-current").addEventListener("click", () => {
      const current = isoWeek(new Date()); state.year = current.year; $("#year-select").value = current.year; $("#week-filter").value = "all"; renderWeeks();
      requestAnimationFrame(() => document.querySelector(`[data-key="${weekKey(current.year, current.week)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
    });
    $("#week-list").addEventListener("change", event => { if (event.target.matches('[data-action="task"], [data-action="none"]')) updateWeekInput(event.target); });
    $("#week-list").addEventListener("click", event => {
      const button = event.target.closest("button[data-action]"); if (!button) return;
      const week = button.closest(".bw-week"); const action = button.dataset.action;
      if (action === "add") openSighting(week.dataset.key);
      if (action === "edit") openSighting(button.dataset.week, button.dataset.id);
      if (action === "delete") confirmDelete(button.dataset.week, button.dataset.id);
    });
    $("#sighting-form").addEventListener("submit", saveSighting);
    $$('[data-dialog-close]').forEach(button => button.addEventListener("click", () => $("#sighting-dialog").close()));
    $("#obs-photo").addEventListener("change", async event => {
      const file = event.target.files?.[0]; if (!file) return;
      try { state.selectedPhoto = await compressImage(file); state.existingPhoto = ""; updatePhotoPreview(state.selectedPhoto); }
      catch (error) { toast(error.message); event.target.value = ""; }
    });
    $("#remove-photo").addEventListener("click", () => { state.selectedPhoto = ""; state.existingPhoto = ""; $("#obs-photo").value = ""; updatePhotoPreview(""); });
    $("#export-json").addEventListener("click", exportJSON); $("#export-csv").addEventListener("click", exportCSV);
    $("#import-json").addEventListener("change", async event => { try { if (event.target.files?.[0]) await importJSON(event.target.files[0]); } catch (error) { toast(error.message); } finally { event.target.value = ""; } });
    $("#species-month").addEventListener("change", loadSpecies); $("#species-group").addEventListener("change", renderSpecies); $("#species-search").addEventListener("input", renderSpecies);
    $("#species-more").addEventListener("click", () => { state.speciesDisplayLimit += 90; renderSpecies(); });
  }

  async function init() {
    try {
      state.db = await openDB(); await loadRecords(); initializeYears(); bindEvents(); renderWeeks();
      const currentMonth = new Date().getMonth() + 1; $("#species-month").value = String(currentMonth);
      await Promise.allSettled([loadSpecies(), loadSeasonChart()]);
    } catch (error) {
      console.error(error); toast("The local notebook could not start in this browser.");
    }
  }

  init();
})();
