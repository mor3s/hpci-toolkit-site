---
title: Get it running
description: Clone the toolkit, run the server, and flash your first board.
---

## What you need

- A computer with **Node.js v18+** ([nodejs.org](https://nodejs.org)).
- One or more **ESP32 boards** (the build targets the ESP32-WROOM-32).
- The **Arduino IDE** with ESP32 board support installed.
- Sensors and an RGB LED — see *Supported hardware* for what works out of the box.

## Run the server

Clone the repository, install dependencies, and start the server:

```bash
git clone https://github.com/mor3s/hpci-toolkit.git
cd hpci-toolkit/plant-server
npm install
node server.js
```

You'll see `listening on http://localhost:3000`. Open that address in a browser. The database, `plants.db`, is created automatically on first run.

To reach the app from a **phone**, put the phone on the same network as the computer and open `http://<computer-ip>:3000`. For a real workshop you would instead run the server on a Raspberry Pi that *is* the network — see *Run a workshop*.

## Flash a board

Open `firmware/hpci_device/hpci_device.ino` in the Arduino IDE. Near the top of the file, set three values:

- **WiFi name and password** — the network the board joins (the same one the server is on).
- **Server address** — for example `http://192.168.1.50:3000`, using your computer's IP.
- **Device id** — a unique name for this board, for example `esp32-basil`.

Set the board to **ESP32 Dev Module**, the baud rate to 115200, select the serial port, and upload. The same firmware runs on every board — a board does not know what is plugged into it until the server tells it, which is the purpose of setup.