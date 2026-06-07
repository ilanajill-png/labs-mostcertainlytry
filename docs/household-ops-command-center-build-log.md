# Las Jaras Ops Command Center Build Log

## Question

How do we give household AI work a visible place to live so experiments do not disappear into chat history?

The Las Jaras household automation work needed a scoring layer before the next workflow build. Groceries, expiration tracking, garden care, errands, maintenance, site planning, and morning brief ideas all needed to be tracked as experiments with practical ratings: impact, autonomy, effort, risk control, and delight.

## Build

The build created a cobalt-blue static Labs microsite at `projects/household-ops-command-center.html`. After the house identity work, the page now treats Las Jaras as a specific 1952 Schertz house with an approximately 10,275 sqft lot, 1,800 sqft of living area, and a garden/site-plan layer that can use GIS parcel geometry before an interior floor plan exists.

The current build includes:

- starter workflow records for grocery autopilot, expiration radar, garden heat manager, morning house brief, errand planner, and household memory loop
- starter workflow records for GIS garden site modeling and the interior floor plan sprint
- Las Jaras profile cards for living area, year built, lot size, site pieces, records, and planning stance
- a house personality section anchored in cobalt blue, old-house pragmatism, garden awareness, and quiet useful nudges
- a sticky Labs-style top bar and hero actions for the scoreboard, house profile, garden site plan, field checklist, workflow rating form, and build log
- a kitchen outline section that summarizes the two-zone storage model from `KITCHEN_STORAGE_MAP.md`
- a Household Food subsection nested under Kitchen, with inventory, grocery, expiration, cookbook, and storage-plan links
- a Lighting + Smart Home subsection with links to the Las Jaras smart-home plan, lighting intake, local Home Assistant, and Home Assistant setup notes
- recurring Household Food tasks for Sunday Cibolo H-E-B pickup planning and Tuesday Schertz follow-up planning
- a generated Sunday Cibolo pickup list at `HEB_CIBOLO_PICKUP_LIST_2026-05-31.md`
- links from the kitchen outline to the full kitchen diagram, editable diagram, and left-pantry diagram
- dashboard metrics for tracked workflows, average overall score, top priority score, and active/candidate workflows
- workflow portfolio cards sorted by priority, with area/status metadata, notes, tags, overall score, priority score, and rating bars
- a blunt five-part scoring rubric: impact, autonomy, effort, risk control, and delight
- a scoreboard table with workflow notes, area, status, overall score, priority score, and delete controls
- an add/update form that edits existing workflows by matching workflow name, or adds a new workflow when the name is new
- a restore-starter-data control for returning to the baseline workflow set
- browser-local storage for ratings and workflow edits
- search and filters by area and status
- calculated priority and overall scores
- a standalone garden/site planning diagram at `projects/las-jaras-garden-site-plan.html`
- a phone-friendly garden field checklist form at `projects/las-jaras-garden-field-checklist.html`
- a companion full HTML project log at `projects/household-ops-command-center-build-log.html`
- a shared lightweight privacy gate for the command center, project log, and related private household-planning pages
- Labs project metadata in `projects.json`
- sitemap coverage for the public page

The starter workflow set now covers:

- Pantry-To-Pickup Autopilot
- Expiration And Waste Radar
- Garden Heat Manager
- GIS Garden Site Model
- Interior Floor Plan Sprint
- Morning House Brief
- Lighting Control Bridge
- VicoHome Bird Feeder Management
- IoT 14-Day Setup Sprint
- Errand Route And Timing Planner
- Home Ops Memory Loop

The priority formula intentionally favors high-impact, higher-autonomy, bounded-risk, pleasing workflows while still counting effort. The command center is not meant to reward cleverness alone; a workflow has to earn space in the household.

The kitchen outline captures the current working model:

- `KZ-1` left cooking/wet zone: range, sink, dishwasher, base cabinets, lazy Susan, open shelves, microwave cabinet, and coffee counter
- `KZ-2` right pantry/fridge zone: Left Pantry, Active Fridge, Overflow Fridge, Right Pantry, Right Counter, and Right Open Shelf
- `KZ-D1` / `KZ-D2`: the two-doorway split that matters for traffic flow and where daily-use items should live

Household Food now sits under Kitchen in the command center because pantry inventory, pickup planning, expiration tracking, and cooking from storage are kitchen operations before they are general household workflows.

VicoHome bird feeder cameras now sit under Smart Home management. They are tracked as app-managed devices with Home Assistant helper entities because VicoHome does not officially expose RTSP/ONVIF or a local camera stream. The possible Home Assistant path is an unofficial cloud-polling custom integration that should only be tested with buddy entering credentials directly in Home Assistant.

2026-06-01 update: added a direct Schertz Birds nav/hero link, linked the Smart Home card to the VicoHome integration page and `LAS_JARAS_IOT_14_DAY_PROJECT_PLAN.md`, and added the two-week IoT setup sprint workflow for bird feeders, lighting, Home Assistant dashboards, and affiliate application prep.

The first recurring Sunday Cibolo planning run generated `HEB_CIBOLO_PICKUP_LIST_2026-05-31.md`, focused on pantry-cookbook gaps, missing beans/tomatoes/grains, coupon-watch items, and a put-away workflow that lands groceries on the Right Counter before inventory updates.

## Tools

- OpenClaw for household context and workspace access
- Codex for implementation and validation
- static HTML/CSS/JavaScript for a portable Labs page
- `localStorage` for lightweight browser-side persistence
- a shared JavaScript/CSS page gate for private Las Jaras planning surfaces
- `HOUSE_AI_WORKFLOWS.md`, private Las Jaras public-record notes, and the grocery autopilot runbook as source context
- `projects.json` as the Labs project index

## Result

The Las Jaras household AI program now has a working command center instead of a loose list of ideas. Each workflow can be rated, compared, filtered, and promoted based on practical value, and the site now has enough house identity to guide future exterior, interior, and automation work.

The first exterior planning artifact is now live: a schematic garden site plan that turns the approximate 75 ft x 137 ft parcel into a true-north-oriented planning diagram with record-based structure placeholders, sun zones, watering zones, and field-measurement caveats.

The next capture artifact is also live: a phone-friendly field checklist with autosave, photo upload previews, measurement inputs, hose-bib checks, shade observations, garden asset notes, and JSON export so the schematic can be updated from real field data.

The useful shift is that new household automations can be treated like product experiments. The site captures what was proposed, how mature it is, what kind of lift it creates, and whether it is ready to automate further.

The build log itself is now part of the product surface rather than a tiny launch note. It records the method, house facts captured, produced artifacts, design decisions, and version history so future changes can be judged against the same household operating principles.

## Next

The next useful improvements are:

- publish the Labs update after review
- wire future workflow outputs into the tracker as structured records
- add an export/import option so browser-local data can be backed up
- create a recurring review habit for retired, active, and candidate workflows
- build the interior floor plan from a phone walkthrough plus 10-15 key measurements
- use garden field-checklist exports to revise the schematic site plan into a measured version
