#pragma once
#include <stdint.h>
void status_monitor_init(void);
void status_monitor_tick(void);
void status_monitor_dap(const uint8_t *request, const uint8_t *response);
