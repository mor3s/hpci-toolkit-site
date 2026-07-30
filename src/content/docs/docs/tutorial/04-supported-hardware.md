---
title: Supported hardware
description: The sensors and outputs the toolkit offers out of the box.
---

These are the sensors defined in `CATALOG` and the outputs in `OUTPUT_CATALOG`, available without any code change.

## Sensors

| Sensor | How it's read (`source`) | Notes |
|---|---|---|
| Soil moisture (capacitive) | `adc` | one analog pin |
| Potentiometer (dial) | `adc` | one analog pin — a handy human input |
| Photoresistor (light) | `adc` | one analog pin, divider wiring |
| Water level | `adc` | one analog pin |
| Sound level (KY-038 A0) | `adc` | analog loudness — reads activity, not a clean level |
| Heartbeat (HW-487) | `adc` | analog pulse signal |
| Air & climate (BME680) | `i2c` | one sensor, four readings (temperature, humidity, pressure, gas) |
| Plant bioelectricity (ADS1115) | `ads1115` | differential pair, clipped to a leaf |
| Button (press) | `digital` | on/off input; posts on change |
| Loud-sound trigger (KY-038 D0) | `digital` | fires when sound crosses the module's threshold |

## Outputs

| Output | `type` | Notes |
|---|---|---|
| RGB LED | `rgb` | three PWM pins, a colour |
| LED (single) | `led` | one pin, on/off |
| Buzzer | `buzzer` | one pin, on/off |
| Water pump | `pump` | one pin, on/off (needs a driver, and care) |
| Servo (SM-S2309S / SG90) | `servo` | one pin, an angle 0–180° (needs `ESP32Servo`) |
| Speaker (tone) | `speaker` | one pin, a frequency in Hz via `tone()`; volume is set in hardware |

## Two input styles

Analog sensors (`adc`, `ads1115`, `i2c`) are *levels* — the board samples them on each sensor's `interval_ms`. Digital sensors (`source: "digital"`, such as the button or the sound-trigger) are *events* — the board watches them continuously and posts the instant they change, plus a periodic heartbeat, so a quick press is never missed. Any digital on/off input you add later — a PIR, a reed switch, a touch pad — reuses the one `digital` firmware branch.

## Output values beyond colour

An output's desired value is arbitrary JSON, so different outputs carry different values: RGB carries `{r,g,b}`, a servo carries `{angle}`, a speaker carries `{freq}`, and on/off outputs (LED, buzzer, pump) are driven as white for on and black for off. The device page and the ritual builder show the right control for each type — a colour picker, an angle slider, a frequency slider, or an on/off toggle.

## Pins

The app allocates from fixed pools: analog