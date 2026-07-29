---
title: Extending the toolkit
description: The points at which the toolkit is designed to be adapted, repurposed, and reused.
---

The toolkit is built to be adapted, and the applications that demonstrate this — a tabletop game and a woodland-regeneration field system — reach very different ends by changing surprisingly little, because each works with the extension points below rather than against the engine. An adaptation that stays within these points tends to remain small.

Adding a sensor is a change to `catalog.js`. Reusing an existing `source`, such as `adc`, is catalog-only; a new `source` also needs a read-branch in the firmware. A sensor's `source` describes how the firmware reads it, and its `pin_kind` describes how the allocator assigns pins (`adc`, `ads_channel`, `i2c`, or `rgb`). The pin pools live in `setup.js`: ADC1-only pins 32, 33, 34, 35, 36, 39; outputs 25, 26, 27, 16, 17, 18, 19, 23; and I2C on 21 and 22.

Adding an output is an entry in `OUTPUT_CATALOG` in `catalog.js` plus a firmware branch for its `type`. Adding a ritual step type is more involved, touching three places that must stay in step: a `case` in `rituals-engine.js` for its behaviour, rendering and compilation in `builder.js`, and relationship encoding in `rituals.js` for the transcript, diagram, and swimlane; the simplest path is to template a new step off `say`. Reskinning is a matter of the design tokens at the top of `style.css`, and rewording is a matter of the plain strings in `public/*.js` and `index.html`. Changing the board means keeping the pin pools in `setup.js` and the firmware in sync.