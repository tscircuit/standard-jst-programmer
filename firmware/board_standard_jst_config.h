#pragma once
// Discrete RP2040: GPIO numbers, not QFN pad numbers.
#define PROBE_IO_RAW
#define PROBE_SM 0
#define PROBE_PIN_OFFSET 2
#define PROBE_PIN_SWCLK (PROBE_PIN_OFFSET + 0)
#define PROBE_PIN_SWDIO (PROBE_PIN_OFFSET + 1)
#define PROBE_PIN_RESET 1
// GPIO1 is open-drain; the target must provide the reset pull-up.
// Upstream compiles CDC unconditionally. Keep it on unconnected RP2040 pins;
// no UART signal is routed to the three-pin JST connector.
#define PROBE_CDC_UART
#define PROBE_UART_TX 4
#define PROBE_UART_RX 5
#define PROBE_UART_INTERFACE uart1
#define PROBE_UART_BAUDRATE 115200
#define PROBE_PRODUCT_STRING "Standard JST SWD (CMSIS-DAP)"

// GPIO25 drives the addressable RGB through a 5 V buffer.
