# Las Jaras GoveeLife Freezer Monitor Checklist

Created: 2026-06-17  
Device: GoveeLife Smart Thermometer R1 with Wi-Fi Gateway  
Likely device family: H5108 sensor + B5108 gateway, based on GoveeLife product listing and FCC H5108 manual record.

## Purpose

Set up one freezer monitor as a practical safety system for the Samsung freezer concern at Las Jaras. The goal is not just a pretty temperature chart. The goal is early warning when freezer temperature rises enough that food, money, and peace of mind are at risk.

Hard requirement: the monitor must become machine-readable by HOWDY through Home Assistant, MQTT, a local API, a cloud API, email/webhook forwarding, or another reliable automation path. A product that only works when Buddy sends screenshots is not acceptable for the Las Jaras house-alert stack. Screenshots are only a temporary setup/debug fallback.

## Ownership Legend

- HOWDY: work I can do from the workspace, browser, public docs, Home Assistant, APIs, logs, and follow-up prompts.
- Buddy: work that needs physical access, phone app access, account permissions, Wi-Fi credentials, or judgment about food condition.
- Shared: work we do by passing readings, decisions, and limited setup evidence back and forth.

## 80-Step Setup And Test Checklist

| # | Owner | Status | Step | Pass Criteria |
|---:|---|---|---|---|
| 1 | HOWDY | Done | Identify device from photo. | Photo shows GoveeLife Smart Thermometer R1 with Wi-Fi Gateway. |
| 2 | HOWDY | Done | Match product family to public docs. | GoveeLife page lists Model H5108&B5108. |
| 3 | HOWDY | Done | Confirm food-safety target. | Freezer target is 0°F or below. |
| 4 | HOWDY | Planned | Create public-safe setup checklist. | This document exists. |
| 5 | HOWDY | Planned | Create Labs white paper. | Public page exists under Labs projects. |
| 6 | Buddy | Needed | Open the box and lay out all parts. | Gateway, sensor/display, probe, clips/lanyard, batteries or pull tab, paperwork are visible. |
| 7 | Buddy | Needed | Photograph included parts if anything looks different from the box. | HOWDY can compare against expected kit. |
| 8 | Buddy | Needed | Check for a printed QR code or serial number and keep it private. | No serial/QR gets posted publicly. |
| 9 | Buddy | Needed | Install or open the Govee Home app. | App opens on phone. |
| 10 | Buddy | Needed | Log in or create/confirm the Govee account if required. | App can add devices. |
| 11 | Buddy | Needed | Confirm Bluetooth is enabled on the phone. | App can scan nearby devices. |
| 12 | Buddy | Needed | Confirm phone is on the intended 2.4 GHz Wi-Fi network if pairing asks for Wi-Fi. | Gateway pairing is not blocked by 5 GHz-only network. |
| 13 | Buddy | Needed | Plug in the Wi-Fi gateway near the freezer for first pairing. | Gateway powers on close to the freezer. |
| 14 | Buddy | Needed | Pull the thermometer battery insulation tab or install batteries. | Screen wakes up. |
| 15 | Buddy | Needed | Plug the temperature probe into the thermometer if separate. | Screen shows a live temperature. |
| 16 | Buddy | Needed | Keep probe and sensor at room temperature for the first app pairing. | Device is easy to handle while pairing. |
| 17 | Buddy | Needed | Tap Add Device in Govee Home. | App starts device discovery. |
| 18 | Buddy | Needed | Select the R1/H5108 thermometer if shown. | Correct device is selected. |
| 19 | Buddy | Needed | Pair the sensor over Bluetooth. | App shows the thermometer in the device list. |
| 20 | Buddy | Needed | Pair/bind the thermometer to the Wi-Fi gateway. | App shows remote monitoring available. |
| 21 | Buddy | Needed | Enter Wi-Fi credentials only in the app. | Gateway connects successfully. |
| 22 | HOWDY | Can guide | Troubleshoot pairing if pairing fails. | We can identify whether it is Bluetooth, Wi-Fi, location permission, or gateway binding from app-visible errors or device behavior. |
| 23 | Buddy | Needed | Rename device `Las Jaras Freezer`. | App list is readable later. |
| 24 | Buddy | Needed | Set temperature unit to Fahrenheit. | App and display show °F. |
| 25 | Buddy | Needed | Confirm the device home/status page shows connected. | App confirms the gateway and thermometer are online without sharing private credentials. |
| 26 | Shared | Planned | Confirm gateway update interval expectation. | App history populates; public product FAQ says gateway-bound data updates every 10 minutes. |
| 27 | Buddy | Needed | Place sensor/display outside the freezer or on the freezer exterior if probe cable allows. | Electronics are not unnecessarily kept in deep cold unless product placement requires it. |
| 28 | Buddy | Needed | Place probe inside freezer center zone. | Probe is not against a wall, vent, door, gasket, or ice buildup. |
| 29 | Buddy | Needed | Secure probe cable so door gasket still closes fully. | No visible gap, pinching, or frost leak. |
| 30 | Buddy | Needed | Close freezer door and leave unopened for 30 minutes. | Reading starts dropping toward freezer range. |
| 31 | Shared | Planned | Record reading at 30 minutes. | Log time and temperature. |
| 32 | Buddy | Needed | Leave freezer unopened until 60 minutes. | Reading stabilizes further. |
| 33 | Shared | Planned | Record reading at 60 minutes. | Log time and temperature. |
| 34 | HOWDY | Can do | Interpret early readings against target. | 0°F or below is healthy; above 0°F needs context and trend. |
| 35 | Buddy | Needed | Check whether food is frozen solid. | Food condition informs safety, not just thermometer data. |
| 36 | Buddy | Needed | Photograph any softening, frost melt, leakage, or freezer display/settings if relevant. | Evidence is available for issue triage. |
| 37 | Shared | Planned | Decide first alert thresholds. | Warning and urgent thresholds are set intentionally. |
| 38 | Buddy | Needed | Set low-temperature floor only if the app requires it. | Avoid noisy alerts for harmless colder temps. |
| 39 | Buddy | Needed | Set warning/high-temp alert around 5°F. | Mild drift gets noticed. |
| 40 | Buddy | Needed | Set urgent/high-temp alert around 10°F. | Serious warming gets attention before disaster. |
| 41 | Buddy | Needed | Enable app push notifications for Govee Home. | Phone can receive alerts. |
| 42 | Buddy | Needed | Disable Focus/notification settings that would hide critical alerts if desired. | Alerts can actually interrupt when needed. |
| 43 | Buddy | Needed | Set anti-false-alarm delay to 10 minutes if available. | Door openings do not create constant noise. |
| 44 | HOWDY | Can guide | Review alert settings if Buddy reads them out or shares a limited setup screenshot. | Thresholds and delay look correct; screenshot review is a fallback, not the operating model. |
| 45 | Buddy | Needed | Do a controlled door-open test for 60 seconds. | Temperature rises enough to show responsiveness. |
| 46 | Buddy | Needed | Close freezer and wait for recovery. | Temperature begins moving back down. |
| 47 | Shared | Planned | Log open-test start, peak, and recovery time. | Baseline recovery profile exists. |
| 48 | Buddy | Needed | Temporarily warm probe by holding it outside freezer if needed to trigger alert safely. | Alert fires without risking food. |
| 49 | Buddy | Needed | Confirm push alert appears on phone. | Human sees the alert. |
| 50 | Buddy | Needed | Confirm app history logs the excursion. | Data is retained in graph/history. |
| 51 | Shared | Planned | Confirm alert notification/history exists. | Evidence confirms monitor is working; local automation still remains the real pass gate. |
| 52 | Buddy | Needed | Return probe to normal freezer placement. | Monitoring resumes. |
| 53 | Buddy | Needed | Leave freezer closed for 2 hours. | Trend stabilizes. |
| 54 | Shared | Planned | Record 2-hour min/max/current temp. | Short baseline exists. |
| 55 | Buddy | Needed | Run overnight monitoring. | Natural defrost cycles and room conditions are captured. |
| 56 | Shared | Planned | Review overnight high temp. | Any spike above 10°F is investigated. |
| 57 | Shared | Planned | Review overnight low temp. | System is actually freezing, not just briefly cooling. |
| 58 | Shared | Planned | Review notification history. | No missed critical alerts. |
| 59 | HOWDY | Can do | Create a freezer incident rubric. | Green/yellow/red interpretation rules are written. |
| 60 | HOWDY | Can do | Update the Samsung freezer case with test results if requested. | Case has readings, timing, and next action. |
| 61 | Buddy | Needed | Decide whether alert should also go to another household phone. | Additional human recipient is a privacy/account choice. |
| 62 | Buddy | Needed | Decide whether Govee account sharing is acceptable. | No account sharing happens by accident. |
| 63 | HOWDY | Can research | Attempt Home Assistant or API integration before declaring the device approved. | The device produces readable current temperature, battery/status, and update timestamps for HOWDY. |
| 64 | Shared | Needed | If Home Assistant cannot see the device, return/replace it and buy a different product. | Screenshot-only monitoring fails the Las Jaras alert-system requirement. |
| 65 | Shared | Optional | Test freezer-door-open behavior during real use. | Normal household use does not create false panic. |
| 66 | Shared | Optional | Test power outage behavior when safe. | We know whether gateway reconnects and history resumes. |
| 67 | Buddy | Needed | Avoid posting QR codes, serial numbers, MAC addresses, Wi-Fi names, or account screens. | Public Labs artifact remains privacy-safe. |
| 68 | HOWDY | Can do | Keep public paper generic and non-sensitive. | Labs page describes workflow, not private credentials. |
| 69 | Buddy | Needed | Confirm final physical mounting location. | Probe/sensor placement is stable and gasket-safe. |
| 70 | Buddy | Needed | Check battery status after first cold cycle. | No immediate low-battery surprise. |
| 71 | HOWDY | Can do | Add battery-replacement reminder if buddy wants. | Future maintenance is scheduled. |
| 72 | Shared | Planned | Define response when alert fires at 5°F. | Check door, gasket, power, contents, and trend. |
| 73 | Shared | Planned | Define response when alert fires at 10°F. | Inspect immediately and start food-safety decision tree. |
| 74 | Shared | Planned | Define response when alert fires at 32°F or food is thawing. | Treat as urgent and evaluate food condition. |
| 75 | HOWDY | Can do | Draft a fallback “what to send HOWDY after an alert” prompt. | Buddy can paste readings/history/photos if automation is degraded. |
| 76 | Buddy | Needed | Save Govee Home app in an easy phone location. | Alert response does not start with app hunting. |
| 77 | Shared | Planned | Recheck after 7 days. | Week-one behavior is understood. |
| 78 | Shared | Planned | Decide whether to buy/add a second sensor for the other freezer. | Decision is based on data. |
| 79 | HOWDY | Can do | Convert results into a Labs follow-up once tested. | Public update stays useful and privacy-safe. |
| 80 | Shared | Planned | Mark freezer monitor setup complete. | Device alerts, Home Assistant/API visibility, logs, and overnight baseline all passed. |

