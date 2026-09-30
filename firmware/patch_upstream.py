"""Apply board integration to pristine pinned upstream sources, idempotently."""
from pathlib import Path
import subprocess, sys, shutil
root = Path(sys.argv[1])
local = Path(__file__).parent

def original(path):
    return subprocess.check_output(['git', '-C', str(root), 'show', 'HEAD:'+path], text=True)
def replace(s, old, new):
    assert s.count(old) == 1, f'Expected one upstream anchor: {old}'
    return s.replace(old, new)
def save(path, s):
    (root/path).write_text(s)

s=original('src/probe_config.h')
s=replace(s, '#include "board_debug_probe_config.h"', '#include "board_standard_jst_config.h"')
save('src/probe_config.h',s)
s=original('src/probe.pio')
s=replace(s,'gpio_pull_up(PROBE_PIN_RESET);','gpio_disable_pulls(PROBE_PIN_RESET);')
save('src/probe.pio',s)
# Keep upstream DAP's open-drain reset direction control. The target supplies its pull-up.
for name in ['status_monitor.c','status_monitor.h','status_rgb.pio','status_math.h']:
    shutil.copyfile(local/name,root/'src'/name)
s=original('CMakeLists.txt')
s+='\ntarget_sources(debugprobe PRIVATE src/status_monitor.c)\ntarget_link_libraries(debugprobe PRIVATE hardware_i2c)\npico_generate_pio_header(debugprobe ${CMAKE_CURRENT_LIST_DIR}/src/status_rgb.pio)\n'
save('CMakeLists.txt',s)
s=original('src/main.c')
s=replace(s,'#include "probe.h"','#include "probe.h"\n#include "status_monitor.h"')
s=replace(s,'xTaskCreate(usb_thread, "TUD", configMINIMAL_STACK_SIZE,', 'xTaskCreate(usb_thread, "TUD", 2 * configMINIMAL_STACK_SIZE,')
s=replace(s,'    DAP_Setup();','    DAP_Setup();\n    status_monitor_init();')
s=s.replace('        tud_task();','        tud_task();\n        status_monitor_tick();')
s=s.replace('DAP_ProcessCommand(RxDataBuffer, TxDataBuffer);', 'DAP_ProcessCommand(RxDataBuffer, TxDataBuffer);\n    status_monitor_dap(RxDataBuffer, TxDataBuffer);')
save('src/main.c',s)
# Keep upstream UART CDC0; telemetry uses independent CDC1 on the USB core.
s=original('src/cdc_uart.c')
for signature in [
    'void tud_cdc_line_coding_cb(uint8_t itf, cdc_line_coding_t const* line_coding)',
    'void tud_cdc_line_state_cb(uint8_t itf, bool dtr, bool rts)',
]:
    s=replace(s, signature+'\n{', signature+'\n{\n  if (itf != 0) return;')
s=replace(s, 'void tud_cdc_send_break_cb(uint8_t itf, uint16_t wValue) {',
    'void tud_cdc_send_break_cb(uint8_t itf, uint16_t wValue) {\n  if (itf != 0) return;')
save('src/cdc_uart.c',s)
s=original('src/tusb_config.h')
s=replace(s, '#define CFG_TUD_CDC             1', '#define CFG_TUD_CDC             2')
save('src/tusb_config.h',s)
s=original('src/usb_descriptors.c')
s=replace(s, '  ITF_NUM_RESET,', '  ITF_NUM_TELEMETRY_COM,\n  ITF_NUM_TELEMETRY_DATA,\n  ITF_NUM_RESET,')
s=s.replace('TUD_CONFIG_DESC_LEN + TUD_CDC_DESC_LEN +', 'TUD_CONFIG_DESC_LEN + 2 * TUD_CDC_DESC_LEN +')
s=replace(s, '  // Reset interface',
    '  // Independent telemetry CDC1: endpoints do not overlap UART/DAP.\n'
    '  TUD_CDC_DESCRIPTOR(ITF_NUM_TELEMETRY_COM, 8, 0x86, 64, 0x07, 0x87, 64),\n'
    '  // Reset interface')
s=replace(s, 'CONFIG_TOTAL_LEN - TUD_RPI_RESET_DESC_LEN - TUD_CDC_DESC_LEN +',
    'CONFIG_TOTAL_LEN - TUD_RPI_RESET_DESC_LEN - 2 * TUD_CDC_DESC_LEN +')
s=replace(s, '  "Reset", // 7: Interface descriptor for Reset',
    '  "Reset", // 7: Interface descriptor for Reset\n  "Target power telemetry", // 8: CDC1')
save('src/usb_descriptors.c',s)
s=original('src/tusb_edpt_handler.c')
s='#include "status_monitor.h"\n'+s
anchor='resp_len = DAP_ExecuteCommand(RD_SLOT_PTR(USBRequestBuffer), WR_SLOT_PTR(USBResponseBuffer)) & 0xffff;'
s=replace(s,anchor,anchor+'\n            status_monitor_dap(RD_SLOT_PTR(USBRequestBuffer), WR_SLOT_PTR(USBResponseBuffer));')
save('src/tusb_edpt_handler.c',s)
