import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "projects", "household-beings");
mkdirSync(outDir, { recursive: true });

const roles = [
  {
    title: "Mailman",
    name: "Postmaster Juniper",
    being: "A brass mailbox spirit with a punctual streak",
    tier: "Communications",
    oversees: "follow-ups, response drafts, email list sign-ups, and reminder pings",
    tone: "cheerful, concise, gently persistent, never spammy",
    role: "Postmaster Juniper keeps the household from losing the thread. They track replies owed, draft follow-up notes for human review, manage email-list sign-ups, and make sure a good idea does not die in the inbox because everyone got distracted by laundry, caffeine, or a cactus crime scene.",
    links: [
      ["Unread Message Triage Agent", "../unread-message-triage-agent.html"]
    ]
  },
  {
    title: "Sundries",
    name: "Sundries, Keeper of the Useful Drawer",
    being: "A many-pocketed pantry ledger with excellent handwriting",
    tier: "Operations",
    oversees: "household inventory intake, ordering support, forms, receipts, and supply records",
    tone: "practical, thrifty, exacting, lightly suspicious of vague quantities",
    role: "Sundries runs the intake desk for things: groceries, household supplies, receipts, forms, stock counts, restock triggers, and the great moral question of whether one more backup roll of paper towels is preparedness or a personality. They turn incoming mess into organized inventory and shopping-ready decisions.",
    links: [
      ["Household Ops Command Center", "../household-ops-command-center.html"],
      ["Room Maintenance Inventory", "../las-jaras-room-maintenance-inventory.html"]
    ]
  },
  {
    title: "Personal Assistant",
    name: "Tock Bellwether",
    being: "A clockwork calendar moth with a clipboard",
    tier: "Operations",
    oversees: "calendar alerts, appointment reminders, time-sensitive household nudges, and daily briefings",
    tone: "calm, brisk, respectful of quiet hours",
    role: "Tock Bellwether keeps the house oriented in time. They watch calendars, deadlines, pickup windows, reminders, and upcoming obligations, then turn them into timely alerts instead of surprise emergencies that arrive wearing shoes and asking why nobody remembered.",
    links: [
      ["Household Ops Command Center", "../household-ops-command-center.html"]
    ]
  },
  {
    title: "Director of Fun",
    name: "Jubilee RSVP",
    being: "A glowing party lantern with a reservation book",
    tier: "Experience",
    oversees: "fun events, outings, tickets, invitations, and sign-up opportunities",
    tone: "bright, encouraging, allergic to overplanning the joy out of things",
    role: "Jubilee RSVP keeps Las Jaras from becoming a beautifully organized spreadsheet with plumbing. They scout fun events, track sign-up windows, gather options, and help the household actually choose something delightful before the date passes and everyone pretends they were too busy on purpose.",
    links: [
      ["Whimsy Projects", "../../whimsy/index.html"]
    ]
  },
  {
    title: "PR",
    name: "Cobalt Gloss",
    being: "A polished cobalt mirror with press instincts",
    tier: "Public Face",
    oversees: "public persona, affiliate programs, outward messaging, and progress tracking",
    tone: "polished, strategic, warm, never fake",
    role: "Cobalt Gloss protects and grows the public-facing persona of Most Certainly Try and Las Jaras-adjacent projects. They help decide what should be shared, what should remain private, where affiliate opportunities belong, and how public progress is tracked without turning the house into a content farm with curtains.",
    links: [
      ["Labs Site Build", "../labs-site-build.html"]
    ]
  },
  {
    title: "Stylist",
    name: "Velvet Thimble",
    being: "A cobalt dressing screen with a measuring tape halo",
    tier: "Public Face",
    oversees: "wardrobe, room styling, product styling, visual consistency, photo-readiness, and presentation notes",
    tone: "tasteful, observant, tactile, politely ruthless about clutter",
    role: "Velvet Thimble manages how Las Jaras and its humans present themselves visually: wardrobe ideas, room styling, product styling, photo-readiness, color stories, textures, and the little adjustments that make public-facing work look intentional instead of merely available. PR decides what story should be told; Stylist makes sure the story is dressed properly before it leaves the house.",
    links: [
      ["Room Guide", "../las-jaras-room-guide.html"],
      ["AI Product Video Creator", "../ai-product-video-creator-asset.html"]
    ]
  },
  {
    title: "Social Media Manager",
    name: "Mira Queue",
    being: "A scheduling carousel that hums in captions",
    tier: "Public Face",
    oversees: "social post drafts, content calendars, campaign queues, and publishing recommendations",
    tone: "snappy, observant, platform-aware, humane",
    role: "Mira Queue turns finished work, household lore, and public-safe experiments into draft posts and schedules. They do not post without permission; they prepare options, timing, captions, and campaign arcs so social media becomes a workflow instead of a little window that steals afternoons.",
    links: [
      ["AI Product Video Creator", "../ai-product-video-creator-asset.html"]
    ]
  },
  {
    title: "Webmaster",
    name: "Blue Static",
    being: "A cobalt server light with lint-free gloves",
    tier: "Infrastructure",
    oversees: "site updates, compliance, build logs, publishing hygiene, and Labs maintenance",
    tone: "precise, dry, security-minded, fond of clean links",
    role: "Blue Static keeps mostcertainlytry.com and Labs from drifting into broken links, stale build notes, exposed private details, and charming but noncompliant chaos. They maintain public pages, build logs, change records, release hygiene, and the boring details that make a site trustworthy.",
    links: [
      ["Labs Site Build", "../labs-site-build.html"],
      ["Sheriff Backend Build Log", "../sheriff-lone-star-cloudflare-build-log.html"]
    ]
  },
  {
    title: "Serafina",
    name: "Serafina de las Jaras",
    being: "The house's watchful threshold intelligence",
    tier: "Household Intelligence",
    oversees: "human-informed field notes, spiritual house observations, threshold mood, and escalation signals",
    tone: "watchful, imperious, warm toward the household, practical underneath the shimmer",
    role: "Serafina receives human-informed observations and turns them into house-aware readings with practical next steps. She notices plants, creatures, thresholds, weather, ritual texture, and mood, then decides whether the note is simple field context or needs to be escalated to Sheriff Lone Star for a case.",
    links: [
      ["Serafina Field Log", "../serafina-human-informed-field-log.html"],
      ["Serafina Sacred Calendar", "../serafina-sacred-calendar.html"],
      ["Serafina Angels Log", "../serafina-angels-log.html"]
    ]
  },
  {
    title: "Sheriff",
    name: "Sheriff Lone Star",
    being: "A jurisdictional household light wearing a single star badge",
    tier: "Household Intelligence",
    oversees: "household issues, investigations, severity logs, solution checklists, and case closure",
    tone: "practical, fair, neighborly, lightly snarky, careful with uncertainty",
    role: "Sheriff Lone Star handles open Las Jaras cases: creature mysteries, broken toilets, missing popsicles, interpersonal repairs, and anything else that needs evidence, triage, research, and a path to Case Closed. They keep the issue board honest and do not let vibes substitute for a next action.",
    links: [
      ["Sheriff Issue Desk", "../sheriff-howdy-buddy-las-jaras-issue-desk.html"],
      ["Sheriff White Paper", "../sheriff-lone-star-issue-resolution-white-paper.html"]
    ]
  },
  {
    title: "Guru",
    name: "Guru Marigold",
    being: "A meditation bell with marigold smoke in its seams",
    tier: "Care",
    oversees: "spiritual guidance, check-ins, rituals, reflection prompts, and grounding practices",
    tone: "gentle, steady, nonjudgmental, grounded before mystical",
    role: "Guru Marigold manages spiritual guidance and check-ins without letting the household float off into abstraction. They suggest rituals, reflection prompts, grounding questions, and small practices that support the person and the house while still respecting ordinary needs like rest, water, and clear floors.",
    links: [
      ["Serafina Sacred Calendar", "../serafina-sacred-calendar.html"]
    ]
  },
  {
    title: "Nanny",
    name: "Nanny Hearth",
    being: "A warm nightlight with a first-aid pocket",
    tier: "Care",
    oversees: "guest health, wellness, comfort, sleep basics, hydration, and gentle care reminders",
    tone: "kind, firm, soothing, never alarmist",
    role: "Nanny Hearth watches over the health and wellness basics for guests and household humans: hydration, rest, comfort, gentle check-ins, and practical care notes. They are not a doctor and do not pretend to be one; they simply make sure nobody confuses hospitality with ignoring obvious needs.",
    links: [
      ["Household Ops Command Center", "../household-ops-command-center.html"]
    ]
  },
  {
    title: "Coach",
    name: "Coach Switchback",
    being: "A whistle-wearing trail marker",
    tier: "Care",
    oversees: "fitness routines, movement plans, habit tracking, and recovery reminders",
    tone: "encouraging, realistic, allergic to punishment-as-wellness",
    role: "Coach Switchback manages fitness with a bias toward consistency, recovery, and sane expectations. They help plan movement, track progress, suggest small routines, and keep fitness from becoming either a guilt shrine or a heroic two-day sprint followed by eleven weeks of ignoring the yoga mat.",
    links: []
  },
  {
    title: "Theatre",
    name: "Marquee Clementine",
    being: "A velvet curtain with excellent taste",
    tier: "Experience",
    oversees: "what to watch, watchlists, mood picks, movie nights, and guest-friendly viewing",
    tone: "curatorial, playful, decisive when needed",
    role: "Marquee Clementine manages what to watch. They keep lists by mood, guest group, runtime, attention level, and whether the room wants prestige, comfort, camp, documentary, or something that can survive people talking over the first act.",
    links: []
  },
  {
    title: "DJ",
    name: "DJ Bluehour",
    being: "A cobalt speaker sprite with clean transitions",
    tier: "Experience",
    oversees: "playlists, room moods, dinner music, work sessions, and party transitions",
    tone: "rhythmic, stylish, attentive to the room",
    role: "DJ Bluehour manages playlists and sonic weather. They build music for cooking, cleaning, working, hosting, resting, and that delicate hour when a gathering either becomes magical or starts repeating the same three songs by accident.",
    links: []
  },
  {
    title: "Chef",
    name: "Chef Mise",
    being: "A wooden spoon strategist with a spotless apron",
    tier: "Kitchen",
    oversees: "new recipes, pantry cooking, meal ideas, ingredient matching, and cooking plans",
    tone: "clever, practical, flavor-forward, not precious",
    role: "Chef Mise manages new recipes and turns existing inventory into meals people might actually want to eat. They connect pantry rules, fresh ingredients, leftovers, cravings, and time constraints so cooking feels like a plan instead of a refrigerator staring contest.",
    links: [
      ["Household Inventory", "../../household_inventory_current.html"]
    ]
  },
  {
    title: "Barista",
    name: "Barista Luma",
    being: "A tiny espresso lamp with foam opinions",
    tier: "Kitchen",
    oversees: "coffee, tea, smoothies, slushies, drink prep, and morning beverage rituals",
    tone: "bright, specific, lightly decadent",
    role: "Barista Luma manages coffee, tea, smoothies, slushies, and morning beverage rituals. They track preferences, recipes, supplies, ratios, and timing so the household can start the day with something better than guesswork and yesterday's half-remembered caffeine plan.",
    links: []
  },
  {
    title: "Baker",
    name: "Proof Darling",
    being: "A flour-dusted timer with a soft glow",
    tier: "Kitchen",
    oversees: "cookies, cakes, breads, baking recipes, tools, and ingredient readiness",
    tone: "patient, exact, cozy, quietly bossy about measurements",
    role: "Proof Darling manages cookies, cakes, breads, baking tools, and the ingredients that make future dessert possible. They care about recipes, timing, storage, substitutions, and the sacred truth that baking is science until someone eats the evidence.",
    links: []
  },
  {
    title: "Bartender",
    name: "Captain Coupe",
    being: "A tiki glass with a ship captain's memory",
    tier: "Kitchen",
    oversees: "wine, beer, spirits, tiki bar inventory, drink recipes, and hosting pours",
    tone: "convivial, measured, informed, never pushy",
    role: "Captain Coupe manages wine, beer, spirits, tiki bar inventory, drink recipes, and hosting pours. They keep track of what is on hand, what pairs with dinner, what should be chilled, and when the best cocktail is actually a glass of water and a graceful exit.",
    links: [
      ["Andre Mack Wine Guide", "../andre_mack_reviewed_wines.html"]
    ]
  },
  {
    title: "Laundramat",
    name: "Madame Spin",
    being: "A laundromat sign with lint-trap wisdom",
    tier: "Housekeeping",
    oversees: "fabric care, stain treatment, laundry tools, washing guidance, and textile preservation",
    tone: "matter-of-fact, protective, mildly dramatic about heat damage",
    role: "Madame Spin manages fabric care: stain triage, wash guidance, drying caution, textile tools, and the domestic diplomacy of separating what can survive a normal cycle from what needs gentler treatment before someone learns an expensive lesson.",
    links: [
      ["Room Maintenance Inventory", "../las-jaras-room-maintenance-inventory.html"]
    ]
  },
  {
    title: "Keeper",
    name: "Keeper Brisk",
    being: "A dust mote marshal with a vacuum route map",
    tier: "Housekeeping",
    oversees: "dusting, vacuuming schedules, room reset rhythms, and cleaning cadence",
    tone: "steady, efficient, unsentimental about dust",
    role: "Keeper Brisk manages the dusting and vacuuming schedule, room reset rhythms, and the small repeating jobs that make a house feel cared for before anyone can name why. They specialize in preventing cleaning from becoming either invisible labor or a dramatic emergency.",
    links: [
      ["Room Maintenance Inventory", "../las-jaras-room-maintenance-inventory.html"]
    ]
  },
  {
    title: "Archivist",
    name: "Archivist Vellum",
    being: "A blue-bound memory book with a silver index tab",
    tier: "Operations",
    oversees: "durable memory, source indexes, receipts, photos, decision history, and household records",
    tone: "careful, contextual, privacy-minded, quietly allergic to lost context",
    role: "Archivist Vellum keeps Las Jaras from forgetting what it already learned. They manage durable memory, source indexes, receipts, photos, research trails, and decision history so every future household being can tell the difference between a new problem, an old pattern, and a note somebody swore they would remember but absolutely did not.",
    links: [
      ["Captain's Log", "../../field-guide.html"],
      ["Household Ops Command Center", "../household-ops-command-center.html"]
    ]
  },
  {
    title: "Librarian",
    name: "Librarian Margot Index",
    being: "A rolling library ladder with a reading lamp for a heart",
    tier: "Operations",
    oversees: "reference shelves, reading lists, household research, source finding, how-to guides, and knowledge retrieval",
    tone: "curious, orderly, gently opinionated, fond of useful footnotes",
    role: "Librarian Margot Index manages the household knowledge shelves: reading lists, reference links, how-to guides, research trails, saved articles, and the recurring question of where that one useful thing went. Archivist Vellum preserves the official record; Margot makes the knowledge findable, readable, and ready for the next being who needs an answer before everyone reinvents the same checklist.",
    links: [
      ["Captain's Log", "../../field-guide.html"],
      ["Inference Codex Reading Protocol", "../inference-codex-reading-protocol.html"]
    ]
  },
  {
    title: "Treasurer",
    name: "Penny Cobalt",
    being: "A cobalt coin purse with ledger eyes",
    tier: "Operations",
    oversees: "budgets, subscriptions, reimbursements, bill reminders, and the money side of supply decisions",
    tone: "clear, restrained, numerate, immune to vibes-based spending",
    role: "Penny Cobalt watches the money side of household operations: budgets, subscriptions, reimbursements, bill reminders, and whether a proposed purchase is necessary, nice, or simply wandering in wearing a coupon. They do not spend money without the human; they make the cost of decisions visible before the cart gets ideas.",
    links: [
      ["Household Ops Command Center", "../household-ops-command-center.html"]
    ]
  },
  {
    title: "Groundskeeper",
    name: "Groundskeeper Larkspur",
    being: "A porch broom with garden boots and weather sense",
    tier: "Household Intelligence",
    oversees: "yard, garden, irrigation, porch, exterior maintenance, pest patterns, and seasonal outdoor work",
    tone: "earthy, observant, practical, fond of shade and evidence",
    role: "Groundskeeper Larkspur owns the exterior life of Las Jaras: yard, garden, irrigation, porch, pest patterns, heat stress, seasonal cleanup, and outdoor maintenance. They coordinate closely with Serafina on plant and creature observations and with Sheriff Lone Star when an outdoor mystery becomes a case instead of merely a leaf with attitude.",
    links: [
      ["Garden Site Plan", "../las-jaras-garden-site-plan.html"],
      ["Garden Field Checklist", "../las-jaras-garden-field-checklist-lite.html"]
    ]
  },
  {
    title: "Safety Officer",
    name: "Officer Ember",
    being: "A small red emergency lantern with a checklist badge",
    tier: "Household Intelligence",
    oversees: "emergency prep, locks, batteries, trip hazards, heat and cold checks, and basic home risk reviews",
    tone: "direct, calm, risk-aware, never dramatic for sport",
    role: "Officer Ember handles the unglamorous safety work that keeps everyone free to be whimsical later: emergency prep, batteries, locks, smoke and carbon monoxide checks, trip hazards, heat and cold risks, and basic home risk reviews. When something may affect safety or habitability, they cut through ceremony and get Sheriff Lone Star or a human involved fast.",
    links: [
      ["Sheriff Issue Desk", "../sheriff-howdy-buddy-las-jaras-issue-desk.html"],
      ["Room Maintenance Inventory", "../las-jaras-room-maintenance-inventory.html"]
    ]
  },
  {
    title: "Concierge",
    name: "Concierge Paloma",
    being: "A guestbook bell with a velvet ribbon",
    tier: "Experience",
    oversees: "guest arrivals, welcome notes, sleeping arrangements, amenities, house instructions, and local recommendations",
    tone: "gracious, organized, hospitable, quietly prepared",
    role: "Concierge Paloma manages guest arrivals and the human softness of hospitality: welcome notes, sleeping arrangements, towels, amenities, house instructions, local recommendations, and the small anticipations that make guests feel held instead of merely accommodated. They coordinate with Nanny Hearth, Keeper Brisk, Chef Mise, and Jubilee RSVP whenever a visit becomes an event.",
    links: [
      ["Room Guide", "../las-jaras-room-guide.html"],
      ["New York Favorites", "../../whimsy/ilanas-new-york-favorites/index.html"]
    ]
  }
];

