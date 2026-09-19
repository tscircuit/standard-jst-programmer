#include "status_monitor.h"
#include "status_math.h"
#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/i2c.h"
#include "hardware/pio.h"
#include "hardware/clocks.h"
#include "tusb.h"
#include "status_rgb.pio.h"

#define SENSOR_ADDR 0x40
#define SENSOR_BUS i2c1
#define RGB_PIN 25
static uint rgb_sm;
static bool sensor_ok;
static uint32_t last_poll, last_tick;
static volatile uint32_t last_activity, last_fault;
static volatile bool saw_activity, saw_fault;
static bool sent_header;
static uint32_t last_color = UINT32_MAX;

static bool write_reg(uint8_t reg, uint16_t value) {
    uint8_t bytes[] = {reg, value >> 8, value & 255};
    return i2c_write_timeout_us(SENSOR_BUS, SENSOR_ADDR, bytes, 3, false, 2000) == 3;
}
static bool read_reg(uint8_t reg, uint16_t *value) {
    uint8_t bytes[2];
    if (i2c_write_timeout_us(SENSOR_BUS, SENSOR_ADDR, &reg, 1, true, 2000) != 1 ||
        i2c_read_timeout_us(SENSOR_BUS, SENSOR_ADDR, bytes, 2, false, 2000) != 2) return false;
    *value = ((uint16_t)bytes[0] << 8) | bytes[1];
    return true;
}
static void rgb(uint8_t red, uint8_t green, uint8_t blue) {
    uint32_t grb = ((uint32_t)green << 16) | ((uint32_t)red << 8) | blue;
    if (grb == last_color) return;
    // Calls are separated by >= 10 ms, exceeding the LED's 200 us reset time.
    pio_sm_put_blocking(pio1, rgb_sm, grb << 8);
    last_color = grb;
}
void status_monitor_init(void) {
    uint offset = pio_add_program(pio1, &status_rgb_program);
    rgb_sm = pio_claim_unused_sm(pio1, true);
    pio_gpio_init(pio1, RGB_PIN);
    pio_sm_set_consecutive_pindirs(pio1, rgb_sm, RGB_PIN, 1, true);
    pio_sm_config c = status_rgb_program_get_default_config(offset);
    sm_config_set_sideset_pins(&c, RGB_PIN);
    sm_config_set_out_shift(&c, false, true, 24);
    sm_config_set_fifo_join(&c, PIO_FIFO_JOIN_TX);
    sm_config_set_clkdiv(&c, (float)clock_get_hz(clk_sys) / 10000000.0f);
    pio_sm_init(pio1, rgb_sm, offset, &c);
    pio_sm_set_enabled(pio1, rgb_sm, true);
    rgb(0, 0, 12);
    last_tick = time_us_32();
    i2c_init(SENSOR_BUS, 400000);
    gpio_set_function(18, GPIO_FUNC_I2C);
    gpio_set_function(19, GPIO_FUNC_I2C);
    // INA219: 16 V bus range, +/-40 mV shunt, 12-bit continuous bus/shunt.
    // Read shunt voltage directly: 10 uV/count / 0.1 ohm = 100 uA/count.
    sensor_ok = write_reg(0, 0x019f);
}
void status_monitor_dap(const uint8_t *request, const uint8_t *response) {
    uint8_t command = request[0];
    if (command == 0x05 || command == 0x06 || command == 0x7f) {
        last_activity = time_us_32();
        saw_activity = true;
        uint8_t ack = command == 0x05 ? response[2] : command == 0x06 ? response[3] : 0;
        // FAULT, protocol error, or mismatch; WAIT is normal flow control.
        if (ack & 0x1c) { last_fault = last_activity; saw_fault = true; }
    }
}
void status_monitor_tick(void) {
    static int32_t current_ua;
    static uint32_t voltage_mv;
    uint32_t now = time_us_32();
    if ((uint32_t)(now-last_tick) < 10000) return;
    last_tick = now;
    if ((uint32_t)(now - last_poll) >= 100000) {
        last_poll = now;
        uint16_t shunt, bus;
        if (!sensor_ok) sensor_ok = write_reg(0, 0x019f);
        sensor_ok = sensor_ok && read_reg(1, &shunt) && read_reg(2, &bus);
        if (sensor_ok) {
            current_ua = target_current_ua(shunt);
            voltage_mv = target_voltage_mv(bus);
        }
        if (tud_cdc_connected()) {
            char line[100];
            if (!sent_header && tud_cdc_write_available() >= 40) {
                tud_cdc_write_str("voltage_mV,current_uA,power_uW,status\r\n");
                sent_header = true;
            }
            int len = sensor_ok ? snprintf(line, sizeof line, "%lu,%ld,%ld,%s\r\n",
                (unsigned long)voltage_mv, (long)current_ua,
                (long)(target_power_uw(voltage_mv, current_ua)),
                current_ua > 50000 ? "OVER_BUDGET" : "OK") :
                snprintf(line, sizeof line, "0,0,0,SENSOR_ERROR\r\n");
            if (sent_header && tud_cdc_write_available() >= (uint32_t)len) tud_cdc_write(line, len);
            tud_cdc_write_flush();
            // USB CDC is telemetry, not a UART bridge on this board.
            uint8_t discard[32];
            while (tud_cdc_available()) tud_cdc_read(discard, sizeof discard);
        } else sent_header = false;
    }
    if (!sensor_ok || current_ua > 50000 || (saw_fault && (uint32_t)(now-last_fault) < 1000000)) rgb(20,0,0);
    else if (saw_activity && (uint32_t)(now-last_activity) < 200000) rgb(18,8,0);
    else if (tud_ready()) rgb(0,12,0);
    else rgb(0,0,12);
}
