import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "projects", "household-beings");
const notesDir = join(outDir, "daily-notes");
mkdirSync(outDir, { recursive: true });
mkdirSync(notesDir, { recursive: true });

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
    .ops-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 14px;
      padding-bottom: 30px;
    }
    .ops-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .9);
      padding: 16px;
      box-shadow: var(--shadow);
    }
    .ops-card ul {
      margin: 0;
      padding-left: 20px;
      color: var(--muted);
    }
    .ops-card li + li { margin-top: 7px; }
    form {
      display: grid;
      gap: 18px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .92);
      padding: clamp(16px, 3vw, 24px);
      box-shadow: var(--shadow);
    }
    fieldset {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
      margin: 0;
    }
    legend { font-weight: 950; padding: 0 6px; }
    label {
      display: grid;
      gap: 7px;
      color: var(--muted);
      font-weight: 800;
    }
    input, select, textarea {
      width: 100%;
      min-height: 44px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #fff;
      color: var(--ink);
      font: inherit;
      padding: 10px 12px;
    }
    textarea { min-height: 116px; resize: vertical; }
    button {
      min-height: 44px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--panel);
      color: var(--ink);
      font: inherit;
      font-weight: 850;
      padding: 10px 12px;
      cursor: pointer;
    }
    button.primary { border-color: var(--cobalt); background: var(--cobalt); color: #fff; }
    button.danger { border-color: rgba(139, 63, 100, .45); color: var(--berry); }
    .two {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    .checks {
      display: grid;
      gap: 10px;
    }
    .check {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: start;
      gap: 10px;
      color: var(--ink);
    }
    .check input { width: 18px; min-height: 18px; margin-top: 3px; }
    .note-list {
      display: grid;
      gap: 12px;
    }
    .note-card {
      border: 1px solid var(--line);
      border-radius: 8px;
      background: rgba(255, 255, 255, .9);
      padding: 14px;
    }
    .note-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      color: var(--muted);
      font-size: .9rem;
      font-weight: 800;
    }
    .status-note {
      border-left: 5px solid var(--cobalt);
      border-radius: 8px;
      padding: 12px 14px;
      background: rgba(219, 234, 254, .7);
      color: var(--ink);
    }
    .checklist-card {
      display: grid;
      gap: 14px;
    }
    .checklist-card.is-reviewed {
      opacity: .68;
      background: rgba(243, 244, 246, .85);
    }
    .checklist-card.is-reviewed h3,
    .checklist-card.is-reviewed p {
      color: #4b5563;
    }
    .checklist-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .checklist-meta span {
      border: 1px solid var(--line);
      border-radius: 999px;
      background: rgba(255, 255, 255, .82);
      padding: 5px 9px;
      color: var(--muted);
      font-size: .86rem;
      font-weight: 850;
    }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: #111827;
      color: #f9fafb;
      padding: 14px;
      max-height: 360px;
      overflow: auto;
    }
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
      .hero, .profile-layout, .two { grid-template-columns: 1fr; }
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
        <a class="button" href="household-beings/${dailyNotesPath(role)}">Daily notes</a>
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