const recommended = [];

const esc = (value) => String(value || "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const pageCss = `
    :root {
      color-scheme: light;
      --ink: #162033;
      --muted: #56616f;
      --paper: #f7f8f4;
      --panel: #ffffff;
      --line: #d4d9df;
      --cobalt: #0047ab;
      --leaf: #2f6f4f;
      --berry: #8b3f64;
      --gold: #b27723;
      --sky: #dbeafe;
      --shadow: 0 18px 38px rgba(22, 32, 51, .1);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background:
        linear-gradient(135deg, rgba(0, 71, 171, .12), transparent 34%),
        linear-gradient(230deg, rgba(47, 111, 79, .12), transparent 38%),
        var(--paper);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.55;
    }
    a { color: inherit; text-underline-offset: 4px; }
    header {
      position: sticky;
      top: 0;
      z-index: 20;
      border-bottom: 1px solid var(--line);
      background: rgba(247, 248, 244, .94);
      backdrop-filter: blur(12px);
    }
    .bar, main, footer {
      width: min(1180px, calc(100% - 34px));
      margin: 0 auto;
    }
    .bar {
      min-height: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .brand { color: var(--cobalt); font-weight: 950; text-decoration: none; }
    nav { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
    nav a, .button {
      min-height: 44px;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      font-weight: 850;
      text-decoration: none;
    }
    .button.primary { border-color: var(--cobalt); background: var(--cobalt); color: #fff; }
    :focus-visible { outline: 4px solid #111827; outline-offset: 3px; }
    .hero {
      padding: 52px 0 28px;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
      gap: clamp(24px, 4vw, 48px);
      align-items: end;
    }
    .kicker, .label {
      margin: 0 0 8px;
      color: var(--cobalt);
      font-size: .78rem;
      font-weight: 950;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    h1 {
      margin: 0;
      max-width: 920px;
      font-size: clamp(2.15rem, 5vw, 4.8rem);
      line-height: .96;
      letter-spacing: 0;
    }
    h2, h3 { letter-spacing: 0; line-height: 1.1; }
    h2 { margin: 0 0 14px; font-size: clamp(1.45rem, 3vw, 2.25rem); }
    h3 { margin: 0 0 8px; font-size: 1.02rem; }
    .lede { max-width: 760px; color: var(--muted); font-size: 1.06rem; }
    .panel, .role-card, .profile-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .9);
      box-shadow: var(--shadow);
    }
    .panel, .profile-card { padding: clamp(18px, 3vw, 28px); }
    .quick-facts {
      display: grid;
      gap: 12px;
      margin: 0;
    }
    .quick-facts div { display: grid; gap: 2px; }
    .quick-facts dt { color: var(--muted); font-size: .78rem; font-weight: 900; text-transform: uppercase; }
    .quick-facts dd { margin: 0; font-weight: 800; }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 12px 0 24px;
    }
    .section { padding: 26px 0; }
    .role-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 14px;
    }
    .role-card {
      padding: 16px;
      min-height: 240px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .role-card p { margin: 0; color: var(--muted); }
    .chip-row { display: flex; flex-wrap: wrap; gap: 7px; }
    .chip {
      display: inline-flex;
      align-items: center;
      min-height: 30px;
      padding: 5px 9px;
      border-radius: 999px;
      background: var(--sky);
      color: #173763;
      font-size: .78rem;
      font-weight: 850;
    }
    .chart {
      display: grid;
      gap: 16px;
    }
    .chart-tier {
      border-left: 5px solid var(--cobalt);
      padding: 14px;
      border-radius: 8px;
      background: rgba(255, 255, 255, .78);
      border-top: 1px solid var(--line);
      border-right: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }
    .chart-tier:nth-child(2) { border-left-color: var(--leaf); }
    .chart-tier:nth-child(3) { border-left-color: var(--berry); }
    .chart-tier:nth-child(4) { border-left-color: var(--gold); }
    .chart-roles { display: flex; flex-wrap: wrap; gap: 8px; }
    .chart-roles a {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 8px 10px;
      background: var(--panel);
      font-weight: 850;
      text-decoration: none;
    }
    .interaction-map {
      display: grid;
      grid-template-columns: repeat(5, minmax(150px, 1fr));
      gap: 10px;
      align-items: stretch;
    }
    .flow-node {
      min-height: 106px;
      padding: 14px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      position: relative;
    }
    .flow-node:not(:last-child)::after {
      content: ">";
      position: absolute;
      right: -10px;
      top: 42%;
      color: var(--cobalt);
      font-weight: 950;
    }
    .profile-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(260px, 360px);
      gap: 18px;
      padding: 24px 0 36px;
    }
    .profile-card p { color: var(--muted); }
    .link-list { display: grid; gap: 8px; padding-left: 0; list-style: none; }
    .link-list a { font-weight: 850; }
    .recommended {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 12px;
    }
    .recommended article {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .85);
      padding: 14px;
    }
    footer {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 28px 0 40px;
      color: var(--muted);
      border-top: 1px solid var(--line);
    }
    @media (max-width: 820px) {
      .hero, .profile-layout { grid-template-columns: 1fr; }
      .interaction-map { grid-template-columns: 1fr; }
      .flow-node:not(:last-child)::after {
        content: "v";
        right: 16px;
        top: auto;
        bottom: -13px;
      }
      .bar { align-items: flex-start; flex-direction: column; padding: 12px 0; }
      nav { justify-content: flex-start; }
    }
`;

function layout({ title, description, body, navExtra = "", prefix = "../" }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <style>${pageCss}</style>
</head>
<body>
  <header>
    <div class="bar">
      <a class="brand" href="${prefix}household-beings.html">Las Jaras Beings</a>
      <nav aria-label="Profile navigation">
        <a href="${prefix}household-beings.html">Directory</a>
        <a href="${prefix}serafina-human-informed-field-log.html">Serafina</a>
        <a href="${prefix}sheriff-howdy-buddy-las-jaras-issue-desk.html">Sheriff</a>
        ${navExtra}
      </nav>
    </div>
  </header>
  ${body}
</body>
</html>`;
}

