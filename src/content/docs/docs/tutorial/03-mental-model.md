---
title: The mental model
description: Five ideas that explain the whole system.
---

Five ideas are enough to understand the whole system.

**Data is organised around the plant.** You name plants, devices attach to them, and readings appear on the plant's page. The electronics are *how* a plant is sensed, not the thing you look at.

**Environments group plants.** An environment — "the windowsill", say — is a named group of plants. A device attached to an environment reaches *every* plant in it, so one shared climate sensor can serve many plants without being wired to each.

**The config is a contract.** When you add a sensor in Setup, the app writes a small description into the device's *config*. The board fetches that same config and obeys it. "Adding a sensor" is really "adding an entry to the config", which the board simply follows.

**The catalog is the menu.** The sensors you can add come from `catalog.js`, where each entry describes one kind of sensor. To offer a new sensor, you add an entry there.

**Three agents, six relationships.** Everything in a ritual is a relationship among three equal agents — the human, the plant, and the machine. Sensing is plant→machine, acting is machine→plant, saying is machine→human, asking is human→machine, tending is human→plant, and attending is plant→human. Making these visible is the toolkit's research purpose. A device can attach to the human as well as to a plant, so sense and act can also point at you — a button or dial you operate, or a light or buzzer aimed at you — through hardware, as distinct from say and ask, which reach you through the interface. You have a "you" page, reached from the identity bar, that mirrors a plant page, and you are always a participant in every ritual; only tend and attend are plant-only.