const titleOps = {
  Mailman: {
    daily: ["Review open follow-up list and draft replies for human approval.", "Check email-list sign-up needs and tag new public contacts.", "Nudge overdue drafts without sending anything automatically."],
    force: ["Inbox zero methods", "plain-language response templates", "permission-first communication rules"],
    tools: ["Gmail connector when explicitly requested", "active chat drafts", "Unread Message Triage Agent"],
    wishlist: ["Resend audience/list tooling", "shared follow-up CRM", "lightweight email template library"]
  },
  Sundries: {
    daily: ["Process new receipts, forms, and supply notes into inventory.", "Check low-stock and expiring household items.", "Prepare H-E-B cart suggestions without checking out.", "Feed Mira Queue a daily Pinterest link packet for useful-object, supply, storage, product, and household-tool references."],
    force: ["FIFO pantry practice", "retail inventory controls", "H-E-B sale/coupon workflow notes"],
    tools: ["household inventory files", "H-E-B site when logged in", "Sheriff and Serafina intake forms"],
    wishlist: ["barcode scanner", "pantry label printer", "R2-backed evidence/file intake storage"]
  },
  "Personal Assistant": {
    daily: ["Review upcoming calendar windows and time-sensitive reminders.", "Batch alerts into useful daily briefings.", "Escalate urgent scheduling conflicts to the human."],
    force: ["time-blocking basics", "quiet-hours etiquette", "calendar triage best practices"],
    tools: ["calendar context when available", "OpenClaw reminders/cron", "active chat check-ins"],
    wishlist: ["shared family calendar dashboard", "SMS/email reminder provider", "voice briefing speaker integration"]
  },
  "Director of Fun": {
    daily: ["Scan upcoming local events and save promising options.", "Match outings to energy level, weather, guests, and budget.", "Prepare sign-up or ticket reminders before deadlines pass."],
    force: ["event planning checklists", "guest experience design", "local arts and culture calendars"],
    tools: ["Whimsy pages", "web research", "calendar reminders"],
    wishlist: ["event aggregator account", "ticket-price tracker", "shared household fun calendar"]
  },
  PR: {
    daily: ["Review what is public-safe and worth sharing.", "Track affiliate or partnership ideas.", "Keep public storylines aligned with Most Certainly Try's voice."],
    force: ["brand strategy basics", "affiliate disclosure guidance", "public/privacy boundary rules"],
    tools: ["Labs build logs", "project pages", "public website links"],
    wishlist: ["affiliate dashboard", "press kit template system", "analytics dashboard"]
  },
  Stylist: {
    daily: ["Review public-facing photos/pages for visual consistency.", "Suggest styling fixes for rooms, outfits, product shots, and decks.", "Keep color, texture, and presentation notes aligned with Las Jaras."],
    force: ["editorial styling references", "Gramercy Park Hotel/bohemian-luxe visual notes", "accessibility and readability guidelines"],
    tools: ["Las Jaras room guide", "AI Product Video Creator page", "local design notes"],
    wishlist: ["portable photo light kit", "fabric/color swatch library", "visual moodboard board"]
  },
  "Social Media Manager": {
    daily: ["Draft public-safe post ideas from finished projects.", "Maintain a content queue by platform and timing.", "Prepare captions for human review, never auto-post.", "Review Sundries' daily Pinterest link packet and sort links into private note, Pinterest board candidate, Labs reference, or reject."],
    force: ["platform caption conventions", "content calendar planning", "privacy-first publishing rules"],
    tools: ["Labs project catalog", "AI Product Video Creator assets", "active chat drafts"],
    wishlist: ["social scheduler", "link-in-bio manager", "post analytics dashboard"]
  },
  Webmaster: {
    daily: ["Check Labs updates, links, sitemap, and build logs.", "Keep public pages free of private operational details.", "Commit and push site changes after verification."],
    force: ["WCAG basics", "static-site release hygiene", "security/privacy review checklists"],
    tools: ["GitHub Pages", "git", "Cloudflare build log", "HTML/CSS/JavaScript"],
    wishlist: ["automated link checker CI", "Cloudflare Worker production backend", "uptime and analytics monitoring"]
  },
  Serafina: {
    daily: ["Review human-informed field notes and house observations.", "Generate practical Serafina suggestions.", "Escalate concrete issues to Sheriff Lone Star when needed."],
    force: ["Las Jaras ritual calendar", "accessibility-minded intake design", "plant/weather/threshold context"],
    tools: ["Serafina Field Log", "Serafina Sacred Calendar", "Serafina Angels Log"],
    wishlist: ["shared API escalation to Sheriff", "image evidence storage", "daily house mood dashboard"]
  },
  Sheriff: {
    daily: ["Review open cases and severity logs.", "Update solution checklist status and ask follow-up questions.", "Keep cases open until the human says Case Closed."],
    force: ["property-management issue intake", "hotel service recovery patterns", "home maintenance triage"],
    tools: ["Sheriff Issue Desk", "Cloudflare Worker scaffold", "D1 schema", "FormSubmit backup"],
    wishlist: ["live D1 case board", "R2 evidence storage", "Resend email updates", "admin closeout panel"]
  },
  Guru: {
    daily: ["Offer grounded spiritual check-ins when requested.", "Suggest small rituals that do not create clutter or hazards.", "Notice when practical care should outrank symbolism."],
    force: ["grounding practices", "ritual safety", "reflective journaling prompts"],
    tools: ["Serafina Sacred Calendar", "active chat", "house context notes"],
    wishlist: ["guided reflection library", "ritual supply inventory", "seasonal practice tracker"]
  },
  Nanny: {
    daily: ["Check guest comfort basics: water, sleep, shade, towels, and clear paths.", "Draft gentle wellness reminders.", "Flag issues that require medical or professional attention."],
    force: ["hospitality care basics", "non-medical wellness boundaries", "guest comfort checklists"],
    tools: ["Household Ops Command Center", "room guide", "active chat"],
    wishlist: ["guest-prep checklist app", "first-aid inventory tracker", "quiet-hours reminder system"]
  },
  Coach: {
    daily: ["Suggest realistic movement options based on schedule and energy.", "Track habit streaks without shaming anyone.", "Balance effort with recovery."],
    force: ["progressive overload basics", "habit formation", "recovery and mobility practices"],
    tools: ["active chat planning", "calendar context when available", "household routine notes"],
    wishlist: ["fitness tracker integration", "mobility video library", "home equipment inventory"]
  },
  Theatre: {
    daily: ["Maintain watchlists by mood, runtime, and guest group.", "Suggest what to watch based on available attention.", "Track recommendations worth revisiting."],
    force: ["curation methods", "guest-friendly programming", "runtime and mood matching"],
    tools: ["active chat lists", "streaming-service notes", "Whimsy pages"],
    wishlist: ["watchlist manager", "streaming availability tracker", "shared movie-night calendar"]
  },
  DJ: {
    daily: ["Prepare playlists for cooking, work, cleaning, hosting, and wind-down.", "Track room mood and transition points.", "Refresh playlists when they get stale."],
    force: ["playlist sequencing", "room energy reading", "hosting music etiquette"],
    tools: ["playlist notes", "active chat", "room mood context"],
    wishlist: ["music-service integration", "speaker/room automation", "playlist analytics"]
  },
  Chef: {
    daily: ["Turn inventory and cravings into recipe options.", "Add shelf-stable recipes when pantry ingredients are added.", "Prepare missing-ingredient notes before shopping."],
    force: ["pantry cooking rules", "mise en place", "inventory-aware meal planning"],
    tools: ["household inventory", "PANTRY_COOKBOOK notes", "H-E-B workflow"],
    wishlist: ["recipe database", "meal-planning calendar", "smart scale or pantry scanner"]
  },
  Barista: {
    daily: ["Track coffee, tea, smoothie, and slushie preferences.", "Suggest drink recipes from available supplies.", "Keep morning beverage staples visible to Sundries."],
    force: ["brew ratio guides", "tea steeping references", "smoothie balance basics"],
    tools: ["inventory notes", "active chat recipes", "kitchen supply records"],
    wishlist: ["coffee bean inventory tracker", "milk frother/espresso upgrade list", "drink recipe card system"]
  },
  Baker: {
    daily: ["Track baking supplies, tools, and recipe candidates.", "Suggest cookie, cake, and bread plans from pantry inventory.", "Flag missing ingredients before baking begins."],
    force: ["baker's percentages", "King Arthur-style technique references", "recipe testing logs"],
    tools: ["pantry inventory", "recipe notes", "kitchen supply records"],
    wishlist: ["stand mixer attachments", "digital kitchen scale", "baking stone or proofing tools"]
  },
  Bartender: {
    daily: ["Track wine, beer, spirits, mixers, and tiki bar needs.", "Suggest drink pairings for dinner or guests.", "Flag low-stock bar staples without encouraging overbuying."],
    force: ["responsible hosting rules", "wine pairing references", "cocktail spec discipline"],
    tools: ["Andre Mack wine guide", "inventory notes", "active chat"],
    wishlist: ["bar inventory app", "label maker for batched syrups", "wine fridge or cellar tracker"]
  },
  Laundramat: {
    daily: ["Review fabric care issues, stains, and laundry backlog.", "Suggest wash/dry settings and textile-safe tools.", "Keep fabric-care supplies visible to Sundries."],
    force: ["care-label guidance", "stain-removal references", "textile preservation basics"],
    tools: ["Room Maintenance Inventory", "active chat troubleshooting", "household supply records"],
    wishlist: ["fabric shaver", "stain kit", "laundry label/photo guide"]
  },
  Keeper: {
    daily: ["Check dusting, vacuuming, and room reset cadence.", "Batch cleaning tasks by room and effort.", "Flag supply or tool needs to Sundries."],
    force: ["zone-cleaning methods", "maintenance scheduling", "guest-readiness checklists"],
    tools: ["Room Maintenance Inventory", "household cleaning notes", "active chat"],
    wishlist: ["robot vacuum map", "cleaning caddy system", "recurring task dashboard"]
  },
  Archivist: {
    daily: ["Capture durable decisions, source links, and finished artifacts.", "Move important raw notes into long-term memory or build logs.", "Keep public/private boundaries clear in records."],
    force: ["source citation practice", "privacy review", "document control and versioning"],
    tools: ["MEMORY.md/daily notes", "Captain's Log", "git history", "Labs pages"],
    wishlist: ["taggable knowledge base", "photo/archive storage workflow", "automated source indexer"]
  },
  Librarian: {
    daily: ["Organize useful references, guides, reading lists, and how-to links.", "Retrieve the best existing source before new research starts.", "Keep knowledge findable for other roles."],
    force: ["library classification ideas", "research literacy", "source-quality evaluation"],
    tools: ["Captain's Log", "Inference reading protocol", "web research", "saved reference notes"],
    wishlist: ["personal Zotero/Readwise-style library", "searchable household wiki", "annotated reading-list database"]
  },
  Treasurer: {
    daily: ["Review cost implications of proposed household actions.", "Track reimbursements, subscriptions, and bill reminders.", "Keep purchase decisions reviewable before money moves."],
    force: ["basic budgeting", "subscription hygiene", "permission-before-spending boundary"],
    tools: ["active chat approvals", "household ops notes", "inventory/shopping context"],
    wishlist: ["budget dashboard", "subscription tracker", "receipt OCR pipeline"]
  },
  Groundskeeper: {
    daily: ["Check garden, porch, yard, irrigation, weather, and creature evidence.", "Escalate outdoor issues to Serafina or Sheriff as needed.", "Track seasonal exterior tasks."],
    force: ["Texas gardening references", "IPM pest-management basics", "weather-aware maintenance"],
    tools: ["Garden Site Plan", "Garden Field Checklist", "Serafina Field Log"],
    wishlist: ["soil moisture sensors", "weather station", "R2 photo evidence archive"]
  },
  "Safety Officer": {
    daily: ["Scan for urgent hazards, battery needs, locks, trip risks, and heat/cold risks.", "Escalate S1/S2 issues to Sheriff or the human.", "Keep emergency-prep checks from becoming folklore."],
    force: ["home safety checklists", "fire/CO safety basics", "habitability triage"],
    tools: ["Sheriff Issue Desk", "Room Maintenance Inventory", "active chat"],
    wishlist: ["sensor dashboard", "battery/expiration tracker", "emergency kit inventory"]
  },
  Concierge: {
    daily: ["Prepare guest arrival notes, room readiness, amenities, and local recommendations.", "Coordinate with Nanny, Keeper, Chef, and Director of Fun.", "Track guest preferences after visits."],
    force: ["boutique hospitality standards", "guest journey mapping", "house manual best practices"],
    tools: ["Room Guide", "Whimsy pages", "active chat"],
    wishlist: ["digital guestbook", "welcome packet template system", "guest preference CRM"]
  }
};

