#!/usr/bin/env python3
"""Experimental Standard JST SBW host tool (MSP430FR2433 only)."""
import argparse
import struct
import zlib

MAGIC = b"JSTB"
MAX_WORDS = 24


def frame(op, seq, address=0, count=0, data=b""):
    if not 0 <= count <= MAX_WORDS or len(data) > 48:
        raise ValueError("Invalid payload size")
    body = struct.pack("<4sBBBBI", MAGIC, 1, op, seq, count, address) + data.ljust(48, b"\0")
    return body + struct.pack("<I", zlib.crc32(body))


def decode(raw, op, seq):
    if len(raw) != 64 or raw[:5] != MAGIC + b"\x01":
        raise RuntimeError("Invalid or truncated SBW response")
    if zlib.crc32(raw[:60]) != struct.unpack_from("<I", raw, 60)[0]:
        raise RuntimeError("SBW response CRC mismatch")
    if raw[5:7] != bytes([op, seq]):
        raise RuntimeError("Stale or mismatched SBW response")
    if raw[7]:
        raise RuntimeError(f"SBW status {raw[7]} (1 frame, 2 state, 3 range, 4 target, 5 wrong device)")
    return raw[12:60]


class Probe:
    def __init__(self, port):
        self.port, self.seq = port, 0

    def command(self, op, address=0, count=0, data=b""):
        self.seq = (self.seq + 1) & 255
        packet = frame(op, self.seq, address, count, data)
        if self.port.write(packet) != len(packet):
            raise RuntimeError("Short USB write; reconnect before retrying")
        response = bytearray()
        while len(response) < 64:
            chunk = self.port.read(64 - len(response))
            if not chunk:
                raise TimeoutError("SBW response timeout; reconnect before retrying")
            response.extend(chunk)
        return decode(response, op, self.seq)

    def read(self, address, count):
        return self.command(3, address, count)[:2*count]


def plan(image):
    """Validate the entire sparse byte image before touching USB; no implicit erase."""
    if not image:
        raise ValueError("Empty image")
    for address, value in image.items():
        if not isinstance(address, int) or not 0xc400 <= address <= 0xffff:
            raise ValueError(f"Address outside FR2433 program FRAM: {address:#x}")
        if not 0 <= value <= 255:
            raise ValueError("Invalid byte")
        if 0xff80 <= address < 0xff90 and value != 255:
            raise ValueError("Image modifies reserved/JTAG/BSL signatures")
    addresses = sorted({a & ~1 for a in image if not 0xff80 <= a < 0xff90})
    if not addresses:
        raise ValueError("Image contains no writable bytes")
    blocks = []
    for a in addresses:
        # Reset vector is always a separate final transaction.
        if blocks and a == blocks[-1][-1] + 2 and len(blocks[-1]) < MAX_WORDS and a != 0xfffe:
            blocks[-1].append(a)
        else:
            blocks.append([a])
    return blocks


def program(probe, image, verify_only=False):
    blocks = plan(image)
    identity = probe.command(0)
    if not identity.startswith(b"JST-SBW/1 FR2433"):
        raise RuntimeError("Unexpected probe firmware")
    probe.command(1)  # Firmware checks actual device ID before permitting writes.
    # On failure, deliberately omit STOP: disconnect/timeout holds reset.
    for block in blocks:
        address, count = block[0], len(block)
        previous = probe.read(address, count)
        desired = bytes(image.get(address+i, previous[i]) for i in range(2*count))
        if not verify_only and desired != previous:
            probe.command(4, address, count, desired)
        actual = probe.read(address, count)
        if actual != desired:
            raise RuntimeError(f"Verification failed at {address:#06x}; target not released")
    probe.command(2)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", required=True, help="Explicit USB CDC serial port")
    parser.add_argument("--verify-only", action="store_true")
    parser.add_argument("image", help="Intel HEX file; program FRAM only")
    args = parser.parse_args()
    from intelhex import IntelHex
    import serial
    image = IntelHex(args.image).todict()
    image.pop("start_addr", None)
    plan(image)
    with serial.Serial(args.port, 115200, timeout=10, write_timeout=10) as port:
        port.reset_input_buffer()
        program(Probe(port), image, args.verify_only)
    print("Verified all supplied bytes; target released.")


if __name__ == "__main__":
    main()
