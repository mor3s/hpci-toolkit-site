---
title: Limitations and gotchas
description: Known constraints and the traps most likely to cost time.
---

- **`CREATE TABLE IF NOT EXISTS` will not add columns.** Migrate with `ALTER TABLE` or rebuild the database.
- **Shared global scope, no build step.** Two files must never define the same function name — the last loaded wins. Output that is wrong with no error, or a file that looks right while the browser does not, usually means a duplicate function (grep every file) or cached JavaScript (hard-refresh).
- **p5.js claims common globals** such as `line`, `text`, `map`, and `width`. Prefix your own helpers, for example `eventLine`.
- **DOM values are strings.** Compare `Number(x) === id`, not `===` against database numbers.
- **Relationship encoding is unified on the event side but not the definition side.** The transcript and swimlane both derive from `eventRelationships(event)` and cannot drift, but the diagram (`relationText`) and preview (`previewChain`) still encode the step-to-relationship mapping separately. Adding a step type or changing a relationship means updating `eventRelationships` and those two definition-side functions; unifying them into a parallel `stepRelationships(step)` is a sensible future step.
- **The say/tend/attend linger** relies on `wait_until` being 0 on entry.
- **sense reads only the latest reading.** If a sensor has never reported, the value is absent and the comparison takes `else`.
- **Restart Node after server edits; hard-refresh after app edits.** Check the dev console first when something is off.