const tierOps = {
  Operations: {
    daily: ["Review incoming notes for operational work.", "Route requests to the correct household being.", "Keep records tidy enough for future use."],
    force: ["operations checklists", "service design", "privacy-aware documentation"],
    tools: ["Labs pages", "active chat", "local workspace notes"],
    wishlist: ["shared dashboard", "automated intake routing", "searchable task database"]
  },
  "Public Face": {
    daily: ["Review public-safe content opportunities.", "Protect privacy and tone before anything goes public.", "Prepare human-reviewed drafts or updates."],
    force: ["brand guidelines", "public disclosure standards", "accessibility and plain-language guidance"],
    tools: ["Labs project catalog", "public website", "active chat drafts"],
    wishlist: ["analytics dashboard", "content scheduler", "affiliate tracking tools"]
  },
  "Household Intelligence": {
    daily: ["Review new household observations and cases.", "Separate evidence from inference.", "Escalate concrete risks quickly."],
    force: ["issue triage", "evidence-based troubleshooting", "household context notes"],
    tools: ["Serafina and Sheriff pages", "active chat", "Labs records"],
    wishlist: ["shared backend", "media evidence storage", "cross-device case board"]
  },
  Care: {
    daily: ["Check care-related context and comfort needs.", "Suggest small, practical next steps.", "Escalate beyond-agent concerns to humans or professionals."],
    force: ["wellness boundaries", "guest care", "grounding routines"],
    tools: ["active chat", "household notes", "calendar context when available"],
    wishlist: ["care checklist dashboard", "routine tracker", "guest wellness preferences"]
  },
  Experience: {
    daily: ["Keep enjoyable options ready before decision fatigue wins.", "Match recommendations to energy, guests, and timing.", "Prepare sign-up or planning prompts."],
    force: ["experience design", "curation practice", "hospitality planning"],
    tools: ["Whimsy pages", "active chat", "calendar reminders"],
    wishlist: ["event tracker", "shared itinerary builder", "preference database"]
  },
  Kitchen: {
    daily: ["Review food and drink needs against inventory.", "Suggest recipes or restock notes.", "Keep missing ingredients visible to Sundries."],
    force: ["inventory-aware cooking", "food safety basics", "recipe testing"],
    tools: ["household inventory", "pantry notes", "H-E-B workflow"],
    wishlist: ["recipe/inventory integration", "barcode scanner", "kitchen equipment tracker"]
  },
  Housekeeping: {
    daily: ["Track room reset and cleaning needs.", "Suggest tools and supply needs.", "Protect textiles and surfaces from bad shortcuts."],
    force: ["zone cleaning", "fabric care", "maintenance cadence"],
    tools: ["Room Maintenance Inventory", "active chat", "household supply notes"],
    wishlist: ["cleaning schedule app", "tool inventory", "robot vacuum integration"]
  },
  Communications: {
    daily: ["Review drafts and follow-ups.", "Prepare clear human-reviewed messages.", "Keep contact workflows permission-first."],
    force: ["plain-language writing", "inbox triage", "consent-based communications"],
    tools: ["active chat", "Gmail connector when requested", "draft notes"],
    wishlist: ["mailing list provider", "CRM", "template library"]
  },
  Infrastructure: {
    daily: ["Check links, build notes, and public site health.", "Review privacy and compliance before publishing.", "Keep deployment notes current."],
    force: ["web accessibility", "release hygiene", "security basics"],
    tools: ["git", "GitHub Pages", "Cloudflare tooling"],
    wishlist: ["CI link checker", "uptime monitor", "production API backend"]
  }
};

