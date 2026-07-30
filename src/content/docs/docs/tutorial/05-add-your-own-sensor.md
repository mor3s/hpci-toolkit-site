---
title: Add your own sensor
description: Extend the catalog — the easy catalog-only case, multi-reading I2C sensors, and the case that needs new firmware.
---

Adding a sensor is the heart of adapting the toolkit. Start with the easy case, which is catalog-only, then the case that needs new firmware.

## The shape of a catalog entry

Open `plant-server/catalog.js`. The real soil sensor entry looks like this:

```js
{
  id: "soil_capacitive",               // unique key
  label: "Soil moisture (capacitive)", // shown in the dropdown
  source: "adc",                        // HOW the firmware reads it
  pin_kind: "adc",                      // HOW the app allocates a pin
  default_name: "soil",                 // suggested name on add
  unit: "raw",                          // informational
  range: [0, 4095],                     // informational
  interval_ms: 5000,                    // how often to read (ms)
  instructions: "… GPIO {pin} …"        // wiring text; {pin} is filled in
}
```

Two fields do the real work. `source` tells the *firmware* how to read the sensor: `adc` for an analog pin, `i2c` for a chip on the I2C bus, `ads1115` for the external ADC. `pin_kind` tells the *app's allocator* what to assign: `adc` for one ADC pin, `ads_channel` for an ADS differential pair, `i2c` for nothing (it shares the bus), `rgb` for three output pins.

## Easy case — another analog sensor, no firmware change

A light sensor (LDR) giving an analog voltage is the same *kind* of reading as the soil sensor, so it reuses `source: "adc"` and needs no firmware change at all. Add an entry:

```js
{
  id: "ldr_light",
  label: "Light level (LDR)",
  source: "adc",
  pin_kind: "adc",
  default_name: "light",
  unit: "raw",
  range: [0, 4095],
  interval_ms: 3000,
  instructions: "Wire the LDR divider output to GPIO {pin}, plus 3V3 and GND."
}
```

Restart the server, refresh the app, and "Light level (LDR)" appears in Setup — pin-allocated, wiring-instructed, and graphed. Any analog sensor works this way, catalog-only.

## Multi-reading I2C sensor

An I2C sensor shares the bus, so no pin is allocated, and it can yield several named readings through a `channels` array — one "add", many readings:

```js
{
  id: "bme680",
  label: "Air & climate (BME680)",
  source: "i2c",
  pin_kind: "i2c",
  address: "0x77",
  default_name: "air",
  channels: [
    { suffix: "temperature", unit: "C",    range: [0, 50] },
    { suffix: "humidity",    unit: "%",    range: [0, 100] },
    { suffix: "pressure",    unit: "hPa",  range: [950, 1050] },
    { suffix: "gas",         unit: "kOhm", range: [0, 500] }
  ],
  interval_ms: 30000,
  instructions: "Connect to the I2C rail (SDA→21, SCL→22, plus 3V3 and GND)."
}
```

Its readings are named `air.temperature`, `air.humidity`, and so on.

## Harder case — a sensor that needs new firmware

If your sensor is read in a *new way* — a new I2C chip with its own library, say — add a new `source` and teach the firmware to handle it. Two steps.

First, a catalog entry with a new `source`:

```js
{
  id: "lux_bh1750",
  label: "Light (BH1750 lux)",
  source: "bh1750",                // a NEW source name
  pin_kind: "i2c",                 // on the bus, no pin allocated
  address: "0x23",
  default_name: "lux",
  interval_ms: 5000,
  instructions: "Connect to the I2C rail (SDA→21, SCL→22, plus 3V3 and GND)."
}
```

Second, teach the firmware. In `hpci_device.ino`, find where it reads each input by its `source` (branches such as "if source is `adc`, `analogRead`…") and add a branch:

```cpp
else if (source == "bh1750") {
    float lux = bh1750.readLightLevel();   // using the sensor's library
    addReading(name, lux);                 // post under the sensor's name
}
```

Include the library and initialise it in `setup()`, mirroring how the BME680 is set up. The rule: the catalog entry and the firmware `source` handler are two halves of one addition. Match the `source` string in both and they connect.

## Add a digital (on/off) input

A button, PIR, reed switch, or touch pad is an on/off *event*, not a level, so it uses `source: "digital"` — and because the firmware already has one `digital` branch, adding any such input is catalog-only:

```js
{
  id: "pir_motion",
  label: "Motion (PIR)",
  source: "digital",
  pin_kind: "adc",              // digital inputs draw from the same pin pool
  default_name: "motion",
  interval_ms: 2000,            // the heartbeat; edges post immediately regardless
  instructions: "Signal to GPIO {pin}, plus 3V3 and GND."
}
```

It posts the instant the pin changes, with `interval_ms` acting only as a self-correcting heartbeat. No firmware change is needed — the one digital branch handles it.

## Add an output (actuator)

Outputs live in `OUTPUT_CATALOG`, and there are two pin shapes: `pin_kind: "rgb"` (three PWM pins, as the RGB LED uses) and `pin_kind: "single_out"` (one pin, as the LED, buzzer, servo, and speaker use). A new *kind* of output needs a `type`, a `pin_kind`, and a firmware branch that drives it — the same two-halves rule as sensors, matched by the `type` string. Output pins come from the pool 25, 26, 27, 16, 17, 18, 19, 23 (PWM-capable, clear of the I2C pins).

The value an output carries is arbitrary JSON, so each type carries what it needs: RGB `{r,g,b}`, a servo `{angle}`, a speaker `{freq}`, on/off outputs white or black. When the value isn't a colour, three places learn its shape — the firmware branch that drives the pin, the device-page control in `device.js` (`outputControlFor`), and the ritual builder's `act` block in `builder.js`. Each is a small branch; template off the servo or speaker.

A note on the speaker: the ESP32 can't set a plain speaker's volume in software — a digital pin is on or off — so the toolkit controls *pitch* via `tone()`, and *volume* is a hardware matter: a series resistor for a fixed lower volume, or a series potentiometer for an adjustable knob. No code, just wiring.