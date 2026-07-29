---
title: Overview
description: What the HPCI Toolkit is for a developer adapting it, and the commitments that shape its design.
---

The HPCI Toolkit lets workshop participants build small systems around living plants — naming them, sensing their signals, driving lights, and composing rituals of care — entirely from a phone, with no code. This reference describes the toolkit as built: its architecture, data model, API, ritual system, firmware, and web application, together with the reasoning behind them. It is written for the developer who intends not merely to run the toolkit but to adapt it, as the Veyra and Ritual Grove applications each do.

Four commitments shape the system, and understanding them is the fastest route to modifying it without working against its grain.

The first is that data is organised around the plant. A plant is named, devices attach to it, and its readings are gathered on its own page; the machine is treated as the means by which a plant is sensed rather than as the subject of interest. The second is that participants write no code: all configuration happens through the web application, and hardware self-configures from the server. The third is that the parts are decoupled by a database — devices and phones never address one another directly, but are each clients of one small server that holds all state, which keeps the system robust on poor networks and simple to reason about. The fourth is that relationships are made legible: every ritual step enacts a directed relationship between the human, the plant, and the machine, and these are tagged, recorded, and visualised, because the relationships are the research subject rather than a by-product of it.

Anyone extending the toolkit should hold these four in view. Most of the design decisions documented later follow from them, and an adaptation that respects them tends to be small, while one that fights them tends to require rewriting the engine.