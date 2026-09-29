#pragma once
#include "pico/stdlib.h"
#include "hardware/sync.h"
#include <limits.h>
typedef enum { GPIO_DIR_OUT, GPIO_DIR_IN } gpio_dir_t;
typedef enum { GPIO_STATE_LOW, GPIO_STATE_HIGH } gpio_state_t;
// Optional upstream direction/enable signals are absent on this PCB.
static inline int hal_gpio_init(unsigned pin) {
  if (pin != UINT_MAX) { gpio_init(pin); gpio_disable_pulls(pin); gpio_set_drive_strength(pin, GPIO_DRIVE_STRENGTH_2MA); }
  return 0;
}
static inline int hal_gpio_dir(unsigned pin, gpio_dir_t dir) {
  if (pin != UINT_MAX) gpio_set_dir(pin, dir == GPIO_DIR_OUT);
  return 0;
}
static inline int hal_gpio_set(unsigned pin, gpio_state_t state) {
  if (pin != UINT_MAX) gpio_put(pin, state);
  return 0;
}
static inline gpio_state_t hal_gpio_get(unsigned pin) { return gpio_get(pin) ? GPIO_STATE_HIGH : GPIO_STATE_LOW; }
static inline int hal_gpio_cfg(unsigned pin, gpio_dir_t dir, gpio_state_t state) {
  hal_gpio_set(pin,state); return hal_gpio_dir(pin,dir);
}
static inline void hal_delay_us(unsigned us) { busy_wait_us_32(us); }
static inline void hal_delay_ms(unsigned ms) { busy_wait_us_32(ms * 1000); }
#define HAL_ENTER_CRITICAL() uint32_t irq_state = save_and_disable_interrupts()
#define HAL_EXIT_CRITICAL() restore_interrupts(irq_state)
