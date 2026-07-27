---
title: HTTP API reference
description: The complete REST API. All bodies are JSON; the base URL is the server root.
---

All request and response bodies are JSON. The base URL is the server root.

## Health and catalog
- `GET /` — liveness.
- `GET /catalog` — the sensor catalog.
- `GET /output-catalog` — the output catalog.

## Users
- `POST /users` `{name}` → `{id, name}` (create-or-fetch, idempotent).
- `GET /users` — all users.
- `GET /users/:id/attached-devices` — devices attached to the human.
- `GET /users/:id/sensors` — sensor names across the human's attached devices.
- `GET /users/:id/readings?sensor=` — readings for one sensor across the human's devices.

## Plants
- `POST /plants` `{user_id, name, environment_id?}` → `{id, name}`.
- `GET /plants?user_id=` — the user's plants.
- `GET /plants/:id/devices` — devices attached to the plant (directly or via its environment).
- `GET /plants/:id/sensors` — distinct sensor names across the plant's devices.
- `GET /plants/:id/readings?sensor=` — readings for one sensor across the plant's devices.
- `PUT /plants/:id/environment` `{environment_id}` — assign to an environment (or null).

## Environments
- `POST /environments` `{user_id, name}` → `{id, name}`.
- `GET /environments?user_id=` — the user's environments.
- `GET /environments/:id/plants` — plants in the environment.
- `GET /environments/:id/devices` — devices attached to the environment.

## Devices
- `POST /devices/:id/attach` `{target_type, target_id}` — attach to a plant/environment/human (upsert; one target per device).
- `POST /devices/:id/detach` — remove the attachment.
- `POST /devices/:id/subscribe` `{user_id, nickname}` — follow under a nickname.
- `GET /users/:id/devices` — the user's subscribed devices (name = their nickname).
- `GET /devices/:id/sensors` — distinct sensor names this device has reported.
- `GET /devices/:id/config` — the device's config.
- `PUT /devices/:id/config` — save the config (the setup screen calls this).

## Readings
- `POST /readings` `{device_id, readings:[{name,value}]}` — batch insert (the ESP).
- `GET /readings/:device_id` — all readings for a device, oldest first.

## Outputs and the write-lock
- `PUT /devices/:id/outputs/:name/desired` `{user_id, color}` — set desired; **403** unless the caller holds the lock.
- `GET /devices/:id/outputs/desired` — the desired outputs (the ESP polls this).
- `PUT /devices/:id/outputs/:name/reported` `{r,g,b}` — the ESP reports what it applied.
- `GET /devices/:id/outputs/state` — desired plus reported per output.
- `POST /devices/:id/claim` `{user_id}` — take the lock; **409** if held (returns `held_by`).
- `POST /devices/:id/release` `{user_id}` — release (owner only).
- `GET /devices/:id/owner` — `{owner_id}` (null = free).

## Rituals (definitions)
- `POST /rituals` `{user_id, name, definition}` → `{id}`.
- `GET /rituals?user_id=&offset=&limit=` → `{rituals, hasMore}` (own, non-hidden, paginated).
- `POST /rituals/:id/hide` — soft delete.

## Rituals (running)
- `POST /rituals/:id/start` `{user_id}` — claims write-devices all-or-nothing, creates a run; **409** if a write-device is locked.
- `GET /instances?user_id=&offset=&limit=` → `{runs, hasMore}` (own runs, newest first).
- `GET /instances/:id` — one run's state.
- `GET /instances/:id/events` — the run's full event diary.
- `POST /instances/:id/stop` — mark done and release its locks.

## Prompts
- `GET /users/:id/prompts` — unanswered questions for the user whose instance is running.
- `POST /prompts/:id/answer` `{answer}` — record the answer; the engine picks it up next tick.

Pagination fetches `limit + 1` rows to set `hasMore` without a second query.