## Approval Gate

This device is not approved for the Las Jaras house-alert stack until HOWDY can read it without Buddy manually sending screenshots. The minimum acceptable entities/events are:

- Current freezer temperature
- Last update timestamp or freshness signal
- Battery status if exposed
- Gateway/device online or unavailable state
- Alertable threshold crossings in Home Assistant or an equivalent alert bus

If the Govee R1 cannot expose those signals reliably, the correct outcome is not "Buddy sends screenshots forever." The correct outcome is return it, replace it, or buy a different freezer monitor that is known to feed Home Alerts.

## First Alert Rules

- Green: freezer is at or below 0°F and food is frozen solid.
- Yellow: freezer is 1°F to 9°F or showing short spikes that recover quickly.
- Orange: freezer reaches 10°F or higher, repeats spikes, or takes unusually long to recover.
- Red: food is softening, thawed, leaking, or freezer approaches/holds above 32°F.

## What To Send HOWDY After Setup

Paste this after the first hour or overnight test:

```text
GoveeLife R1 freezer test:
- Sensor name:
- Placement:
- Start time:
- 30 minute reading:
- 60 minute reading:
- Current reading:
- Highest reading:
- Lowest reading:
- Alert thresholds:
- Alert delay:
- Food condition:
- Any fallback screenshots/photos attached:
Please interpret the trend and tell me whether the Samsung freezer case is green, yellow, orange, or red.
```

## Source Trail

- GoveeLife Smart Thermometer R1 product page: https://us.goveelife.com/products/goveelife-smart-thermometer-r1
- FCC H5108 Smart Thermometer R1 manual record: https://fccid.io/2AQA6-H5108/User-Manual/15-H5108-UserMan-US-6836898
- Home Assistant Govee BLE integration: https://www.home-assistant.io/integrations/govee_ble/
- Govee Developer Platform: https://developer.govee.com/
- FoodSafety.gov cold food storage chart: https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts
- FDA refrigerator thermometer guidance: https://www.fda.gov/food/buy-store-serve-safe-food/refrigerator-thermometers-cold-facts-about-food-safety
