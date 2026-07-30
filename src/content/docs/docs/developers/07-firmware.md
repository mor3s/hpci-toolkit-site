---
title: The firmware
description: One config-driven sketch for every board — analog and digital inputs, and the full range of outputs.
---

A single sketch, `hpci_device.ino`, serves every board. The settings at the top of the file are the WiFi SSID and password, the server address, and the device id.

On boot the device starts I2C (SDA 21, SCL 22), attempts to initialise the BME680 (0x77) and ADS1115 (0x48) — setting `bmeReady` and `adsReady` so the same binary runs on boards with different hardware — connects to WiFi, fetches its config, and prepares its pins: PWM for RGB outputs, `pinMode` for single-pin on/off outputs, and attached servos via `ESP32Servo`.

Inputs are read in one of two styles, and the distinction matters. **Level inputs** — `adc` via `analogRead`, `ads1115` as a differential millivolt reading, and `i2c`/BME as four named readings — are sampled on each input's `interval_ms` and batch-posted. **Digital event inputs** — `source: "digital"`, such as a button or a sound-trigger — are watched on every pass of the loop and posted the instant the pin changes, edge-detected, with a periodic heartbeat so a missed edge self-corrects. This is why a quick button press is never lost: digital inputs are event-driven rather than clock-sampled, and one `digital` branch serves any on/off input.

Outputs are driven about once a second: the device fetches the desired outputs and drives each by its `type`. An `rgb` output takes three PWM channels from `{r,g,b}`; `led`, `buzzer`, and `pump` are single pins driven HIGH or LOW, where the app sends white for on and black for off; a `servo` takes an `{angle}` through the servo library; and a `speaker` takes a `{freq}` through `tone()`, with 0 meaning silent. Each output posts its reported state back. Because the desired value is arbitrary JSON, different output types carry different shapes — `{r,g,b}`, `{angle}`, `{freq}` — over the same channel.

Adding a new sensor `source`, or a new output `type`, means adding a branch here to match a catalog entry — see the extension points page.