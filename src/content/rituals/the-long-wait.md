---
title: The Long Wait
author:
  name: Nour Boulahcen
summary: A ritual with no sensors and no lights — only tending, waiting, and noticing.
context: general
tags: [no-hardware, tend, attend, slow]
date: 2026-07-26
definition:
  name: The Long Wait
  start: s0
  steps:
    s0: { type: say, text: "This one asks nothing of the machine.", next: s1 }
    s1: { type: tend, text: "Move the plant to where the light falls, then confirm.", next: s2 }
    s2: { type: wait, duration_ms: 60000, next: s3 }
    s3: { type: attend, text: "Look for a full minute. Write down one thing you had not seen before.", open: true, next: s4 }
    s4: { type: tend, text: "Turn the pot a quarter, then confirm.", next: s5 }
    s5: { type: attend, text: "Does the plant hold itself differently now?", next: s6 }
    s6: { type: end }
---

The toolkit's quietest ritual, and a deliberate demonstration that a ritual need not
involve any sensing at all. No device is bound; every step runs through the interface and
the person's own hands and attention. It alternates tending and attending — a small act,
a long look, another act, another look — with a full minute of waiting in the middle. What
it composes is not data but a discipline of noticing, and its record is whatever the person
chooses to write down.