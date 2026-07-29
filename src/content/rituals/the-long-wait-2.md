---
title: "The Long Wait 2"
author:
  name: "Nour Boulahcen"
summary: "A ritual with no sensors and no lights — only tending, waiting, and noticing."
context: general
tags: []
date: 2026-07-29
definition: {"name":"Ask the Route","devices":{"d1":{"device_id":"esp32-demo","role":"write"}},"start":"s0","steps":{"s0":{"type":"say","text":"The plant will answer in light.","next":"s1"},"s1":{"type":"tend","text":"Give the plant a little water, then confirm.","next":"s2"},"s2":{"type":"sense","sensor":"soil","op":"<","value":1500,"device":"d1","target":"plant","then":"s3","else":"s4"},"s3":{"type":"act","output":"rgb","color":{"r":40,"g":200,"b":120},"device":"d1","target":"plant","next":"s5"},"s4":{"type":"act","output":"rgb","color":{"r":200,"g":60,"b":40},"device":"d1","target":"plant","next":"s5"},"s5":{"type":"attend","text":"Watch the colour, and describe what you notice.","next":"s6"},"s6":{"type":"end"}}}
---

The toolkit's quietest ritual, and a deliberate demonstration that a ritual need not
involve any sensing at all. No device is bound; every step runs through the interface and
the person's own hands and attention. It alternates tending and attending — a small act,
a long look, another act, another look — with a full minute of waiting in the middle. What
it composes is not data but a discipline of noticing, and its record is whatever the person
chooses to write down.
