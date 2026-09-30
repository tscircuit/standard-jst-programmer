#pragma once
// Discrete RP2040: GPIO numbers, not QFN pad numbers.
#define PROBE_IO_RAW
#define PROBE_SM 0
#define PROBE_PIN_OFFSET 2
#define PROBE_PIN_SWCLK (PROBE_PIN_OFFSET + 0)
#define PROBE_PIN_SWDIO (PROBE_PIN_OFFSET + 1)
#define PROBE_PIN_RESET 1
// GPIO1 is open-drain; the target must provide the reset pull-up.
// UART1 is routed through 100 ohm resistors to J5: TX / GND / RX.
// USB CDC0 is UART; CDC1 is independent target-power telemetry.
#define PROBE_CDC_UART
#define PROBE_UART_TX 8
#define PROBE_UART_RX 9
#define PROBE_UART_INTERFACE uart1
#define PROBE_UART_BAUDRATE 115200
#define PROBE_PRODUCT_STRING "Standard JST SWD (CMSIS-DAP)"

// GPIO25 drives the addressable RGB through a 5 V buffer.
