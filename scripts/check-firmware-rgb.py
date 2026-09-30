"""Check assembled PIO pulse durations against the WS2812C-2020-V6 datasheet."""
import re
import sys
from pathlib import Path

header = Path(sys.argv[1]).read_text()
body = header.split('status_rgb_program_instructions[] = {', 1)[1].split('};', 1)[0]
words = [int(word, 16) for word in re.findall(r'0x[0-9a-fA-F]+', body)]
wrap = int(re.search(r'#define status_rgb_wrap (\d+)', header)[1])
start = int(re.search(r'#define status_rgb_wrap_target (\d+)', header)[1])
monitor = (Path(__file__).resolve().parent.parent / 'firmware/status_monitor.c').read_text()
clock = float(re.search(r'clock_get_hz\(clk_sys\) / ([\d.]+)f', monitor)[1])
assert clock == 10_000_000

# Execute the assembled instructions for both branches, stopping at the next
# OUT. Side-set is one mandatory bit; the remaining four bits encode delay.
for bit in (0, 1):
    pc, high_cycles, low_cycles = start, 0, 0
    for step in range(16):
        word = words[pc]
        opcode = word >> 13
        cycles = 1 + ((word >> 8) & 15)
        if word & 0x1000:
            high_cycles += cycles
        else:
            low_cycles += cycles
        next_pc = start if pc == wrap else pc + 1
        if opcode == 0:  # JMP, only unconditional and !X are used
            condition = (word >> 5) & 7
            assert condition in (0, 1)
            if condition == 0 or not bit:
                next_pc = word & 31
        elif opcode == 3:  # OUT X, 1; a FIFO stall holds side-set low
            assert (word & 255) == 0x21 and not (word & 0x1000)
            assert step == 0
        else:
            assert opcode == 5 and (word & 255) == 0x42  # NOP / MOV Y, Y
        pc = next_pc
        if pc == start:
            break
    else:
        raise AssertionError('PIO did not return to bit loop')
    high_ns, low_ns = high_cycles * 1e9 / clock, low_cycles * 1e9 / clock
    assert (220 <= high_ns <= 380) if bit == 0 else (580 <= high_ns <= 1000)
    assert 580 <= low_ns <= 1000
    print(f'RGB bit {bit}: high {high_ns:g} ns, low {low_ns:g} ns; datasheet limits pass')