function roleOps(role, key) {
  return titleOps[role.title]?.[key] || tierOps[role.tier]?.[key] || [];
}

function renderList(items) {
  return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;
}

function renderOperatingNotes(role) {
  return `<section class="section" aria-labelledby="${slugify(role.title)}-ops-title">
      <p class="label">Operating notes</p>
      <h2 id="${slugify(role.title)}-ops-title">Workflows, References, Tools, And Wishes</h2>
      <div class="ops-grid">
        <article class="ops-card">
          <h3>Daily Tasks</h3>
          ${renderList(roleOps(role, "daily"))}
        </article>
        <article class="ops-card">
          <h3>Guiding Force</h3>
          ${renderList(roleOps(role, "force"))}
        </article>
        <article class="ops-card">
          <h3>Current Tools</h3>
          ${renderList(roleOps(role, "tools"))}
        </article>
        <article class="ops-card">
          <h3>Wishlist</h3>
          ${renderList(roleOps(role, "wishlist"))}
        </article>
      </div>
    </section>`;
}

function dailyNotesPath(role) {
  return `daily-notes/${slugify(role.title)}-daily-notes.html`;
}

function dailyNotesPage(role) {
  const slug = slugify(role.title);
  const payload = {
    title: role.title,
    name: role.name,
    tier: role.tier,
    tasks: roleOps(role, "daily"),
    force: roleOps(role, "force"),
    tools: roleOps(role, "tools"),
    wishlist: roleOps(role, "wishlist")
  };
  const taskOptions = payload.tasks.map((task, index) => `<option value="${index}">${esc(task)}</option>`).join("");
  const taskChecks = payload.tasks.map((task, index) => `<label class="check"><input type="checkbox" name="taskDone" value="${index}"> ${esc(task)}</label>`).join("\n");
  const body = `<main>
    <section class="hero">
      <div>
        <p class="kicker">${esc(role.tier)} daily workflow</p>
        <h1>${esc(role.title)} Daily Notes</h1>
        <p class="lede">Record what ${esc(role.name)} actively did today, what result came out of it, and what should happen next. These notes save in this browser until the shared backend exists.</p>
        <div class="toolbar">
          <a class="button primary" href="../${slug}.html">Back to ${esc(role.title)}</a>
          <a class="button" href="../../household-beings.html">Directory</a>
          <a class="button" href="../../household-beings-blocked-workflows.html">Blocked workflows</a>
        </div>
      </div>
      <aside class="panel">
        <p class="label">Active-work rule</p>
        <p>Daily tasks are actionable workflows. If a task cannot be completed yet, mark it blocked and record the missing tool, permission, or data.</p>
      </aside>
    </section>

    <section class="section">
      <form id="daily-note-form">
        <p class="status-note" id="form-status" role="status" aria-live="polite">Ready to record a ${esc(role.title)} workflow note.</p>
        <fieldset>
          <legend>Workflow</legend>
          <div class="two">
            <label for="note-date">
              Date
              <input id="note-date" name="noteDate" type="date" required>
            </label>
            <label for="operator">
              Who ran it?
              <input id="operator" name="operator" autocomplete="name" placeholder="Example: Buddy, Howdy Partner, or ${esc(role.name)}">
            </label>
          </div>
          <div class="two">
            <label for="primary-task">
              Primary task
              <select id="primary-task" name="primaryTask" required>
                <option value="">Choose a workflow</option>
                ${taskOptions}
              </select>
            </label>
            <label for="status">
              Status
              <select id="status" name="status" required>
                <option value="done">Done</option>
                <option value="drafted">Drafted for review</option>
                <option value="blocked">Blocked</option>
                <option value="scheduled">Scheduled</option>
                <option value="escalated">Escalated</option>
                <option value="not-needed">Not needed today</option>
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Task checklist</legend>
          <div class="checks">${taskChecks}</div>
        </fieldset>

        <fieldset>
          <legend>Result</legend>
          <label for="result">
            What happened?
            <textarea id="result" name="result" required maxlength="1600" placeholder="Record the active result: draft created, note reviewed, case escalated, supplies checked, recommendation prepared, or blocker found."></textarea>
          </label>
          <div class="two">
            <label for="next-action">
              Next action
              <textarea id="next-action" name="nextAction" maxlength="800" placeholder="What should happen next?"></textarea>
            </label>
            <label for="blocker">
              Missing tool, permission, or data
              <textarea id="blocker" name="blocker" maxlength="800" placeholder="Use this if the workflow could not be finished."></textarea>
            </label>
          </div>
        </fieldset>

        <div class="toolbar">
          <button class="primary" type="submit">Save Daily Note</button>
          <button type="button" id="copy-latest">Copy Latest</button>
          <button type="button" id="download-json">Download JSON</button>
          <button class="danger" type="button" id="clear-notes">Clear Browser Notes</button>
        </div>
      </form>
    </section>

    <section class="section" aria-labelledby="records-title">
      <h2 id="records-title">Saved Notes</h2>
      <div class="note-list" id="note-list" aria-live="polite"></div>
      <h2>Latest JSON</h2>
      <pre id="json-output">{}</pre>
    </section>
  </main>
  <footer>
    <span>${esc(role.title)} daily workflow notes</span>
    <a href="../${slug}.html">${esc(role.title)} profile</a>
  </footer>
  <script>
    const roleConfig = ${JSON.stringify(payload, null, 4)};
    const storageKey = "las-jaras-daily-notes-" + ${JSON.stringify(slug)} + "-v1";
    const form = document.querySelector("#daily-note-form");
    const noteList = document.querySelector("#note-list");
    const jsonOutput = document.querySelector("#json-output");
    const formStatus = document.querySelector("#form-status");
    const copyLatest = document.querySelector("#copy-latest");
    const downloadJson = document.querySelector("#download-json");
    const clearNotes = document.querySelector("#clear-notes");

    document.querySelector("#note-date").value = new Date().toISOString().slice(0, 10);

    function clean(value) {
      return String(value || "").trim();
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function loadNotes() {
      try {
        return JSON.parse(localStorage.getItem(storageKey) || "[]");
      } catch {
        return [];
      }
    }

    function saveNotes(notes) {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    }

    function checkedTaskIndexes() {
      return [...form.querySelectorAll('input[name="taskDone"]:checked')].map((item) => Number(item.value));
    }

    function noteFromForm() {
      const data = new FormData(form);
      const primaryIndex = Number(data.get("primaryTask"));
      const completedIndexes = checkedTaskIndexes();
      return {
        id: "daily-note-" + Date.now(),
        createdAt: new Date().toISOString(),
        role: roleConfig.title,
        being: roleConfig.name,
        tier: roleConfig.tier,
        noteDate: clean(data.get("noteDate")),
        operator: clean(data.get("operator")),
        primaryTask: roleConfig.tasks[primaryIndex] || "",
        completedTasks: completedIndexes.map((index) => roleConfig.tasks[index]).filter(Boolean),
        status: clean(data.get("status")),
        result: clean(data.get("result")),
        nextAction: clean(data.get("nextAction")),
        blocker: clean(data.get("blocker")),
        guidingForce: roleConfig.force,
        currentTools: roleConfig.tools,
        wishlist: roleConfig.wishlist
      };
    }

    function renderNote(note) {
      return \`
        <article class="note-card">
          <h3>\${escapeHtml(note.noteDate)}: \${escapeHtml(note.primaryTask || "Workflow note")}</h3>
          <div class="note-meta">
            <span>\${escapeHtml(note.status)}</span>
            <span>\${escapeHtml(note.operator || "operator not listed")}</span>
            <span>\${escapeHtml(note.completedTasks.length)} checklist item(s)</span>
          </div>
          <p><strong>Result:</strong> \${escapeHtml(note.result)}</p>
          \${note.nextAction ? \`<p><strong>Next action:</strong> \${escapeHtml(note.nextAction)}</p>\` : ""}
          \${note.blocker ? \`<p><strong>Blocked by:</strong> \${escapeHtml(note.blocker)}</p>\` : ""}
        </article>
      \`;
    }

    function renderNotes() {
      const notes = loadNotes();
      if (!notes.length) {
        noteList.innerHTML = '<p class="status-note">No browser-saved daily notes yet.</p>';
        jsonOutput.textContent = "{}";
        return;
      }
      noteList.innerHTML = notes.slice(0, 8).map(renderNote).join("");
      jsonOutput.textContent = JSON.stringify(notes[0], null, 2);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const notes = loadNotes();
      const note = noteFromForm();
      notes.unshift(note);
      saveNotes(notes);
      form.reset();
      document.querySelector("#note-date").value = new Date().toISOString().slice(0, 10);
      formStatus.textContent = roleConfig.title + " daily note saved in this browser.";
      renderNotes();
    });

    copyLatest.addEventListener("click", async () => {
      const notes = loadNotes();
      if (!notes.length) return;
      await navigator.clipboard.writeText(JSON.stringify(notes[0], null, 2));
      formStatus.textContent = "Latest daily note copied.";
    });

    downloadJson.addEventListener("click", () => {
      const notes = loadNotes();
      const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = ${JSON.stringify(slug)} + "-daily-notes.json";
      link.click();
      URL.revokeObjectURL(url);
    });

    clearNotes.addEventListener("click", () => {
      if (!confirm("Clear browser-saved daily notes for " + roleConfig.title + "?")) return;
      localStorage.removeItem(storageKey);
      formStatus.textContent = "Browser-saved daily notes cleared.";
      renderNotes();
    });

    renderNotes();
  </script>`;

  return layout({
    title: `${role.title} Daily Notes | Las Jaras Household Beings`,
    description: `Daily workflow notes for ${role.title} at Las Jaras.`,
    body,
    prefix: "../../"
  });
}

