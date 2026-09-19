#include <assert.h>
#include "../firmware/status_math.h"
int main(void) {
 assert(target_current_ua(0) == 0);
 assert(target_current_ua(50) == 5000); // 5 mA target -> 0.5 mV shunt
 assert(target_current_ua(500) == 50000);
 assert(target_current_ua((uint16_t)-25) == -2500);
 assert(target_voltage_mv((1250 << 3) | 2) == 5000); // ignore conversion status bits
 assert(target_voltage_mv(825 << 3) == 3300);
 assert(target_power_uw(5000, 50000) == 250000);
 assert(target_power_uw(3300, -2500) == -8250);
 return 0;
}
