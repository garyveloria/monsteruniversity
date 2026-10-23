# Monster Campus — 8-screen Infinite Run

A React + TypeScript + Vite demo for eight separate laptops, each driving one external monitor. Each page renders a local slice of the same wide campus scene and uses wall-clock time to estimate the shared animation phase.

## Requirements

- Node.js 20.19+ or 22.12+ recommended
- npm
- Eight laptops with external monitors, set to **Extend** display mode
- A deployed HTTPS URL for event day

## Run locally

```bash
npm install
npm run dev
```

Vite prints a local URL. To test from other laptops on the same network, use the network URL printed by Vite (or configure firewall/network access). Use `?screen=1` through `?screen=8`.
Use the on-screen **<** and **>** buttons to navigate between screens; they wrap around between screens 1 and 8.

Examples:

```text
http://localhost:5173/?screen=1
http://localhost:5173/?screen=2
http://localhost:5173/?screen=8
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Create a GitHub repository and push this project.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. The site is static; no environment variables or database are needed.
5. Open the deployed URL with `?screen=1` ... `?screen=8`.

Netlify also works: build command `npm run build`, publish directory `dist`.

## URLs

If your deployment URL is `https://your-project.vercel.app`, assign:

- `https://your-project.vercel.app/?screen=1`
- `https://your-project.vercel.app/?screen=2`
- ...
- `https://your-project.vercel.app/?screen=8`

Append `&test=1` to show monitor boundaries, for example `?screen=3&test=1`.

## How synchronization works

The animation phase is derived from `Date.now() % cycleDuration` rather than a per-tab animation start. Devices with synchronized system clocks compute the same phase even when opened at different times. The character's global X position is mapped to the local screen's coordinate range.

This is a practical best-effort approach, not frame-locked multi-device playback. Laptops may differ in clock accuracy, browser throttling, refresh rate, or viewport dimensions. For tighter alignment:
- Connect all laptops to the same reliable network and enable automatic date/time.
- Keep all browsers in the foreground and disable sleep/energy saver during the display.
- Use the same browser zoom (100%) and display scaling where practical.
- Match monitor resolution and height; use extended desktop, not mirroring.
- Check the seam test before the event.

## Event-day alignment test

1. On every laptop, open its screen URL with `&test=1`, e.g. `/?screen=1&test=1`.
2. Confirm each display has the expected screen number and the vertical seam guides line up with monitor edges. The test guides are a visual aid, not a calibration system.
3. Temporarily compare the campus building edges and ground line across adjacent screens. This demo creates the same CSS scene on each monitor, but because each device has its own viewport dimensions, exact panoramic scenery matching is approximate.
4. For the strongest panorama, all eight external monitors should use the same resolution and orientation. In a future refinement, replace the CSS campus with one authored panoramic background image and crop it by screen index.
5. Remove `&test=1` for the event.

## Important implementation note

The demo uses `public/mike.png` and `public/sulley.png` for Mike and Sulley, with Sulley chasing behind Mike, plus CSS-drawn scenery. Make sure you have the appropriate rights to display the character art publicly.
