---
title: Agents and relationships
description: The three agents, the six relationships each ritual step enacts, and how they are recorded.
---

The conceptual core, expressed in the system's own terms. There are three agents, each named: the *human* (the user, by their login name), the *plant* (a plant or environment, named by the user), and the *machine* (a device by its nickname, or "UI" — the interface itself). Every ritual step enacts a directed relationship between two of these agents.

| step | relationship | in the system |
|---|---|---|
| **say** | machine → human | the interface shows a message |
| **ask** | human → machine | the human answers (choice or open text) |
| **sense** | plant → machine, or human → machine | a device reads the plant, or reads the human (button, dial, wearable) |
| **act** | machine → plant, or machine → human | a device drives a light on the plant, or a light or buzzer toward the human |
| **tend** | human → plant | the human is asked to act on the plant, and confirms |
| **attend** | plant → human | the human is asked to notice the plant, and reports |

Two of the relationships cannot be sensed. No wire runs between a human and a plant, so **tend** and **attend** are invited through the interface and evidenced by the human's response. A tend resolves into three legs — the interface instructs the human, the human acts on the plant, the human confirms to the interface — and an attend likewise: instruct, perceive, report. The loop opens and closes at the interface while the human–plant relationship happens in the middle, in the world. Both always require a response, because the response is what enacts and records the relationship; without one, a tend or attend would be indistinguishable from a `say`.

## Target and medium

A device attaches to a plant, an environment, or the human (its `attachments.target_type`), so a sense or act targets whichever pole its device is attached to. This is the point at which the three agents are genuinely symmetric: the human is not only the reader of the interface but a pole that can be sensed and acted upon in hardware, exactly as a plant is. A button or dial the person operates is a human → machine sense; a light or buzzer aimed at them is a machine → human act. The relationship a sense or act enacts therefore follows from its target — plant→machine and machine→plant, or human→machine and machine→human.

These hardware human–machine relationships are distinct from **say** and **ask**, which run in the same directions but are mediated by the interface rather than a device; the transcript and swimlane tell them apart by the machine end's name, a device nickname versus "UI". A compiled step carries a `target` field (`plant` or `human`) so the views render the correct poles.

## The human is always a participant

Every ritual involves the human through the interface — say, ask, tend, and attend all pass through it — so the human is a permanent presence rather than an optional one, shown in the builder's participant list without being opted in, and any devices attached to the human carry read and write roles just as a plant's do. Only **tend** and **attend** are plant-only targets, since they *are* the human–plant relationships; sense and act may target the human, but tending or attending to oneself is not part of the model.

On the event side, all of this derives from a single function, `eventRelationships(event)` in `rituals.js`, which is the one source of truth for what relationship an event enacts — so the transcript, diagram, and swimlane cannot drift apart.