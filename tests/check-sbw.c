#include "protocol.h"
#include <assert.h>
#include <string.h>
int main(void) {
  assert(sbw_crc((const uint8_t*)"123456789",9)==0xcbf43926);
  uint8_t q[64]={0}; memcpy(q,"JSTB",4); q[4]=1;
  sbw_put32(q+60,sbw_crc(q,60)); assert(sbw_valid_frame(q));
  for(unsigned i=0;i<64;i++) { q[i]^=1; assert(!sbw_valid_frame(q)); q[i]^=1; }
  assert(sbw_write_range(0xc400,24)); assert(sbw_write_range(0xfffe,1));
  assert(!sbw_write_range(0xfffe,2)); assert(!sbw_write_range(0xc401,1));
  assert(!sbw_write_range(0xff7e,2)); assert(!sbw_write_range(0xff80,1));
  assert(!sbw_write_range(0xffffffff,24)); assert(!sbw_write_range(0xc400,25));
  assert(!sbw_write_range(0xc400,0)); return 0;
}
