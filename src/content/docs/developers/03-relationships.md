---
title: Agents and relationships
description: The three agents, the six relationships each ritual step enacts, and how they are recorded.
---

The conceptual core, expressed in the system's own terms. There are three agents, each named: the *human* (the user, by their login name), the *plant* (a plant or environment, named by the user), and the *machine* (a device by its nickname, or "UI" — the interface itself). Every ritual step enacts a directed relationship between two of these agents.

| step | relationship | in the system |
|---|---|---|
| **say** | machine → human | the interface shows a message |
| **ask** | human → machine | the human answers (choice or open text) |
| **sense** | plant → machine, or human → machine | a device reads the plant, or reads the human |
| **act** | machine → plant, or machine → human | a device drives a light on the plant, or toward the human |
| **tend** | human → plant | the human is asked to act on the plant, and confirms |
| **attend** | plant → human | the human is asked to notice the plant, and reports |

Two of the relationships cannot be sensed. No wire runs between a human and a plant, so **tend** and **attend** are invited through the interface and evidenced by the human's response. A tend resolves into three legs — the interface instructs the human, the human acts on the plant, the human confirms to the interface — and an attend likewise: instruct, perceive, report. The loop opens and closes at the interface while the human–plant relationship happens in the middle, in the world. Both always require a response, because the response is what enacts and records the relationship; without one, a tend or attend would be indistinguishable from a `say`.

Target and medium matter for sense and act. A device attaches to a plant, an environment, or the human (its `attachments.target_type`), so a sense or act targets whichever pole its device is attached to, and the relationship it enacts follows from that target — plant→machine and machine→plant, or human→machine and machine→human. These hardware human–machine relationships are distinct from **say** and **ask**, which run in the same directions but are mediated by the interface rather than a device; the transcript and swimlane tell them apart by the machine end's name, a device nickname versus "UI". A compiled step carries a `target` field so the views render the correct poles.

The human is always a participant, present in every ritual through the interface, and therefore always shown in the builder's participant list rather than opted in. On the event side, all of this derives from a single function, `eventRelationships(event)` in `rituals.js`, which is the one source of truth for what relationship an event enacts — so the transcript, diagram, and swimlane cannot drift apart.