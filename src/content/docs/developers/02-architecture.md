---
title: Architecture
description: Three processes and one source of truth — how the device, server, and web app relate.
---

The toolkit is three processes joined by a single source of truth, the database. The ESP32 devices and the phones never communicate directly. A device posts its readings and polls for instructions; a phone reads and writes through the same server. The server holds all state and is always authoritative.

ESP32 device(s) Server + SQLite Phone web app

- read sensors --POST--> Node + Express <--GET-- - plant pages
- post readings better-sqlite3 --data-> - live data
- poll config <--GET--- + the ritual engine - no-code setup
- poll outputs (tick() every 1s) <--PUT-- - ritual builder
- drive RGB, report - transcripts

The three parts live in three places in the repository. The firmware is a single config-driven Arduino sketch, `firmware/hpci_device/hpci_device.ino`, used for every board. The server is `plant-server/server.js` — Node with Express and better-sqlite3 — and holds all state, the REST API, the static web app, and the ritual engine. The web app is the plain multi-file JavaScript under `plant-server/public/`, with no build step, using p5.js for the live graph and Mermaid for the ritual diagram.

The model is pull-based. Devices ask the server what to do rather than being pushed to, which has a useful consequence: a device that reboots simply re-fetches its configuration and resumes, because nothing essential is held in its memory. The ritual engine runs on the same principle — its `tick()` executes once a second against state read fresh from the database — so a server restart resumes any running rituals rather than losing them.