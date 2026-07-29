---
title: The firmware
description: One config-driven sketch for every board.
---

A single sketch, `hpci_device.ino`, serves every board. The settings at the top of the file are the WiFi SSID and password, the server address, and the device id.

On boot the device starts I2C (SDA 21, SCL 22), attempts to initialise the BME680 (0x77) and ADS1115 (0x48) — setting `bmeReady` and `adsReady` so the same binary runs on boards with different hardware — connects to WiFi, fetches its config, and attaches PWM for the RGB outputs.

In the loop, for each configured input it checks the input's `interval_ms` and reads if due, dispatching by `source`: `adc` uses `analogRead`, `ads1115` reads a differential millivolt value, and `i2c`/BME produces four named readings. Readings are batch-posted to `/readings`. About once a second the device fetches the desired outputs, drives the RGB PWM, and reports the applied state.

Adding a new sensor `source` means adding a branch to the read dispatch; see the extension points page.