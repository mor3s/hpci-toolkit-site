---
title: Make it your own
description: Reskin the interface, change the wording, add a ritual step type, or change the board.
---

Beyond sensors, four kinds of change let you fit the toolkit to your own context.

**Reskin the interface.** The whole look lives in design tokens at the top of `plant-server/public/style.css` — colours (`--ink`, `--paper`, `--moss`, `--clay`, `--bark`), fonts (`--serif`, `--sans`, `--mono`), and a spacing scale. Change those few variables and the entire app re-skins.

**Change the wording.** All participant-facing text is plain strings in the `public/*.js` files and `index.html` — the catalog labels, step descriptions, and prompts. Edit them in place and speak to your audience.

**Add a ritual step type.** Adding a step touches three places: a `case` in `rituals-engine.js` for how it behaves, its form and compilation in `builder.js`, and its relationship encoding in `rituals.js` so the transcript, diagram, and swimlane show it correctly. Use the simple `say` step as a template — it shows the full path from builder form to engine behaviour to display.

**Change the board.** The pin pools in `plant-server/public/setup.js` (`ADC_POOL`, `ADS_POOL`, `OUTPUT_POOL`) describe the ESP32's usable pins. To adapt to a different board, change these *and* the firmware to match — they must agree on which pins do what.