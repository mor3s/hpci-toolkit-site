---
title: Reading the Weather
author:
  name: Nour Boulahcen
summary: Ask what the sky is doing, then let the plant's own readings confirm or complicate the answer.
context: general
tags: [branching, ask, multi-sensor]
date: 2026-07-27
definition:
  name: Reading the Weather
  devices:
    d1: { device_id: esp32-demo, role: write }
  start: s0
  steps:
    s0: { type: say, text: "Before the reading, look up.", next: s1 }
    s1:
      type: ask
      text: "What is the sky doing?"
      options: [clear, clouding, raining]
      answer_routes: { clear: s2, clouding: s3, raining: s3 }
    s2: { type: sense, sensor: light, op: ">", value: 2000, device: d1, target: plant, then: s4, else: s5 }
    s3: { type: sense, sensor: pressure, op: "<", value: 1000, device: d1, target: plant, then: s5, else: s4 }
    s4: { type: act, output: rgb, color: { r: 240, g: 210, b: 90 }, device: d1, target: plant, next: s6 }
    s5: { type: act, output: rgb, color: { r: 70, g: 110, b: 200 }, device: d1, target: plant, next: s6 }
    s6: { type: attend, text: "Does the plant's answer match the sky's?", open: true, next: s7 }
    s7: { type: end }
---

A ritual about two kinds of knowing held against each other. It begins by asking the
person for a human reading of the sky, then routes to the plant's own evidence — light
where the sky was called clear, pressure where it was called clouding or raining. The
plant answers in warm gold or cool blue, and the closing step invites the person to say,
in their own words, whether the two accounts agree. The point is not to settle which is
right but to notice where a felt impression and a sensed value diverge.