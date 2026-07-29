---
title: Data model
description: The thirteen SQLite tables that hold all state.
---

State is held in SQLite, defined in `server.js`, across thirteen tables.

**Migration note.** `CREATE TABLE IF NOT EXISTS` creates a missing table but never alters an existing one. Adding a column requires an `ALTER TABLE … ADD COLUMN` on an existing `plants.db`, or deleting the database to rebuild it.

- **readings** — every sensor sample: `id`, `device_id`, `sensor_name`, `value`, `ts`.
- **users** — `id`, `name` (unique; no password — this is a workshop tool).
- **devices** — a physical board: `id` (text), `owner_id` (the write-lock holder; null = free).
- **subscriptions** — which user follows which device, under a nickname: `user_id`, `device_id`, `nickname`; primary key (user_id, device_id).
- **configs** — one config per device, as JSON: `device_id` (PK), `json`, `updated_at`. Written by setup, read by both the app and the ESP.
- **output_states** — desired versus reported per output: `device_id`, `output_name`, `desired` (JSON `{r,g,b}`), `reported`, `updated_at`; PK (device_id, output_name).
- **rituals** — a ritual *definition*: `id`, `name`, `definition` (JSON), `created_by`, `created_at`, `hidden` (1 = soft-deleted, kept for research).
- **ritual_instances** — a *run*: `id`, `ritual_id`, `started_by`, `status` (running/done/failed), `current` (step id), `wait_until` (the engine sleeps until this timestamp), `state` (JSON scratch — saved answers), `started_at`, `updated_at`, `status_text`.
- **prompts** — a question awaiting a human answer, created by ask and by tend/attend confirmations: `id`, `instance_id`, `step_id`, `started_by`, `text`, `options` (JSON array), `answer`, `kind`, `answered` (0/1), `created_at`, `open` (1 = free-text; added by migration).
- **ritual_events** — the complete ordered diary of a run: `id`, `instance_id`, `step_id`, `type`, `payload` (JSON, shape depends on type), `ts`. Both the research record and the source of the transcript and swimlane.
- **plants** — `id`, `name`, `environment_id` (optional; null = ungrouped), `created_by`, `created_at`.
- **environments** — a named group of plants: `id`, `name`, `created_by`, `created_at`.
- **attachments** — which device points at which target: `device_id` (PK — a device attaches to one target), `target_type` (`plant` | `environment` | `human`), `target_id`, `updated_at`. This one polymorphic table links devices to any of the three poles.

A user authors rituals and holds subscriptions; a plant optionally belongs to an environment; a device attaches to one plant, environment, or human; and a plant's data is the readings from devices attached to it or to its environment, computed live and never stored on the reading itself.