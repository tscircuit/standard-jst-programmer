#include "protocol.h"
#include "sbw_device.h"
#include "sbw_transport.h"
#include <string.h>
static bool active;
void sbw_session_abort(void) {
  // Do not start a possibly partial image after a lost host or failed verification.
  // Drive RESET low before releasing TEST. A power cycle may still run partial FRAM.
  if (active) { set_sbwtdio(0); set_sbwtck(0); }
  active=false;
}
void sbw_process_frame(const uint8_t *q, uint8_t *r) {
  memset(r,0,64); memcpy(r,q,7); memcpy(r,"JSTB",4); r[4]=1;
  uint8_t status=SBW_OK, op=q[5], n=q[7]; uint32_t a=sbw_u32(q+8);
  uint16_t words[SBW_MAX_WORDS]={0}, id=0;
  if (!sbw_valid_frame(q)) status=SBW_BAD_FRAME;
  else if (op==SBW_INFO) memcpy(r+12,"JST-SBW/1 FR2433",15);
  else if (op==SBW_START) {
    if(active) status=SBW_BAD_STATE;
    else {
      if (sbw_dev_start()!=0) status=SBW_TARGET_ERROR;
      else {
        active=true;
        // FR2433 TLV device ID, datasheet Table 6-21.
        if(sbw_dev_mem_read(&id,0x1a04,1)!=0) status=SBW_TARGET_ERROR;
        else if(id!=0x8240) status=SBW_WRONG_DEVICE;
      }
      if(status) { sbw_transport_stop(); active=false; }
    }
  } else if (!active) status=SBW_BAD_STATE;
  else if (op==SBW_STOP) { status=sbw_dev_stop()==0 ? SBW_OK : SBW_TARGET_ERROR; active=false; }
  else if (op==SBW_READ) {
    if(!n || n>SBW_MAX_WORDS || (a&1) || a>0x10000u-2*n) status=SBW_BAD_RANGE;
    else if(sbw_dev_mem_read(words,a,n)!=0) status=SBW_TARGET_ERROR;
    else for(unsigned i=0;i<n;i++) { r[12+2*i]=words[i]; r[13+2*i]=words[i]>>8; }
  } else if (op==SBW_WRITE) {
    if(!sbw_write_range(a,n)) status=SBW_BAD_RANGE;
    else {
      uint16_t cfg=0, unlock, restore;
      for(unsigned i=0;i<n;i++) words[i]=q[12+2*i] | (uint16_t)q[13+2*i]<<8;
      if(sbw_dev_mem_read(&cfg,0x160,1)!=0) status=SBW_TARGET_ERROR;
      else {
        // Preserve data-FRAM protection and offset; unlock program FRAM only.
        unlock=0xa500 | (cfg & 0xfe); restore=0xa500 | (cfg & 0xff);
        if(sbw_dev_mem_write(0x160,&unlock,1)!=0 || sbw_dev_mem_write(a,words,n)!=0) status=SBW_TARGET_ERROR;
        if(sbw_dev_mem_write(0x160,&restore,1)!=0) status=SBW_TARGET_ERROR;
      }
    }
  } else status=SBW_BAD_FRAME;
  r[7]=status; sbw_put32(r+60,sbw_crc(r,60));
}
