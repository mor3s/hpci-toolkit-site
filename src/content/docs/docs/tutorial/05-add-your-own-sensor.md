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

## Add an output

Outputs live in `OUTPUT_CATALOG`. The RGB LED is `type: "rgb"`, `pin_kind: "rgb"`, on three PWM pins. A new *kind* of output — a relay, say — needs a new `type` plus a firmware branch that drives it, following the same two-halves rule. Output pins come from the pool 25, 26, 27, 16, 17, 18, 19, 23, which are PWM-capable and clear of the I2C pins.