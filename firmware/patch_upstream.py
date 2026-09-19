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
# Telemetry and RGB run on USB core; no new thread races with TinyUSB CDC calls.
s=original('src/cdc_uart.c')
s=replace(s, 'static uint8_t tx_buf[32];\nstatic uint8_t rx_buf[32];', '// USB CDC carries target-current telemetry on this board.')
a=s.index('bool cdc_task(void)');start=s.index('{',a);depth=1;end=start+1
while depth:
    if s[end]=='{':depth+=1
    if s[end]=='}':depth-=1
    end+=1
s=s[:start]+'{ return false; }'+s[end:]
save('src/cdc_uart.c',s)
s=original('src/tusb_edpt_handler.c')
s='#include "status_monitor.h"\n'+s
anchor='resp_len = DAP_ExecuteCommand(RD_SLOT_PTR(USBRequestBuffer), WR_SLOT_PTR(USBResponseBuffer)) & 0xffff;'
s=replace(s,anchor,anchor+'\n            status_monitor_dap(RD_SLOT_PTR(USBRequestBuffer), WR_SLOT_PTR(USBResponseBuffer));')
save('src/tusb_edpt_handler.c',s)
