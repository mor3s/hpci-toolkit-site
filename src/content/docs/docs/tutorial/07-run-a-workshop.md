---
title: Run a workshop
description: Run the server on a Raspberry Pi that is its own network, so you don't depend on venue WiFi.
---

For a workshop you do not want to depend on venue WiFi. Run the server on a Raspberry Pi that *is* the network.

1. Make the Pi a WiFi access point (for example, `nmcli device wifi hotspot`); it will sit at a fixed address such as `192.168.4.1`.
2. Run the server on the Pi, ideally on **port 80** so phones can type an address with no `:3000`.
3. Auto-start it on boot (with systemd or pm2) so it survives a reboot.
4. Point the firmware's server address at the Pi.
5. Pre-flight before participants arrive: confirm that phones load the app, that a board posts readings, and that a light responds.