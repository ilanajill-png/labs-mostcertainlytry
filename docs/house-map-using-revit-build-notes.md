# House Map Using Revit - Build Notes

Created: 2026-06-06
Status: live build log
Timing method: retrospective timing from chat timestamps for work already completed; explicit task timing from 2026-06-06 09:18 CDT forward.

## Question

Can HOWDY/Codex become genuinely useful on a Las Jaras Revit project, not just by giving advice, but by producing Revit-ready data, testable pyRevit commands, capture schedules, and model-review workflows?

## Current Bet

Put everything meaningful into Revit, but do it in a disciplined way:

- Architecture as real geometry.
- Systems and devices as modeled/tagged planning elements.
- Major furniture and important provenance objects as simplified Revit placeholders with IDs.
- Tiny objects stay in inventory unless they affect safety, provenance, guest experience, placement, or maintenance.

## Bibim Review Decision

Bibim is a useful reference pattern, but not the tool to adopt wholesale for Las Jaras right now.

What is worth borrowing:

- A local-first Revit add-in concept.
- A natural-language task planner that confirms before changing the model.
- Live Revit context before code is generated.
- Compile/check/run loops with useful debug artifacts.
- A reusable code/task library for repeated BIM chores.
- Dry-run and undo-first behavior.

What Las Jaras needs instead:

- A custom, narrower helper for this house project.
- Room capture forms that produce Revit-ready JSON.
- pyRevit commands for known tasks: create rooms, place placeholders, tag devices, export schedules, reconcile area.
- A validation layer against our Las Jaras source stack, not a general-purpose AI coding tool.
- Optional Dynamo/C# add-in work only after the pyRevit bridge proves itself.

Decision: build a **Las Jaras Revit Helper** if the Red Room test works. Start with pyRevit and structured data. Graduate to a C# add-in only if we repeatedly need live context, compiled C#, model transactions, dry-run previews, and undo support beyond what pyRevit can comfortably provide.

## First Test Case

The first proof case is the **Red Room Revit Capability Test**.

Why:

- It already has room dimensions: 136 in x 115 in.
- It already has wall roles: Wall 1 door/closet, Wall 2 bed, Wall 3 window, Wall 4 TV/apothecary drawers.
- It has known door/window/closet measurements.
- It has a saved layout JSON from the SketchUp/Blender workflow.
- It has object IDs and measurements for the bed, headboard, footboard, TV, apothecary drawers, side tables, ceiling fan, side lamp, and outlets.

Test command:

```text
Las Jaras > Model > Create Red Room Test
```

Success means:

- The pyRevit command can be loaded and attempted inside Revit.
- Errors are actionable if it fails.
- If it succeeds, Revit contains a usable Red Room starter model with walls and named placeholder objects.
- The result can be exported with `Las Jaras > Model > Export Room Data`.

## Built So Far

- `revit-automation/README.md`
- `revit-automation/RUNBOOK.md`
- `revit-automation/LAS_JARAS_30_DAY_REVIT_CAPTURE_PLAN.md`
- `revit-automation/LAS_JARAS_WEEKEND_LIGHTING_CAPTURE.md`
- `revit-automation/LAS_JARAS_SITE_PLAN_REVIT_READINESS_REVIEW.md`
- `revit-automation/LAS_JARAS_REVIT_SOURCE_STACK.md`
- `revit-automation/tests/red-room-field-capture-sheet.md`
- `revit-automation/tests/red-room-revit-capability-test.md`
- `revit-automation/tests/red-room-revit-task-map.md`
- `revit-automation/tests/red-room-revit-test-data.json`
- `revit-automation/pyrevit/LasJaras.extension/Las Jaras.tab/Model.panel/Create Red Room Test.pushbutton/script.py`
- `revit-automation/pyrevit/LasJaras.extension/Las Jaras.tab/Model.panel/Export Room Data.pushbutton/script.py`
- `labs-mostcertainlytry/projects/house-map-using-revit.html`
- `labs-mostcertainlytry/docs/house-map-using-revit.md`

