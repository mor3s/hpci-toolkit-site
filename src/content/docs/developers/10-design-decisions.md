---
title: Design decisions
description: The reasoning behind the toolkit's main architectural choices.
---

Several of the toolkit's choices are easier to work with once their reasoning is clear.

Data is organised around the plant rather than the device so that the toolkit is about the living thing and its care rather than the electronics, which is the research subject. Because a plant's data is computed from its current attachments, moving a device or reassigning an environment re-sources that data automatically.

State is held in a shared database rather than passed peer-to-peer, which avoids device discovery and addressing, survives networks that isolate clients, keeps the server authoritative, and lets a rebooted device resume by re-fetching. The firmware is config-driven so that one sketch serves every board with no per-board code and no reflashing mid-workshop, and the `bmeReady`/`adsReady` flags let a single binary serve varied hardware. The write-lock exists because a shared light with several controllers would flicker; an atomic lock gives one controller at a time, while reading stays free because it is harmless.

The six relationships are made explicit, and tend and attend are required to close through a human response, because the research concerns human–plant–machine relating; encoding each step as a directed relationship makes those relationships real and recordable rather than merely implied. Tend and attend touch the plant only at confirmation because the relationship only happens, and is only evidenced, when the human acts or perceives and then reports — so the plant appears once, at fulfilment, not twice. There is no build step because plain files that anyone can open, edit, and refresh are maximally hackable for the researchers, artists, and makers who adapt the toolkit; the cost, a shared global scope with no duplicate function names, is accepted for that readability. Rituals and runs are soft-deleted and kept private per user because they are research data.

> **Editorial note — resolve before publishing.** The source documentation frames this section's first point as "plant-centric: the plant is the primary entity," which conflicts with the equal-agents framing used in the concept section. The passage above has been narrowed to a data-organisation claim to remove the contradiction. Confirm which framing is canonical so the concept section and this page agree.