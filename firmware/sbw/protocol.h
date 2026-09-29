#pragma once
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>
// Fixed 64-byte frames: JSTB, version, op, sequence, count (words),
// address LE32, 48 payload bytes, CRC32 LE32 over bytes 0..59.
// Response has the same layout; byte 7 is status; read size comes from request.
#define SBW_FRAME_SIZE 64
#define SBW_MAX_WORDS 24
#define SBW_INFO 0
#define SBW_START 1
#define SBW_STOP 2
#define SBW_READ 3
#define SBW_WRITE 4
#define SBW_OK 0
#define SBW_BAD_FRAME 1
#define SBW_BAD_STATE 2
#define SBW_BAD_RANGE 3
#define SBW_TARGET_ERROR 4
#define SBW_WRONG_DEVICE 5
uint32_t sbw_u32(const uint8_t *p);
void sbw_put32(uint8_t *p, uint32_t v);
uint32_t sbw_crc(const uint8_t *p, size_t n);
bool sbw_valid_frame(const uint8_t *p);
bool sbw_write_range(uint32_t address, unsigned words);
void sbw_process_frame(const uint8_t *request, uint8_t *response);
void sbw_session_abort(void);
