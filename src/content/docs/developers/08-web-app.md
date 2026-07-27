---
title: The web app
description: Plain JavaScript with no build step, and how its files fit together.
---

The web app is plain JavaScript with no build step. All files under `public/` share one global scope and are loaded in order by `index.html`, with `app.js` first.

The files divide the work as follows. `app.js` holds shared state, tabs, login, and relationship rendering. `plants.js` builds the plant home and plant pages, where data lives. `me.js` builds the "you" page — the human's attached devices and data, mirroring a plant page. `environments.js`, `devices.js`, and `device.js` handle groups, the device list, and a device's graph, light, and lock. `setup.js` provides the no-code setup and the pin allocator. `rituals.js` holds the rituals page, transcript, swimlane, preview, and prompt box, along with `eventRelationships`, the single source of truth for event relationships. `builder.js` is the visual builder.

Navigation is a two-tab home — Plants and Rituals, the two central acts — with Environments and Devices as secondary buttons, and sub-pages drilling in from a tab via `showView(id)`. Live updates come from pollers, each guarded to run only while its view is active: the prompt box every two seconds, the rituals page every three while open, an open transcript every two, the rituals badge every four, and the plant and device graphs every two. The theme is driven by design tokens at the top of `style.css` — colours, three type families, and a spacing scale — so reskinning is a matter of editing those tokens.