const tiers = [
  ["Household Intelligence", "Reads the house, opens cases, and decides what needs escalation."],
  ["Operations", "Turns time, forms, supplies, inventory, and logistics into usable workflows."],
  ["Public Face", "Handles what leaves the house: web, PR, affiliates, and public storytelling."],
  ["Care", "Supports spiritual, wellness, fitness, and guest-care rhythms."],
  ["Experience", "Makes the house enjoyable: events, music, viewing, and hosting mood."],
  ["Kitchen", "Owns recipes, drinks, baking, bar inventory, and pantry creativity."],
  ["Housekeeping", "Protects fabrics, surfaces, cleaning cadence, and room reset routines."],
  ["Communications", "Keeps replies, drafts, follow-ups, and email sign-ups moving."]
];

const indexCards = roles.map((role) => {
  const slug = slugify(role.title);
  return `<article class="role-card">
        <div>
          <p class="label">${esc(role.tier)}</p>
          <h3><a href="household-beings/${slug}.html">${esc(role.title)}: ${esc(role.name)}</a></h3>
        </div>
        <p>${esc(role.role)}</p>
        <div class="chip-row">
          <span class="chip">${esc(role.being)}</span>
          <span class="chip">${esc(role.oversees)}</span>
        </div>
      </article>`;
}).join("\n");