const indexBody = `<main>
    <section class="hero">
      <div>
        <p class="kicker">Las Jaras operating chart</p>
        <h1>Every Being Running The House</h1>
        <p class="lede">A profile directory and interaction map for the household agents, lights, spirits, tools, and other useful presences who keep Las Jaras moving from intake to action.</p>
        <div class="toolbar">
          <a class="button primary" href="#directory">Open directory</a>
          <a class="button" href="#chart">View chart</a>
          <a class="button" href="household-beings-blocked-workflows.html">Blocked workflows</a>
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

const blockedWorkflows = [
  {
    role: "Sheriff",
    priority: "P1",
    workflow: "Cross-device case board and Case Closed admin flow",
    blockedBy: "Final mobile cross-device verification and production admin-password polish",
    currentFallback: "Worker + D1 case board is live; admin token console handles closeout and updates.",
    reviewQuestion: "Does one mobile-created case appear on desktop, accept an admin update, and close cleanly?"
  },
  {
    role: "Sheriff",
    priority: "P1",
    workflow: "Evidence archive for case photos and videos",
    blockedBy: "R2 bucket deployment and one live upload smoke test",
    currentFallback: "Worker stores file metadata in D1; actual visual inspection can still happen by chat if R2 upload fails.",
    reviewQuestion: "After deploying the R2 bucket binding, does a mobile photo upload land in private R2 storage and delete on Case Closed?"
  },
  {
    role: "Serafina",
    priority: "P1",
    workflow: "Automatic Sheriff escalation from Serafina form",
    blockedBy: "No current blocker after published smoke test",
    currentFallback: "Serafina calls the Worker API directly; browser-local handoff remains only if the Worker fails.",
    reviewQuestion: "Monitor the next real escalation for user-facing clarity and media-upload behavior."
  },
  {
    role: "Sheriff",
    priority: "P2",
    workflow: "Email updates on case progress",
    blockedBy: "Resend API key, verified sender/from email, Worker secrets, and one test send",
    currentFallback: "Worker update route and admin UI are ready; optional email consent remains disabled until secrets exist.",
    reviewQuestion: "Which verified sender should be used for Sheriff case-update emails?"
  },
  {
    role: "All Staff",
    priority: "P2",
    workflow: "Daily notes that sync across devices",
    blockedBy: "Shared backend for daily notes",
    currentFallback: "Each staff daily-note page saves notes in the current browser only.",
    reviewQuestion: "Should daily notes share the Sheriff D1 database, or get their own D1 table?"
  },
  {
    role: "Mailman",
    priority: "P2",
    workflow: "Email-list sign-up and follow-up CRM",
    blockedBy: "Mailing-list provider, consent storage, contact tagging, and unsubscribe path",
    currentFallback: "Draft follow-ups in chat; Gmail only when explicitly requested.",
    reviewQuestion: "Should Mailman use Resend audiences, a simple D1 contacts table, or a full CRM?"
  },
  {
    role: "Personal Assistant",
    priority: "P2",
    workflow: "Shared calendar dashboard and timed alerts",
    blockedBy: "Calendar integration, alert rules, and preferred notification channel",
    currentFallback: "Manual chat reminders and OpenClaw cron/reminder notes when requested.",
    reviewQuestion: "Which calendar source should be authoritative?"
  },
  {
    role: "Sundries",
    priority: "P2",
    workflow: "Inventory intake with photos, receipts, and H-E-B ordering support",
    blockedBy: "Shared inventory API, receipt OCR, product-photo storage, and authenticated H-E-B browser access",
    currentFallback: "Local inventory files and manual H-E-B checks when logged in.",
    reviewQuestion: "Do we prioritize receipt import, pantry scanning, or H-E-B cart support first?"
  },
  {
    role: "Webmaster",
    priority: "P2",
    workflow: "Automated site compliance, link checks, and build-log freshness",
    blockedBy: "CI link checker, scheduled audit job, and published-report format",
    currentFallback: "Manual link checks before commits.",
    reviewQuestion: "Should GitHub Actions run link checks on every push?"
  },
  {
    role: "Archivist",
    priority: "P2",
    workflow: "Searchable durable household archive",
    blockedBy: "Knowledge base/search layer and photo/archive storage policy",
    currentFallback: "Workspace memory files, Labs pages, and git history.",
    reviewQuestion: "Should the archive live in files, Notion, D1, or another searchable system?"
  },
  {
    role: "Librarian",
    priority: "P2",
    workflow: "Reference library and annotated reading lists",
    blockedBy: "Library database, saved-article workflow, tags, and source-quality rubric",
    currentFallback: "Links in Labs pages and ad hoc web research.",
    reviewQuestion: "Should Librarian use a simple HTML index first, or a dedicated library tool?"
  },
  {
    role: "Treasurer",
    priority: "P2",
    workflow: "Budget, subscription, and receipt tracking",
    blockedBy: "Budget data source, subscription list, receipt OCR, and spending-permission boundary",
    currentFallback: "No spending without explicit human confirmation; costs are discussed in chat.",
    reviewQuestion: "Should Treasurer start with subscriptions, receipts, or project budgets?"
  },
  {
    role: "Groundskeeper",
    priority: "P3",
    workflow: "Outdoor condition monitoring",
    blockedBy: "Weather station, soil sensors, garden photo archive, and routine field checks",
    currentFallback: "Garden checklist pages and Serafina/Sheriff reports.",
    reviewQuestion: "Are sensors worth it, or should we start with scheduled photo checks?"
  },
  {
    role: "Safety Officer",
    priority: "P3",
    workflow: "Home safety and emergency-prep dashboard",
    blockedBy: "Battery/expiration tracker, sensor dashboard, emergency-kit inventory",
    currentFallback: "Manual Sheriff/Safety notes and room maintenance inventory.",
    reviewQuestion: "Should the first Safety workflow be batteries, locks, emergency kit, or trip hazards?"
  },
  {
    role: "Concierge",
    priority: "P3",
    workflow: "Guestbook, welcome packets, and guest preferences",
    blockedBy: "Guest preference store, reusable welcome packet, and room-readiness checklist",
    currentFallback: "Room guide and chat-prepared guest notes.",
    reviewQuestion: "Should Concierge start with a guest intake form?"
  },
  {
    role: "PR",
    priority: "P3",
    workflow: "Affiliate and public persona tracking",
    blockedBy: "Affiliate dashboard, disclosure templates, public metrics, and campaign tracker",
    currentFallback: "Labs build logs and manual public-safe messaging review.",
    reviewQuestion: "Which affiliate area should PR track first?"
  },
  {
    role: "Social Media Manager",
    priority: "P3",
    workflow: "Scheduled social posts",
    blockedBy: "Social scheduler, platform connections, approval workflow, and analytics",
    currentFallback: "Draft captions in chat for human review.",
    reviewQuestion: "Which platform should be first: Instagram, TikTok, LinkedIn, or something else?"
  },
  {
    role: "Stylist",
    priority: "P3",
    workflow: "Visual moodboard and styling library",
    blockedBy: "Moodboard tool, swatch/photo library, and photo-lighting kit",
    currentFallback: "Room guide, local design notes, and chat suggestions.",
    reviewQuestion: "Should Stylist begin with room styling, wardrobe, or public project visuals?"
  },
  {
    role: "Director of Fun",
    priority: "P3",
    workflow: "Event discovery and ticket deadline tracker",
    blockedBy: "Event aggregator, ticket-price tracker, and shared fun calendar",
    currentFallback: "Manual web research and calendar reminders.",
    reviewQuestion: "Which event sources should be watched first?"
  },
  {
    role: "Theatre",
    priority: "P3",
    workflow: "Streaming availability and watchlist manager",
    blockedBy: "Watchlist database and streaming availability source",
    currentFallback: "Manual watchlist notes in chat.",
    reviewQuestion: "Should Theatre track household watchlists by mood, platform, or guest group first?"
  },
  {
    role: "DJ",
    priority: "P3",
    workflow: "Playlist and speaker-room automation",
    blockedBy: "Music-service integration and speaker/room automation permissions",
    currentFallback: "Manual playlist notes and recommendations.",
    reviewQuestion: "Which music service and rooms should DJ support first?"
  },
  {
    role: "Coach",
    priority: "P3",
    workflow: "Fitness tracker and routine history",
    blockedBy: "Fitness tracker integration, routine database, and recovery tracking",
    currentFallback: "Manual movement planning in chat.",
    reviewQuestion: "Should Coach start with daily movement, stretching, or strength tracking?"
  },
  {
    role: "Nanny",
    priority: "P3",
    workflow: "Guest wellness and comfort preferences",
    blockedBy: "Guest preference store, quiet-hours reminder, and first-aid inventory tracker",
    currentFallback: "Manual guest comfort checklists.",
    reviewQuestion: "Should Nanny start with guest comfort or household wellness reminders?"
  },
  {
    role: "Guru",
    priority: "P3",
    workflow: "Spiritual check-in rhythm and ritual supply tracking",
    blockedBy: "Reflection library, seasonal tracker, and ritual supply inventory",
    currentFallback: "Serafina Sacred Calendar and chat prompts.",
    reviewQuestion: "Should Guru start with a weekly check-in form?"
  },
  {
    role: "Chef",
    priority: "P3",
    workflow: "Recipe database tied to inventory",
    blockedBy: "Recipe database, pantry integration, and meal-planning calendar",
    currentFallback: "Pantry cookbook notes and active inventory files.",
    reviewQuestion: "Should Chef start with shelf-stable recipes or weekly meal planning?"
  },
  {
    role: "Barista",
    priority: "P3",
    workflow: "Drink recipe and staple tracker",
    blockedBy: "Coffee/tea inventory tracker and drink recipe card system",
    currentFallback: "Manual recipes and inventory notes.",
    reviewQuestion: "Should Barista start with coffee, tea, smoothies, or slushies?"
  },
  {
    role: "Baker",
    priority: "P3",
    workflow: "Baking tool and ingredient readiness",
    blockedBy: "Baking inventory tracker, recipe testing log, and equipment list",
    currentFallback: "Pantry notes and recipe drafts.",
    reviewQuestion: "Should Baker start with bread, cookies, cakes, or tools?"
  },
  {
    role: "Bartender",
    priority: "P3",
    workflow: "Bar inventory and cocktail spec tracker",
    blockedBy: "Bar inventory app, wine/cellar tracker, and batched-syrup labels",
    currentFallback: "Andre Mack guide and manual inventory notes.",
    reviewQuestion: "Should Bartender start with wine, spirits, beer, or tiki supplies?"
  },
  {
    role: "Laundramat",
    priority: "P3",
    workflow: "Fabric-care guide and stain kit tracking",
    blockedBy: "Laundry label/photo guide and fabric-care supply tracker",
    currentFallback: "Room maintenance inventory and chat troubleshooting.",
    reviewQuestion: "Should Laundramat start with stain guide or fabric care labels?"
  },
  {
    role: "Keeper",
    priority: "P3",
    workflow: "Recurring cleaning dashboard",
    blockedBy: "Cleaning schedule app, robot vacuum map, and tool inventory",
    currentFallback: "Room maintenance inventory and manual cleaning notes.",
    reviewQuestion: "Should Keeper start with dusting/vacuuming cadence or room reset checklists?"
  }
];

const blockerId = (item, index) => `${item.priority.toLowerCase()}-${index + 1}-${slugify(item.role)}-${slugify(item.workflow)}`;
const decisionOptions = [
  ["review-next", "Review next"],
  ["build-now", "Build now"],
  ["keep-manual", "Keep manual"],
  ["buy-setup-later", "Buy/setup later"],
  ["delete-defer", "Delete/defer"]
];
const blockedChecklistData = blockedWorkflows.map((item, index) => ({
  id: blockerId(item, index),
  role: item.role,
  priority: item.priority,
  workflow: item.workflow,
  manager: "Webmaster / Blue Static",
  owner: item.role
}));

const blockedCards = blockedWorkflows.map((item, index) => {
  const id = blockerId(item, index);
  const options = decisionOptions.map(([value, label]) => `<option value="${esc(value)}">${esc(label)}</option>`).join("\n");
  return `<article class="role-card checklist-card" data-blocker-card="${esc(id)}">
        <div>
          <p class="label">${esc(item.priority)} review ${index + 1}</p>
          <h3>${esc(item.role)}: ${esc(item.workflow)}</h3>
          <div class="checklist-meta" aria-label="Checklist ownership">
            <span>Manager: Webmaster / Blue Static</span>
            <span>Workflow owner: ${esc(item.role)}</span>
          </div>
        </div>
        <p><strong>Blocked by:</strong> ${esc(item.blockedBy)}</p>
        <p><strong>Current fallback:</strong> ${esc(item.currentFallback)}</p>
        <p><strong>Review question:</strong> ${esc(item.reviewQuestion)}</p>
        <div class="two">
          <label class="check">
            <input type="checkbox" data-blocker-done="${esc(id)}">
            <span>Review complete</span>
          </label>
          <label for="${esc(id)}-decision">Decision
            <select id="${esc(id)}-decision" data-blocker-decision="${esc(id)}">
              ${options}
            </select>
          </label>
        </div>
        <label for="${esc(id)}-notes">Review notes / next concrete step
          <textarea id="${esc(id)}-notes" data-blocker-notes="${esc(id)}" placeholder="Example: Build D1 first, then test mobile case creation."></textarea>
        </label>
      </article>`;
}).join("\n");

const blockedWorkflowBody = `<main>
    <section class="hero">
      <div>
        <p class="kicker">Workflow review queue</p>
        <h1>Blocked Household Staff Workflows</h1>
        <p class="lede">These are workflows that can be drafted, logged, or partially handled now, but need a missing backend, provider, hardware, permission, or data source before they can run repeatably. Blue Static the Webmaster keeps the master checklist; the named role owns the actual workflow requirements.</p>
        <div class="toolbar">
          <a class="button primary" href="household-beings.html">Back to directory</a>
          <a class="button" href="#queue">Review queue</a>
        </div>
      </div>
      <aside class="panel">
        <p class="label">Checklist manager</p>
        <h2>Webmaster / Blue Static</h2>
        <p>Blue Static manages the board because most blockers are systems, integrations, publishing, compliance, backend readiness, or build-log problems. Sheriff Lone Star and Serafina are first deputies for the P1 case-flow blockers.</p>
      </aside>
    </section>
    <section class="section panel">
      <h2>Priority Buckets</h2>
      <p><strong>P1</strong> unlocks the core Sheriff/Serafina production workflow. <strong>P2</strong> unlocks shared operations and communication infrastructure. <strong>P3</strong> improves specialist roles once the core operating system works.</p>
    </section>
    <section class="section" id="queue" aria-labelledby="queue-title">
      <h2 id="queue-title">One-By-One Review Queue</h2>
      <p class="status-note" id="checklist-status" role="status" aria-live="polite">Loading checklist state.</p>
      <div class="toolbar">
        <button type="button" class="primary" id="copy-checklist">Copy checklist JSON</button>
        <button type="button" id="download-checklist">Download checklist JSON</button>
        <button type="button" class="danger" id="reset-checklist">Reset browser checklist</button>
      </div>
      <div class="role-grid">${blockedCards}</div>
      <h2>Current Checklist Data</h2>
      <pre id="checklist-output">{}</pre>
    </section>
  </main>
  <footer>
    <span>Built as a blocker review list for Las Jaras staff workflows.</span>
    <a href="household-beings.html">Household beings directory</a>
  </footer>`;

const blockedWorkflowScript = `<script>
(() => {
  const items = ${JSON.stringify(blockedChecklistData)};
  const storageKey = "las-jaras-blocked-workflow-checklist-v1";
  const statusEl = document.querySelector("#checklist-status");
  const outputEl = document.querySelector("#checklist-output");
  const defaultEntry = () => ({ reviewed: false, decision: "review-next", notes: "" });
  function readState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }
  function writeState(state) {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }
  function normalizeState(state) {
    const next = {};
    items.forEach((item) => {
      next[item.id] = { ...defaultEntry(), ...(state[item.id] || {}) };
    });
    return next;
  }
  function collectState() {
    const state = {};
    items.forEach((item) => {
      const reviewed = document.querySelector('[data-blocker-done="' + item.id + '"]');
      const decision = document.querySelector('[data-blocker-decision="' + item.id + '"]');
      const notes = document.querySelector('[data-blocker-notes="' + item.id + '"]');
      state[item.id] = {
        reviewed: Boolean(reviewed && reviewed.checked),
        decision: decision ? decision.value : "review-next",
        notes: notes ? notes.value.trim() : ""
      };
    });
    return state;
  }
  function exportData(state) {
    return {
      checklistManager: "Webmaster / Blue Static",
      deputies: ["Sheriff Lone Star for P1 case blockers", "Serafina for escalation blockers"],
      updatedAt: new Date().toISOString(),
      items: items.map((item) => ({ ...item, ...(state[item.id] || defaultEntry()) }))
    };
  }
  function render() {
    const state = normalizeState(readState());
    items.forEach((item) => {
      const entry = state[item.id];
      const reviewed = document.querySelector('[data-blocker-done="' + item.id + '"]');
      const decision = document.querySelector('[data-blocker-decision="' + item.id + '"]');
      const notes = document.querySelector('[data-blocker-notes="' + item.id + '"]');
      const card = document.querySelector('[data-blocker-card="' + item.id + '"]');
      if (reviewed) reviewed.checked = entry.reviewed;
      if (decision) decision.value = entry.decision;
      if (notes) notes.value = entry.notes;
      if (card) card.classList.toggle("is-reviewed", entry.reviewed);
    });
    const reviewedCount = Object.values(state).filter((entry) => entry.reviewed).length;
    statusEl.textContent = "Blue Static is managing " + reviewedCount + " of " + items.length + " blockers reviewed. Work one item at a time; P1 goes first.";
    outputEl.textContent = JSON.stringify(exportData(state), null, 2);
    writeState(state);
  }
  function persist() {
    writeState(normalizeState(collectState()));
    render();
  }
  document.querySelectorAll("[data-blocker-done], [data-blocker-decision]").forEach((field) => {
    field.addEventListener("change", persist);
  });
  document.querySelectorAll("[data-blocker-notes]").forEach((field) => {
    field.addEventListener("input", persist);
  });
  document.querySelector("#copy-checklist").addEventListener("click", async () => {
    const text = outputEl.textContent;
    await navigator.clipboard.writeText(text);
    statusEl.textContent = "Checklist JSON copied. Blue Static tips their little webmaster hat.";
  });
  document.querySelector("#download-checklist").addEventListener("click", () => {
    const blob = new Blob([outputEl.textContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "las-jaras-blocked-workflow-checklist.json";
    link.click();
    URL.revokeObjectURL(link.href);
  });
  document.querySelector("#reset-checklist").addEventListener("click", () => {
    if (!confirm("Reset this browser's blocked workflow checklist?")) return;
    localStorage.removeItem(storageKey);
    render();
  });
  render();
})();
</script>`;

writeFileSync(join(process.cwd(), "projects", "household-beings.html"), layout({
  title: "Las Jaras Household Beings Directory",
  description: "Profile pages and an operating chart for every being running the Las Jaras household.",
  body: indexBody,
  prefix: ""
}));

writeFileSync(join(process.cwd(), "projects", "household-beings-blocked-workflows.html"), layout({
  title: "Blocked Household Staff Workflows",
  description: "A one-by-one review queue for Las Jaras household staff workflows blocked by missing tools, integrations, permissions, or data.",
  body: blockedWorkflowBody + blockedWorkflowScript,
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
          <a class="button" href="${dailyNotesPath(role)}">Daily Notes</a>
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
    ${renderOperatingNotes(role)}
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
  writeFileSync(join(notesDir, `${slugify(role.title)}-daily-notes.html`), dailyNotesPage(role));
}

console.log(`Generated ${roles.length + 1} household being pages and ${roles.length} daily note pages.`);
