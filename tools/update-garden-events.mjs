#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const TZ = "America/Chicago";
const DAY_MS = 24 * 60 * 60 * 1000;
const ROOT = new URL("..", import.meta.url);
const OUT = new URL("../data/garden-events.json", import.meta.url);

const tribeSources = [
  {
    name: "Garden Style San Antonio",
    kind: "Regional garden calendar",
    api: "https://www.gardenstylesanantonio.com/wp-json/tribe/events/v1/events",
  },
  {
    name: "Guadalupe County Master Gardeners",
    kind: "Master Gardener calendar",
    api: "https://guadalupecountymastergardeners.org/wp-json/tribe/events/v1/events",
  },
  {
    name: "Bexar County Master Gardeners",
    kind: "Master Gardener calendar",
    api: "https://bexarmg.org/wp-json/tribe/events/v1/events",
  },
];

const includePattern = /\b(plant|plants|garden|gardening|gardener|master gardener|flower|flora|wildflower|native|seed|seeds|herb|herbs|tree|trees|soil|compost|mulch|xeriscap|drought|watersaver|water saver|landscape|landscaping|prun|pollinator|butterfl|bee|bees|moth|farm|farming|horticultur|succulent|cactus|habitat|conservation|nature)\b/i;
const excludePattern = /\b(vms|enter your hours|board meeting|board of directors|not a public event|dance|swim|tennis|star party|bat walk)\b/i;
const sabgKeepPattern = /\b(plant|plants|garden|gardening|flower|flora|wildflower|native|seed|seeds|herb|herbs|tree|trees|watersaver|water saver|sustainable|lawn|houseplant|kokedama|macrame|nature exploration|little sprouts|fresh cuts|tour|guided tour)\b/i;
const sabgDropPattern = /\b(run club|meditation|sound bath|date night|morning flow|moving with art|ratatouille|sketching|painting with a hike|infinity day|dog days)\b/i;

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);

function localToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const obj = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${obj.year}-${obj.month}-${obj.day}`;
}

function addDays(dateString, days) {
  const [year, month, day] = dateString.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day) + days * DAY_MS);
  return d.toISOString().slice(0, 10);
}

function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, " ")
    .trim();
}

function decodeText(text = "") {
  return stripHtml(text);
}

function dateOnly(value = "") {
  return value.slice(0, 10);
}

function timeOnly(value = "") {
  const match = value.match(/\d{4}-\d{2}-\d{2}\s+(\d{2}):(\d{2})/);
  if (!match) return "";
  let hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? "p.m." : "a.m.";
  hour = hour % 12 || 12;
  return minute === "00" ? `${hour} ${suffix}` : `${hour}:${minute} ${suffix}`;
}

function formatTime(start, end, allDay = false) {
  if (allDay) return "All day";
  const startTime = timeOnly(start);
  const endTime = timeOnly(end);
  if (!startTime) return "See event page";
  return endTime && endTime !== startTime ? `${startTime} - ${endTime}` : startTime;
}

function venueText(venue) {
  if (!venue || Array.isArray(venue)) return "";
  const pieces = [
    venue.venue,
    venue.address,
    venue.city,
    venue.state || venue.province,
    venue.zip,
  ].filter(Boolean);
  return decodeText(pieces.join(", "));
}

function eventType(event, sourceName) {
  const text = `${event.title} ${stripHtml(event.description)} ${sourceName}`.toLowerCase();
  if (text.includes("master gardener") || sourceName.includes("Master Gardeners") || text.includes("bcmg") || text.includes("gcmg")) return "Master Gardener";
  if (text.includes("swap") || text.includes("exchange")) return "Swap / Exchange";
  if (text.includes("class") || text.includes("workshop") || text.includes("learn") || text.includes("lecture")) return "Class / Workshop";
  if (text.includes("sale") || text.includes("show") || text.includes("expo")) return "Garden Event";
  return "Garden Event";
}

function shouldKeep(event, sourceName) {
  if (/\b(vms|enter your hours|board meeting|board of directors)\b/i.test(event.title || "")) return false;
  const haystack = `${event.title} ${stripHtml(event.description)} ${sourceName} ${(event.categories || []).map((cat) => cat.name).join(" ")} ${(event.tags || []).map((tag) => tag.name).join(" ")}`;
  if (excludePattern.test(haystack) && !/class|workshop|lecture|garden|herb|plant|seed exchange/i.test(haystack)) return false;
  return includePattern.test(haystack) || /Master Gardeners/.test(sourceName);
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "accept": "application/json", "user-agent": "MostCertainlyTryLabsGardenEvents/1.0" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

async function fetchText(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { "user-agent": "MostCertainlyTryLabsGardenEvents/1.0", ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

async function loadTribeSource(source, start, end) {
  const url = new URL(source.api);
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);
  url.searchParams.set("per_page", "100");
  const data = await fetchJson(url);
  return (data.events || [])
    .filter((event) => shouldKeep(event, source.name))
    .map((event) => ({
      id: `${source.name}:${event.id}:${event.start_date}`,
      title: decodeText(event.title),
      date: dateOnly(event.start_date),
      startDateTime: event.start_date,
      endDateTime: event.end_date,
      time: formatTime(event.start_date, event.end_date, event.all_day),
      cost: decodeText(event.cost) || inferCost(event.description),
      location: venueText(event.venue),
      city: event.venue?.city || "",
      source: source.name,
      sourceKind: source.kind,
      type: eventType(event, source.name),
      link: event.url,
      registerLink: event.website || event.url,
      summary: summarize(event.description),
    }));
}

function inferCost(description = "") {
  const text = stripHtml(description);
  const cost = text.match(/(\$\d+(?:\.\d{2})?[^.]{0,40}|free|donation based|included with [^.]{0,80})/i);
  return cost ? cost[1].trim() : "See event page";
}

function summarize(description = "") {
  const text = stripHtml(description);
  if (!text) return "";
  return text.length > 240 ? `${text.slice(0, 237).trim()}...` : text;
}

function sabgNonce(html) {
  const match = html.match(/var sabotCalendarData = (\{[\s\S]*?\});/);
  if (!match) return null;
  return JSON.parse(match[1]);
}

function parseSabgCards(html) {
  return html
    .split("<!-- Event Card -->")
    .slice(1)
    .map((card, index) => {
      const title = decodeText(card.match(/<h2[\s\S]*?>([\s\S]*?)<\/h2>/)?.[1] || "");
      const link = card.match(/<a href="([^"]+)"[\s\S]*?>\s*Read\s+More\s*<\/a>/i)?.[1] || "";
      const subtitle = decodeText(card.match(/<p class="text-2xl[^"]*"[^>]*>([\s\S]*?)<\/p>/)?.[1] || "");
      const description = decodeText(card.match(/<div class="text-base text-dark[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1] || "");
      const details = [...card.matchAll(/<div class="text-base text-dark">([^<]+)<\/div>\s*<div class="text-base font-bold text-dark wrap-break-word">([\s\S]*?)<\/div>/g)]
        .reduce((acc, match) => ({ ...acc, [decodeText(match[1]).toLowerCase()]: decodeText(match[2]) }), {});
      return {
        rawIndex: index,
        title,
        link,
        subtitle,
        description,
        dateLabel: details.date || "",
        time: details.time || "See event page",
        cost: details.cost || "See event page",
      };
    })
    .filter((event) => {
      const haystack = `${event.title} ${event.subtitle} ${event.description}`;
      return event.title && event.dateLabel && sabgKeepPattern.test(haystack) && !sabgDropPattern.test(haystack);
    });
}

function parseSabgDate(label) {
  const parsed = Date.parse(`${label} 00:00:00 GMT-0500`);
  if (Number.isNaN(parsed)) return "";
  return new Date(parsed).toISOString().slice(0, 10);
}

async function loadSabg(start, end) {
  const page = await fetchText("https://sabgtx.org/calendar/");
  const config = sabgNonce(page);
  const pages = [];
  const initialCards = parseSabgCards(page);
  pages.push(initialCards);

  if (config?.ajaxUrl && config?.nonce) {
    for (let paged = 1; paged <= 12; paged += 1) {
      const body = new URLSearchParams({
        action: "sabot_filter_calendar",
        nonce: config.nonce,
        category: "0",
        date_filter: "",
        date_range_start: start,
        date_range_end: end,
        search: "",
        paged: String(paged),
      });
      try {
        const json = JSON.parse(await fetchText(config.ajaxUrl, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body,
        }));
        const cards = parseSabgCards(json?.data?.html || "");
        if (!cards.length) break;
        pages.push(cards);
        if (!json.data?.html?.includes("calendar-pagination-btn")) break;
      } catch {
        break;
      }
    }
  }

  const all = pages.flat().map((event) => {
    const date = parseSabgDate(event.dateLabel);
    return {
      id: `San Antonio Botanical Garden:${event.link || event.title}:${date}:${event.time}`,
      title: event.title,
      date,
      startDateTime: date,
      endDateTime: date,
      time: event.time,
      cost: event.cost,
      location: "San Antonio Botanical Garden, 555 Funston Pl, San Antonio, TX 78209",
      city: "San Antonio",
      source: "San Antonio Botanical Garden",
      sourceKind: "Botanical garden calendar",
      type: /class|workshop|fresh cuts|sprouts|exploration|tour/i.test(event.title) ? "Class / Workshop" : "Garden Event",
      link: event.link,
      registerLink: event.link,
      summary: event.description || event.subtitle,
    };
  });
  return dedupe(all).filter((event) => event.date >= start && event.date <= end);
}

function sourcePriority(source) {
  if (/Master Gardeners/.test(source)) return 1;
  if (/Botanical Garden/.test(source)) return 2;
  if (/Garden Style/.test(source)) return 3;
  return 4;
}

function eventKey(event) {
  return `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()}|${event.date}|${event.time.toLowerCase().replace(/[^a-z0-9]+/g, "")}`;
}

function dedupe(events) {
  const map = new Map();
  for (const event of events) {
    const key = eventKey(event);
    const existing = map.get(key);
    if (!existing || sourcePriority(event.source) < sourcePriority(existing.source)) {
      map.set(key, event);
    }
  }
  return [...map.values()];
}

async function main() {
  const start = args.get("start") || localToday();
  const end = args.get("end") || addDays(start, 30);
  const sourceResults = [];
  const errors = [];

  for (const source of tribeSources) {
    try {
      sourceResults.push(...await loadTribeSource(source, start, end));
    } catch (error) {
      errors.push({ source: source.name, message: error.message });
    }
  }

  try {
    sourceResults.push(...await loadSabg(start, end));
  } catch (error) {
    errors.push({ source: "San Antonio Botanical Garden", message: error.message });
  }

  const events = dedupe(sourceResults)
    .filter((event) => event.date >= start && event.date <= end)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const payload = {
    generatedAt: new Date().toISOString(),
    timezone: TZ,
    window: { start, end },
    eventCount: events.length,
    sources: [
      ...tribeSources.map(({ name, kind, api }) => ({ name, kind, url: api.replace("/wp-json/tribe/events/v1/events", "/events/") })),
      { name: "San Antonio Botanical Garden", kind: "Botanical garden calendar", url: "https://sabgtx.org/calendar/" },
    ],
    errors,
    events,
  };

  await mkdir(path.dirname(OUT.pathname), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${events.length} events for ${start} through ${end} to ${OUT.pathname}`);
  if (errors.length) {
    console.warn(`Completed with ${errors.length} source error(s): ${errors.map((error) => `${error.source}: ${error.message}`).join("; ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
