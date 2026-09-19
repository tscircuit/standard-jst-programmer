#pragma once
#include <stdint.h>
// INA219 raw shunt register is signed, 10 uV/LSB; the shunt is 0.1 ohm.
static inline int32_t target_current_ua(uint16_t raw) { return (int32_t)(int16_t)raw * 100; }
static inline uint32_t target_voltage_mv(uint16_t raw) { return (raw >> 3) * 4; }
static inline int32_t target_power_uw(uint32_t mv, int32_t ua) { return (int32_t)((int64_t)mv * ua / 1000); }
