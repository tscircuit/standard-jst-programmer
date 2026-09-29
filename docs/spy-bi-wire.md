# Experimental Spy-Bi-Wire support

The existing RP2040 hardware supports an **alternate SBW UF2** for MSP430FR2433.
The normal SWD UF2 and OpenOCD workflow are unchanged. Switch protocols by holding
BOOT while connecting USB and copying the desired UF2 to RPI-RP2. This PR does
not implement automatic detection, simultaneous protocols, an MSP-FET emulator,
GDB debugging or OpenOCD MSP430 support. No PCB changes are required.

The low-level routines come from [Spycoprobe](https://github.com/geissdoerfer/spycoprobe),
whose author reports FR2433 testing. This board integration has **not been tested
on physical hardware**. Treat this as a bring-up build, not a released programmer.

## Connection

Disconnect USB before wiring. Remove the target coin cell. Set the programmer's
power selector to **3.3 V**, never 5 V. Connect the two-pin power connector's
VOUT to target VCC and its GND to target GND. This board has no software-controlled
power isolation and does not adapt logic voltage to the target.

| Three-pin JST SH | Board GPIO | MSP430FR2433 |
| --- | --- | --- |
| 1 CLK | 2 | TEST / SBWTCK |
| 2 GND | — | DVSS |
| 3 DIO | 3 | RESET / SBWTDIO |

Use only this three-pin signal connector plus the separate power connector.
The five-pin connector's separate NRST must remain disconnected: SBW carries
RESET on DIO. GPIO1 remains input. Connect only one target. Keep leads short;
verify the target's reset pull-up/capacitance against TI's SBW requirements.

On the fidget PCB J2: pin 1 GND, pin 2 VTREF/VBAT, pin 3 SBWTDIO, pin 4 SBWTCK.
Its present bare pads require a cable/pogo fixture; they are not a JST socket.

## Build and flash

Requires the same CMake/Arm GNU toolchain as the existing firmware build.

```sh
SBW_USB_VID=<authorized-VID> SBW_USB_PID=<authorized-PID> bash firmware/build-sbw.sh
```

Supply a USB identity you are authorized to use. No new allocation is assumed.
CI compiles with 0xffff/0xffff solely for build testing; that artifact must not
be distributed as a USB product release. The build produces
`dist/firmware/standard-jst-programmer-sbw.uf2`.

Copy the UF2 using BOOT/RPI-RP2, then install the host dependencies in a venv:

```sh
python3 -m venv work/sbw-venv
work/sbw-venv/bin/pip install -r tools/requirements-sbw.txt
work/sbw-venv/bin/python tools/sbw.py --port /dev/cu.usbmodemXXXX application.hex
# Linux: /dev/ttyACM0; Windows: COM5 (use the actual port).
work/sbw-venv/bin/python tools/sbw.py --port /dev/cu.usbmodemXXXX --verify-only application.hex
```

The image must be Intel HEX for **MSP430FR2433**. It is validated before USB access.
The probe enters SBW, reads TLV device ID 0x8240 at 0x1a04, and refuses another
MCU. Program writes are limited to 0xc400–0xffff, excluding 0xff80–0xff8f.
All-FF filler in that excluded interval is ignored; non-FF values are rejected.
Information FRAM, RAM, peripheral registers and security signatures are not
programmable through this CLI. Only the private implementation accesses SYSCFG0
at 0x0160 to temporarily clear PFWP with password 0xa5 and restore its prior bits.
There is no erase/unlock operation for secured devices.

Only supplied bytes change. Missing bytes, including the other byte of an odd
word, are read and preserved. Each written block is read back; the reset vector
is a separate last block. STOP releases the target only after all comparisons
succeed. On a failed operation the host omits STOP; disconnect or five seconds
without a request holds the target in reset. A power cycle can still boot an
incomplete image: programming is not atomic. Retry with a known-good full image.
Do not assume firmware update preserves the fidget journal if the HEX includes
its addresses; exclude persistent sections in the application linker/export.

The SBW image supplies USB CDC commands only. Current telemetry and RGB status
from the SWD firmware are not present. The target supply switch still works.

## Wire protocol v1

Requests/responses are fixed 64-byte frames, independent of USB packet boundaries:

| Bytes | Meaning |
| --- | --- |
| 0–3 | ASCII JSTB |
| 4 | Version 1 |
| 5 | Operation: INFO=0, START=1, STOP=2, READ=3, WRITE=4 |
| 6 | Host sequence, echoed in response |
| 7 | Request word count (1–24 for memory); response status |
| 8–11 | Little-endian address (request) |
| 12–59 | Up to 24 little-endian words; unused bytes zero |
| 60–63 | IEEE CRC32 of bytes 0–59, little endian |

Status: 0 success, 1 invalid frame/op, 2 inactive/duplicate session, 3 invalid
range/count, 4 target failure, 5 wrong device. INFO returns `JST-SBW/1 FR2433`.
One command may be outstanding. Sequence/CRC errors and timeouts are fatal to the
host session; no automatic write retries. CRC detects accidental damage, not
authentication. The firmware stream parser bounds memory and resynchronizes magic.

## Validation required before release

Automated checks exercise frame CRC, address limits, sparse/odd bytes, reset-vector
ordering, failed verification, serial fragmentation and timeouts. CI builds both
firmware images. These checks do not prove electrical timing or real FRAM writes.

On an expendable FR2433 target: scope SBW entry/turnaround/low clock pulse widths;
program and read back a known blink image; check wrong-device/absent-target errors;
verify info FRAM and signatures remain unchanged; exercise dropped USB, truncated
frames, power loss and reset-vector ordering; test reconnect after timeout; then
restore SWD UF2 and program an ARM target with the existing OpenOCD command.
Record board revision, firmware SHA, supply voltage and traces before releasing.
Resolve the USB VID/PID allocation before shipping the SBW image.

References: [TI SLAU320](https://www.ti.com/lit/pdf/slau320),
[FR2433 datasheet](https://www.ti.com/lit/ds/symlink/msp430fr2433.pdf),
[FR2xx/4xx family guide](https://www.ti.com/lit/pdf/slau445).