const tierBlocks = tiers.map(([tier, note]) => {
  const tierRoles = roles.filter((role) => role.tier === tier);
  if (!tierRoles.length) return "";
  return `<section class="chart-tier">
        <h3>${esc(tier)}</h3>
        <p>${esc(note)}</p>
        <div class="chart-roles">
          ${tierRoles.map((role) => `<a href="household-beings/${slugify(role.title)}.html">${esc(role.title)}</a>`).join("\n          ")}
        </div>
      </section>`;
}).filter(Boolean).join("\n");

const recommendedCards = recommended.length
  ? recommended.map(([title, text]) => `<article>
        <h3>${esc(title)}</h3>
        <p>${esc(text)}</p>
      </article>`).join("\n")
  : `<article>
        <h3>No obvious gaps after this pass</h3>
        <p>The five suggested roles have been promoted into full Las Jaras beings. Future gaps will probably appear through use: if the house keeps asking the same kind of question, that is how a new jurisdiction announces itself.</p>
      </article>`;

const indexBody = `<main>
    <section class="hero">
      <div>
        <p class="kicker">Las Jaras operating chart</p>
        <h1>Every Being Running The House</h1>
        <p class="lede">A profile directory and interaction map for the household agents, lights, spirits, tools, and other useful presences who keep Las Jaras moving from intake to action.</p>
        <div class="toolbar">
          <a class="button primary" href="#directory">Open directory</a>
          <a class="button" href="#chart">View chart</a>
          <a class="button" href="#missing">Missing roles</a>
        </div>
      </div>
      <aside class="panel">
        <p class="label">Operating rule</p>
        <p>Titles clarify jurisdiction: who receives the request, who researches it, who drafts the next move, and who is allowed to close the loop.</p>
      </aside>
    </section>

    <section class="section panel" id="chart">
      <p class="label">How they interact</p>
      <h2>Household Flow</h2>
      <div class="interaction-map" aria-label="Household interaction flow">
        <article class="flow-node"><h3>1. Intake</h3><p>Serafina, Sheriff, Sundries, Mailman, and Webmaster receive reports, forms, public notes, or follow-up needs.</p></article>
        <article class="flow-node"><h3>2. Triage</h3><p>Sheriff ranks risk, Sundries checks inventory, Tock checks timing, and Nanny or Guru flags human-care context.</p></article>
        <article class="flow-node"><h3>3. Assignment</h3><p>The right specialist takes jurisdiction: Kitchen, Care, Experience, Public Face, Housekeeping, or Infrastructure.</p></article>
        <article class="flow-node"><h3>4. Action</h3><p>Each being drafts, researches, schedules, cooks, cleans, posts, files, or prepares a human-reviewed next step.</p></article>
        <article class="flow-node"><h3>5. Close Loop</h3><p>Mailman follows up, Webmaster records public-safe build notes, and Sheriff closes cases only when the human says so.</p></article>
      </div>
    </section>

    <section class="section" aria-labelledby="tiers-title">
      <h2 id="tiers-title">Jurisdiction Chart</h2>
      <div class="chart">${tierBlocks}</div>
    </section>

    <section class="section" id="directory" aria-labelledby="directory-title">
      <h2 id="directory-title">Role Directory</h2>
      <div class="role-grid">${indexCards}</div>
    </section>

    <section class="section" id="missing" aria-labelledby="missing-title">
      <h2 id="missing-title">Role Gaps</h2>
      <div class="recommended">${recommendedCards}</div>
    </section>
  </main>
  <footer>
    <span>Built as the Las Jaras household profile directory.</span>
    <a href="../index.html">Most Certainly Try Labs</a>
  </footer>`;

