#include "protocol.h"
#include "sbw_device.h"
#include "sbw_transport.h"
#include <assert.h>
#include <string.h>
static uint16_t memory[32768], device=0x8240;
static unsigned writes, stops, resets;
static bool fail_write;
int sbw_dev_start(void) { return 0; }
int sbw_dev_stop(void) { stops++; return 0; }
int sbw_transport_stop(void) { return 0; }
void set_sbwtdio(bool state) { if(!state) resets++; }
void set_sbwtck(bool state) { (void)state; }
int sbw_dev_mem_read(uint16_t *dst,uint32_t a,size_t n) {
  if(a==0x1a04) { *dst=device; return 0; }
  memcpy(dst,memory+a/2,n*2); return 0;
}
int sbw_dev_mem_write(uint32_t a,uint16_t *src,size_t n) {
  writes++;
  if(fail_write && a>=0xc400) return -1;
  memcpy(memory+a/2,src,n*2); return 0;
}
static uint8_t q[64],r[64];
static unsigned request(unsigned op,unsigned a,unsigned n) {
  memset(q,0,sizeof q); memcpy(q,"JSTB",4); q[4]=1; q[5]=op; q[6]=17; q[7]=n;
  sbw_put32(q+8,a); q[12]=0x34; q[13]=0x12;
  sbw_put32(q+60,sbw_crc(q,60)); sbw_process_frame(q,r);
  assert(sbw_valid_frame(r)); assert(r[6]==17); return r[7];
}
int main(void) {
  assert(request(SBW_WRITE,0xc400,1)==SBW_BAD_STATE);
  device=0x1234; assert(request(SBW_START,0,0)==SBW_WRONG_DEVICE);
  assert(writes==0); device=0x8240;
  assert(request(SBW_START,0,0)==SBW_OK);
  assert(request(SBW_START,0,0)==SBW_BAD_STATE);
  assert(request(SBW_WRITE,0xff80,1)==SBW_BAD_RANGE); assert(writes==0);
  memory[0x160/2]=0x9603;
  assert(request(SBW_WRITE,0xc400,1)==SBW_OK);
  assert(memory[0xc400/2]==0x1234); assert(memory[0x160/2]==0xa503);
  fail_write=true;
  assert(request(SBW_WRITE,0xc400,1)==SBW_TARGET_ERROR);
  assert(memory[0x160/2]==0xa503); assert(stops==0);
  assert(request(SBW_READ,0xc400,1)==SBW_OK); assert(r[12]==0x34 && r[13]==0x12);
  assert(request(SBW_READ,0xc400,25)==SBW_BAD_RANGE);
  sbw_session_abort(); assert(resets==1); assert(stops==0);
  assert(request(SBW_WRITE,0xc400,1)==SBW_BAD_STATE);
  assert(request(SBW_START,0,0)==SBW_OK);
  assert(request(SBW_STOP,0,0)==SBW_OK); assert(stops==1);
  sbw_session_abort(); assert(resets==1);
  return 0;
}
