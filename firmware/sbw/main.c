#include "pico/stdlib.h"
#include "bsp/board.h"
#include "tusb.h"
#include "protocol.h"
#include "sbw_device.h"
#include "sbw_transport.h"
#include <string.h>
int main(void) {
  board_init();
  // GPIO1 (separate NRST) remains high impedance. SBW reset uses GPIO3.
  gpio_init(1); gpio_disable_pulls(1);
  sbw_pins_t pins={.sbw_tck=2,.sbw_tdio=3,.sbw_dir=-1,.sbw_enable=-1};
  sbw_dev_setup(&pins); sbw_transport_stop(); tusb_init();
  uint8_t input[64], output[64]; unsigned used=0, sent=64;
  uint64_t last=time_us_64(); bool connected=false;
  while(1) {
    tud_task();
    bool now=tud_cdc_connected();
    if(!now) {
      if(connected) sbw_session_abort();
      used=0; sent=64; connected=false; continue;
    }
    connected=true;
    if(time_us_64()-last>5000000) { sbw_session_abort(); used=0; last=time_us_64(); }
    if(sent<64) {
      sent+=tud_cdc_write(output+sent,64-sent); tud_cdc_write_flush(); continue;
    }
    while(tud_cdc_available() && used<64) {
      tud_cdc_read(input+used,1); used++; last=time_us_64();
      // Recover byte alignment after noise/truncation, bounded to one frame.
      if(used>=4 && memcmp(input,"JSTB",4)) { memmove(input,input+1,--used); }
    }
    if(used==64) { sbw_process_frame(input,output); used=0; sent=0; }
  }
}
