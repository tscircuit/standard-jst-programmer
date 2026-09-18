#pragma once
// Waveshare RP2040-Zero: GPIO numbers (not physical module-pad numbers).
#define PROBE_IO_RAW
#define PROBE_SM 0
#define PROBE_PIN_OFFSET 2
#define PROBE_PIN_SWCLK (PROBE_PIN_OFFSET + 0)
#define PROBE_PIN_SWDIO (PROBE_PIN_OFFSET + 1)
#define PROBE_PIN_RESET 1
// No UART: all five JST positions are dedicated to SWD, reset and power.
#define PROBE_PRODUCT_STRING "Standard JST SWD (CMSIS-DAP)"
