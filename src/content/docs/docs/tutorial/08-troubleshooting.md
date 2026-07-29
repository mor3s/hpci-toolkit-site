---
title: Troubleshooting
description: The problems most likely to come up in a session, and how to clear them.
---

- **Board connects but no data.** Check that the device id in the firmware matches the one you subscribed to, and that you *added a sensor in Setup* — a board with no config reads nothing. Watch the Serial Monitor at 115200 baud.
- **A sensor I added isn't in the dropdown.** Restart the server after editing `catalog.js` (Node reads it once at start), then hard-refresh the browser.
- **A new-`source` sensor shows but never reports.** The catalog entry exists but the firmware has no handler for that `source` — add the firmware branch.
- **The light won't respond.** Only the holder of the device's control lock can drive it — take control first. Check that the RGB wiring matches the pins shown.
- **A ritual won't save.** The builder validates before saving and lists the problems (a step pointing nowhere, a sense or act with no plant, and so on). Fix those and save again.
- **"No such column" after a schema change.** SQLite's `CREATE TABLE IF NOT EXISTS` will not alter an existing table — delete `plants.db` to rebuild, or run an `ALTER TABLE` migration.
- **"File is right but the browser is wrong."** Hard-refresh (Ctrl+Shift+R). If it persists, the browser cached old JS, or two files define the same function — grep every file for the name.