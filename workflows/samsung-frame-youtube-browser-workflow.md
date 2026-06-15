# Samsung Frame YouTube / Browser Workflow

Use this when DJ Bluehour or Marquee Clementine needs the living-room Samsung Frame to show YouTube, a jukebox page, a movie page, or another browser-based media surface.

## What We Learned

- The Samsung Frame may be in Art Mode even when remote-control commands report success.
- `tools/samsung-living-room-tv-open-url` can return `{"ok": true}` without changing the visible screen. Treat that as command acceptance, not proof of playback.
- This Frame model does not expose a reliable direct URL launcher. The house display scripts already note the reliable pattern: manually leave the TV browser on the desired page once, then restore it later with `KEY_WWW`.
- If the TV is showing Serafina Daily Alert or another static brief, it is probably in Samsung Frame Art Mode, not a live browser page.

## Recovery Before Media Playback

1. Check whether the TV is reachable:

   ```bash
   curl -s --max-time 5 http://192.168.1.173:8001/api/v2/
   ```

2. If the screen is in Art Mode, turn Art Mode off through the Frame API before trying browser or app commands:

   ```bash
   PYTHONNOUSERSITE=1 /tmp/samsungtvws-venv/bin/python - 192.168.1.173 10851490 <<'PY'
   from samsungtvws import SamsungTVWS
   tv = SamsungTVWS(host="192.168.1.173", port=8002, token="10851490", timeout=10, name="OpenClaw Las Jaras")
   art = tv.art()
   print("before", art.get_artmode())
   print(art.set_artmode(False))
   print("after", art.get_artmode())
   PY
   ```

3. Restore the TV/browser shell:

   ```bash
   tools/samsung-living-room-tv KEY_HOME
   tools/samsung-living-room-tv KEY_WWW
   ```

4. Only after the browser or app is visibly available should DJ or Theatre send media commands.

## Preferred Playback Pattern

- For household dashboards and the Las Jaras jukebox, leave the Samsung browser on the page once, then use:

  ```bash
  tools/samsung-living-room-tv WAKE
  sleep 8
  tools/samsung-living-room-tv KEY_WWW
  ```

- For YouTube music, DJ should build a real YouTube queue URL or use the Las Jaras jukebox, not a YouTube search page.
- For movies, Theatre should prefer the visible app/browser state and human confirmation over blind URL launches.

## Verification Rule

Do not say the TV is playing unless one of these is true:

- The human confirms it is visible/audible.
- A browser/canvas/screenshot-capable tool confirms the displayed state.
- The media app provides a readable playback state.

If all we have is `{"ok": true}` from the Samsung remote API, say: "The TV accepted the command," not "it is playing."

## Failure Mode

If a YouTube/browser launch briefly shows jukebox/browser and then returns to Art Mode:

1. Stop retrying direct URL launches.
2. Run the Art API `set_artmode(False)` recovery.
3. Restore browser with `KEY_WWW`.
4. Ask the human to manually open or leave the browser on the target page once if the browser does not stick.
