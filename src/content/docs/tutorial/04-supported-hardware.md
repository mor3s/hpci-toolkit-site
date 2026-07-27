---
title: Supported hardware
description: The sensors and output the toolkit offers out of the box.
---

These are the sensors defined in `CATALOG` and the output defined in `OUTPUT_CATALOG`, available without any code change.

| Sensor | How it's read (`source`) | Notes |
|---|---|---|
| Soil moisture (capacitive) | `adc` | one analog pin |
| Potentiometer (dial) | `adc` | one analog pin — a handy human input |
| Air & climate (BME680) | `i2c` | one sensor, four readings (temperature, humidity, pressure, gas) |
| Plant bioelectricity (ADS1115) | `ads1115` | a differential pair, clipped to a leaf |

The single output is an **RGB LED**, driven on three PWM pins.

The app allocates pins from fixed pools: analog sensors use **ADC1 pins only** (32, 33, 34, 35, 36, 39), because the ESP32's ADC2 pins stop working once WiFi is on; outputs use 25, 26, 27, 16, 17, 18, 19, 23; and I2C sensors share the bus on pins 21 (SDA) and 22 (SCL) without taking a pin of their own.