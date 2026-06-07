# House Map Using Revit

Created: 2026-06-06
Status: In Progress

## Summary

House Map Using Revit is the Las Jaras 30-day BIM capture project: build a useful Revit model of the house, site, lighting, smart-home devices, room systems, furniture anchors, and exterior shell without wasting time on decorative detail that belongs in inventory instead.

## Current Shape

- Local Revit automation workspace: `../revit-automation/`
- Build notes and timing log: `docs/house-map-using-revit-build-notes.md`
- Main capture plan: `../revit-automation/LAS_JARAS_30_DAY_REVIT_CAPTURE_PLAN.md`
- Weekend lighting sprint: `../revit-automation/LAS_JARAS_WEEKEND_LIGHTING_CAPTURE.md`
- Site-plan readiness review: `../revit-automation/LAS_JARAS_SITE_PLAN_REVIT_READINESS_REVIEW.md`
- Revit source stack: `../revit-automation/LAS_JARAS_REVIT_SOURCE_STACK.md`
- Red Room field capture sheet: `../revit-automation/tests/red-room-field-capture-sheet.md`
- First capability test: `../revit-automation/tests/red-room-revit-capability-test.md`
- Red Room task ownership map: `../revit-automation/tests/red-room-revit-task-map.md`
- First capability test data: `../revit-automation/tests/red-room-revit-test-data.json`
- First pyRevit test command: `../revit-automation/pyrevit/LasJaras.extension/Las Jaras.tab/Model.panel/Create Red Room Test.pushbutton/script.py`

## Project Principle

Revit gets anything that affects measurements, decisions, systems, safety, maintenance, documentation, contractor conversations, or future hosting operations.

Inventory gets tiny decor, dishware, most tabletop objects, and anything that does not affect geometry or planning.

## Near-Term Focus

The schedule has been adjusted so Day 2 captures electrical, lighting, and smart-home information for:

- Kitchen.
- Living Room.
- Red Room.
- Hallways.

The existing garden site plan can seed the Revit site reference, but its structure footprints are schematic. Days 4-6 still need measured exterior wall lengths, openings, porches, deck, storage, setbacks, and utility locations.

## First Test Case: Red Room Revit Capability Test

Before scaling to the whole house, the project will test Codex/Revit help on the Red Room.

Why the Red Room:

- It already has measured dimensions: 136 in x 115 in.
- It has known wall roles: Wall 1 door/closet, Wall 2 bed, Wall 3 window, Wall 4 TV/apothecary drawers.
- It has known door, closet, and window measurements.
- It has a saved layout JSON from the SketchUp/Blender workflow.
- It has object IDs and furniture dimensions for the Gramercy bed, TV, apothecary drawers, side tables, ceiling fan, side lamp, and outlets.

What the test should prove:

- Codex can translate household notes into Revit-ready room data.
- Codex can produce a clear manual Revit checklist.
- Codex can generate a pyRevit command that attempts to create walls and placeholder objects.
- Codex can inspect exported Revit JSON afterward and identify what broke, what is missing, and what to do next.

Test command:

```text
Las Jaras > Model > Create Red Room Test
```

Success criteria:

- The pyRevit command can be installed and attempted.
- Errors are actionable if it fails.
- If it succeeds, Revit contains a usable Red Room starter model with walls and named placeholder objects.
- The result can be exported with `Las Jaras > Model > Export Room Data`.

Known limitations:

- Door/window/closet openings may start as notes or placeholders, not fully cut Revit families.
- Ceiling height, closet depth, exact outlet heights, switch placement, bulb bases, fixture labels, TV mounting height, and curtain hardware dimensions still need field capture.
- This test is a bridge test, not the final modeling standard.

## Bibim-Style Custom Tool Decision

Reviewed Bibim on 2026-06-06 as a reference for Revit automation.

Useful reference points:

- Bibim's Revit build is a C# add-in that turns natural language into executable C# inside Revit.
- Bibim's Dynamo build turns natural language into Dynamo Python.
- The stronger idea is not the chat UI; it is the loop: understand the model context, plan, generate code, validate, run, capture debug artifacts, and preserve undo/dry-run behavior.

Las Jaras decision:

- Do not use Bibim as the primary tool.
- Do not build a broad Bibim clone yet.
- Build a narrower **Las Jaras Revit Helper** if the Red Room capability test works.
- Start with pyRevit scripts and structured JSON because they are faster to change and easier to inspect.
- Consider a C# add-in later only if pyRevit becomes too clumsy for live model context, dry-run previews, robust undo, compiled validation, or a persistent task library.
