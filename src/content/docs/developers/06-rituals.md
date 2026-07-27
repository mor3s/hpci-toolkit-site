---
title: The ritual system
description: The definition format, step types, the engine, the event diary, the lock contract, and the builder.
---

A ritual is composed in the builder in terms of plants, then compiled to a device-based definition the engine runs. Understanding both forms is necessary to extend the system.

## Definition format

A definition is JSON: `{ name, devices, start, steps }`. The `devices` map binds an alias such as `d1` to `{device_id, role}`, where the role is `read` or `write` (write implies read); steps reference aliases, which the engine resolves through `realDevice`. The `start` field names the first step, and `steps` is an id-to-step map in which steps point to their successors by id — `next`, or `then`/`else` for a sense, or `answer_routes` for a branching ask. Because the builder composes in terms of plants, the plant and its chosen sensor or output are resolved to a device at build time, so the stored definition is device-based and the engine needs no plant-awareness.

## Step types

The engine's `runStep` handles eight types. **say** shows a message and lingers about four seconds before advancing. **ask** posts a question: in choice mode it presents buttons that may route per answer or all to `next`, with an optional timeout; in open mode (`open:true`) it presents a text field and a single `next`, since free-text answers cannot branch. **wait** sleeps for `duration_ms`. **act** sets an output's desired colour. **sense** reads the latest reading, compares it via `op` (`<`, `>`, `=`) against `value`, and branches `then` or `else`, with a self-loop that paces rechecks to the sensor's interval. **tend** posts a confirmation prompt and waits, logging `tend` then `tend_confirmed`. **attend** posts a prompt — a done button, or a text field if `open:true` — and waits, logging `attend` then `attend_noticed`. **end** marks the run done.

## The engine

`makeEngine(db)` returns `{ tick }`, and the server calls `tick()` every second. Each tick loads all running instances and, for each in isolation, reads it fresh from the database, computes whether a linger has elapsed, skips sleeping instances except `ask` (which must be polled to catch answers), runs the current step, and advances if the step returned a next id. Because nothing important is held in memory, a server restart resumes running rituals.

## The event diary and relationships

Every step logs to `ritual_events`. The invitation events for tend and attend are machine→human only; the plant is touched at confirmation, where `tend_confirmed` reads as human→plant then human→machine, and `attend_noticed` as plant→human then human→machine. Each human–plant interaction is therefore recorded once, at the moment it actually happens, rather than doubled between request and fulfilment.

## The lock contract

Starting a ritual claims all its write devices all-or-nothing, rolling back to a 409 if any is already held; stopping or reaching `end` releases them. Read devices are never locked, and a device shared through an environment is read-only within rituals, since it cannot be locked by one plant's ritual.

## Builder: validate then compile

The builder edits a friendly draft and, on save, validates in three tiers — dead-end pointers or an unreachable end; a cycle of only single-exit steps; and behavioural non-termination, left to the stop button — then compiles to the engine format, turning stable draft ids into `s0…sN`, minutes into milliseconds, hex into `{r,g,b}`, and each plant-and-sensor choice into a device alias.