## Timing Log

| Task | Timing Source | Start | End | Elapsed | Output | Notes |
|---|---|---:|---:|---:|---|---|
| Define Revit automation path | Retrospective from chat | 08:35 | 08:38 | ~3 min | Revit automation starter workspace, pyRevit export command, runbook | First pass was intentionally simple: local bridge, read-only export first. |
| Create 30-day Revit capture plan | Retrospective from chat | 08:38 | 08:46 | ~8 min | Comprehensive 30-day capture plan | Included architecture, systems, furniture/context, schedules, and field kit. |
| Move lighting/smart-home to Day 2 and review site plan | Retrospective from chat | 08:46 | 08:50 | ~4 min | Weekend lighting capture doc + site readiness review | Site plan judged schematic; Schertz GIS later improved exterior source stack. |
| Create Labs project page | Retrospective from chat | 08:50 | 08:54 | ~4 min | `House Map Using Revit` Labs page, JSON entry, source notes | Marked In Progress. |
| Open Labs project page locally | Retrospective from chat | 08:54 | 08:57 | ~3 min | Browser opened local HTML page | Used macOS `open` because interactive browser tool was not exposed. |
| Research public sources and Revit existing-condition source stack | Retrospective from chat | 08:57 | 09:04 | ~7 min | `LAS_JARAS_REVIT_SOURCE_STACK.md` | Found Schertz GIS building-footprint layer for 406 Brooks. |
| Check for existing point cloud files | Retrospective from chat | 09:04 | 09:05 | ~1 min | Workspace scan for point-cloud/CAD/Revit formats | No point cloud found. |
| Research free iPhone LiDAR scan options | Retrospective from chat | 09:07 | 09:13 | ~6 min | Recommendation: Scaniverse first, SiteScape for E57/RCP | App pricing changes, so notes should be rechecked before a real scan. |
| Build Red Room Revit capability test | Retrospective from chat | 09:13 | 09:16 | ~3 min | Test doc, JSON data, pyRevit command | Syntax validated locally; real result needs Revit/pyRevit. |
| Add Red Room test case to Labs notes/page | Retrospective from chat | 09:16 | 09:18 | ~2 min | Labs source notes and visible project page updated | Added test purpose, command, files, success criteria, known gaps. |
| Create this build-notes timing log | Explicit timing | 09:18 | 09:19 | ~1 min | `house-map-using-revit-build-notes.md` | First explicitly timed entry. |
| Review Bibim Revit/Dynamo pattern | Explicit timing | 09:20 | 09:21 | ~1 min | Bibim decision added to build notes, source notes, and Labs page | Recommendation: borrow the pattern, build a smaller Las Jaras-specific helper only if the Red Room test proves the bridge. |
| Map Red Room Revit task ownership | Explicit timing | 09:24 | 09:25 | ~1 min | `red-room-revit-task-map.md` | Split work into Human, HOWDY Partner, and Shared tasks from field capture through acceptance. |
| Start Red Room field packet | Explicit timing | 09:26 | 09:27 | ~1 min | `red-room-field-capture-sheet.md` and updated test JSON | JSON now marks verification status, field sheet link, modeling tolerances, and next human capture items. |

## Timing Lessons So Far

- Planning artifacts are fast: 3-8 minutes each when the source context already exists.
- Research passes take slightly longer because current sources need verification.
- Local code generation is quick, but the real time will be in Revit testing/debugging.
- Revit-side failures will probably dominate elapsed time until the pyRevit bridge is proven.
- A general AI Revit add-in is probably overkill until we have repeated Las Jaras-specific tasks that justify compiled C#, live model context, dry-runs, and undo support.

## Next Timed Tasks

Use explicit start/end timing for:

- Install/attach `LasJaras.extension` in pyRevit.
- Run `Create Red Room Test`.
- Debug the first Revit API error.
- Export model summary JSON.
- Inspect exported JSON and propose next revision.
- Add real door/window openings instead of notes/placeholders.
- Add schedules/shared parameters.
