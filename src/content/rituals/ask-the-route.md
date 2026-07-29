---
title: Ask the Route
author:
  name: Nour Boulahcen
summary: Before committing to a direction, put the choice to the plant and answer in light.
context: general
tags: [navigation, single-sensor, quick]
date: 2026-07-28
definition:
  name: Ask the Route
  devices:
    d1: { device_id: esp32-demo, role: write }
  start: s0
  steps:
    s0: { type: say, text: "The plant will answer in light.", next: s1 }
    s1: { type: tend, text: "Give the plant a little water, then confirm.", next: s2 }
    s2: { type: sense, sensor: soil, op: "<", value: 1500, device: d1, target: plant, then: s3, else: s4 }
    s3: { type: act, output: rgb, color: { r: 40, g: 200, b: 120 }, device: d1, target: plant, next: s5 }
    s4: { type: act, output: rgb, color: { r: 200, g: 60, b: 40 }, device: d1, target: plant, next: s5 }
    s5: { type: attend, text: "Watch the colour, and describe what you notice.", next: s6 }
    s6: { type: end }
---

A short ritual for a moment of choice. It first invites a small act of care — a
little water — then reads the plant's soil and answers in colour: green where the
soil is still damp, red where it has dried. The reading is not advice; it is the
plant's condition made visible at the moment a decision is being weighed. The
closing step asks the person to look, and to say what they saw, so the exchange
ends in attention rather than in a number.