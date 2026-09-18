// Pico SDK board definition for the discrete RP2040 programmer.
// Only preprocessor directives: this header is also included by assembler.
#ifndef _BOARDS_STANDARD_JST_PROGRAMMER_H
#define _BOARDS_STANDARD_JST_PROGRAMMER_H
pico_board_cmake_set(PICO_PLATFORM, rp2040)
#define STANDARD_JST_PROGRAMMER 1
#define PICO_DEFAULT_LED_PIN 25
#define PICO_DEFAULT_UART 1
#define PICO_DEFAULT_UART_TX_PIN 4
#define PICO_DEFAULT_UART_RX_PIN 5
// W25Q16JV: 2 MiB, standard Winbond quad-read second-stage bootloader.
#define PICO_BOOT_STAGE2_CHOOSE_W25Q080 1
#define PICO_FLASH_SPI_CLKDIV 4
pico_board_cmake_set_default(PICO_FLASH_SIZE_BYTES, (2 * 1024 * 1024))
#define PICO_FLASH_SIZE_BYTES (2 * 1024 * 1024)
#define PICO_RP2040_B0_SUPPORTED 0
#endif
