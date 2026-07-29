---
title: Glossary
description: The core terms used across the toolkit and its documentation.
---

- **Agent / pole** — a human, plant, or machine: one of the three parties that relate.
- **Plant / environment** — a named living subject, or a named group of plants sharing a device.
- **Device (machine)** — a physical ESP32 by its nickname, or "UI" for the interface.
- **Attachment** — a device pointing at one target: a plant, environment, or human.
- **Config** — a device's `{inputs, outputs}`, produced by setup and obeyed by the firmware.
- **source / pin_kind** — how a sensor is read (firmware) / what slot it needs (allocator).
- **Write-lock (owner_id)** — exclusive control of a device's outputs.
- **Ritual / instance** — a definition (a state machine) / one run of it.
- **Step** — a node in a ritual: say, ask, wait, act, sense, tend, attend, or end.
- **Event** — one entry in a run's diary.
- **Prompt** — a question awaiting an answer.
- **Relationship** — the directed link between two agents that a step enacts.