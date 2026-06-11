# Las Jaras Nervous System IoT Checklist

Created: 2026-06-11

Purpose: translate the Las Jaras ethos into practical automations that make the home feel loved, calm, and cared for without visible fuss.

## Management Model

- Final decision-maker: Ilana / buddy.
- Master list owner: Soma Hearthline, the Las Jaras Living System Steward.
- Coordination owner: HOWDY PARTNER as House Chief of Staff.
- Implementation owner: Home Assistant Steward, managed by Soma and HOWDY PARTNER through Home Assistant, device docs, and test logs.
- Guest experience owner: Hospitality Ritual Steward, focused on arrival, room cards, guest mode, and physical controls.
- Lighting owner: Lighting Steward, focused on Hue scenes, switches, room moods, and no-blue-light rules.
- Garden/environment owner: Garden Heat Manager, focused on plants, weather, air, porch, and outdoor comfort.
- Safety/privacy owner: Presence and Privacy Steward, focused on house modes, private data, camera boundaries, and guest-safe dashboards.

## Checklist

| Status | Item | First Build | Manager |
| --- | --- | --- | --- |
| Planned | Morning terracotta sunrise | Bedroom and hallway lights fade from warm low amber to soft morning light. | Lighting Steward |
| Planned | Golden-hour evening wind-down | Shared spaces shift to warm, dim, low-stimulation lighting after sunset. | Lighting Steward |
| Planned | Guest arrival mode | Porch, entry, guest room, Wi-Fi note, temperature, and dashboard are ready before arrival. | Hospitality Ritual Steward |
| Planned | Texas heat pre-cool | Pre-cool house before peak heat while avoiding overcooling or waste. | Home Assistant Steward |
| Planned | Bedroom sleep cocoon | Cooler bedroom, low amber lights, quiet notifications, optional sleep audio, and all-off safety check. | Lighting Steward |
| Planned | Night path lighting | Motion or button-triggered low amber/red path lights for bathroom and kitchen trips. | Lighting Steward |
| Planned | Quiet doorbell after dark | Doorbell/chime gets softer during wind-down and sleep windows. | Safety/privacy owner |
| Planned | Air refresh mode | Track CO2/humidity/particulates once sensors exist; nudge ventilation or purifier use only when useful. | Garden/environment owner |
| Planned | Storm comfort scene | Warm lights, charged devices reminder, porch/security check, and calm dashboard language during storms. | Home Assistant Steward |
| Planned | One-button no-visible-fuss reset | All core public spaces return to clean, warm, guest-ready baseline. | Soma Hearthline |

## Operating Rules

- Automations must reduce decisions, not add them.
- Every guest-facing automation needs a physical fallback: switch, button, card, or simple note.
- Never expose private calendar, inventory, messages, or personal routines on guest dashboards.
- No purchases, account signups, or external commitments without Ilana's approval.
- Each automation should have a prompt, device list, test steps, fallback, and tools-used ledger.

## Reusable Prompt Template

Design an automation for Las Jaras, a 1952 Texas home designed as a living system. The automation should support nervous system ease, no visible fuss, guest safety, privacy, and physical fallback controls. Include: purpose, trigger, devices needed, Home Assistant entities, exact scene behavior, failure mode, guest experience, test plan, and tools used.
