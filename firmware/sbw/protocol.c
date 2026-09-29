#include "protocol.h"
#include <string.h>
uint32_t sbw_u32(const uint8_t *p) { return (uint32_t)p[0] | (uint32_t)p[1]<<8 | (uint32_t)p[2]<<16 | (uint32_t)p[3]<<24; }
void sbw_put32(uint8_t *p, uint32_t v) { for (int i=0;i<4;i++) p[i]=(uint8_t)(v>>(8*i)); }
uint32_t sbw_crc(const uint8_t *p, size_t n) {
  uint32_t c=0xffffffff;
  while(n--) { c^=*p++; for(int i=0;i<8;i++) c=(c>>1) ^ (0xedb88320u & (0u-(c&1))); }
  return ~c;
}
bool sbw_valid_frame(const uint8_t *p) {
  return memcmp(p,"JSTB",4)==0 && p[4]==1 && sbw_crc(p,60)==sbw_u32(p+60);
}
bool sbw_write_range(uint32_t a, unsigned n) {
  if (!n || n>SBW_MAX_WORDS || (a&1) || a<0xc400 || a>0x10000u-2*n) return false;
  // Never program JTAG/BSL signatures or their reserved neighbors.
  return a+2*n<=0xff80 || a>=0xff90;
}