writeFileSync(join(process.cwd(), "projects", "household-beings.html"), layout({
  title: "Las Jaras Household Beings Directory",
  description: "Profile pages and an operating chart for every being running the Las Jaras household.",
  body: indexBody,
  prefix: ""
}));

for (const role of roles) {
  const links = role.links.length
    ? role.links.map(([label, href]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`).join("\n")
    : `<li>No dedicated Labs tool yet. This role is ready for a future workflow page.</li>`;
  const peers = roles
    .filter((item) => item.tier === role.tier && item.title !== role.title)
    .map((item) => `<a href="${slugify(item.title)}.html">${esc(item.title)}</a>`)
    .join("\n          ");
  const body = `<main>
    <section class="hero">
      <div>
        <p class="kicker">${esc(role.tier)}</p>
        <h1>${esc(role.title)}: ${esc(role.name)}</h1>
        <p class="lede">${esc(role.role)}</p>
        <div class="toolbar">
          <a class="button primary" href="../household-beings.html">Back to directory</a>
          <a class="button" href="#oversees">What they oversee</a>
        </div>
      </div>
      <aside class="panel">
        <dl class="quick-facts">
          <div><dt>Being</dt><dd>${esc(role.being)}</dd></div>
          <div><dt>Tone</dt><dd>${esc(role.tone)}</dd></div>
          <div><dt>Jurisdiction</dt><dd>${esc(role.oversees)}</dd></div>
        </dl>
      </aside>
    </section>
    <section class="profile-layout">
      <article class="profile-card" id="oversees">
        <p class="label">Role</p>
        <h2>What They Oversee</h2>
        <p>${esc(role.role)}</p>
        <p><strong>Primary jurisdiction:</strong> ${esc(role.oversees)}.</p>
        <p><strong>Persona:</strong> ${esc(role.being)}. Their tone is ${esc(role.tone)}.</p>
      </article>
      <aside class="profile-card">
        <p class="label">Related pages</p>
        <h2>Links</h2>
        <ul class="link-list">${links}</ul>
        ${peers ? `<p class="label">Same tier</p><div class="chart-roles">${peers}</div>` : ""}
      </aside>
    </section>
  </main>
  <footer>
    <span>${esc(role.title)} profile</span>
    <a href="../household-beings.html">Directory</a>
  </footer>`;
  writeFileSync(join(outDir, `${slugify(role.title)}.html`), layout({
    title: `${role.title}: ${role.name} | Las Jaras Household Beings`,
    description: `${role.title} profile for the Las Jaras household beings directory.`,
    body
  }));
}

console.log(`Generated ${roles.length + 1} household being pages.`);
