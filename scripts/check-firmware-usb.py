"""Check the actual USB configuration descriptor embedded in the RP2040 ELF."""
import struct
import sys
from pathlib import Path

elf = Path(sys.argv[1]).read_bytes()
assert elf[:6] == b'\x7fELF\x01\x01', 'Expected little-endian ELF32'
section_offset = struct.unpack_from('<I', elf, 32)[0]
section_size, section_count = struct.unpack_from('<HH', elf, 46)
sections = [struct.unpack_from('<10I', elf, section_offset + i * section_size)
            for i in range(section_count)]
descriptor = None
for section in sections:
    if section[1] != 2:  # SHT_SYMTAB
        continue
    strings = sections[section[6]]
    names = elf[strings[4]:strings[4] + strings[5]]
    for offset in range(section[4], section[4] + section[5], section[9]):
        name, address, size, _, _, section_index = struct.unpack_from('<IIIBBH', elf, offset)
        if names[name:].split(b'\0', 1)[0] != b'desc_configuration':
            continue
        storage = sections[section_index]
        file_offset = storage[4] + address - storage[3]
        descriptor = elf[file_offset:file_offset + size]
assert descriptor is not None, 'Missing USB configuration descriptor'
assert descriptor[0:2] == bytes([9, 2])
assert struct.unpack_from('<H', descriptor, 2)[0] == len(descriptor), 'Wrong USB total length'
assert descriptor[4] == 6, 'DAP, two CDC pairs, and reset need six interfaces'
interfaces, endpoints, cdc_groups = {}, [], []
offset = 0
while offset < len(descriptor):
    size, kind = descriptor[offset:offset + 2]
    assert size >= 2 and offset + size <= len(descriptor), 'Malformed USB descriptor'
    item = descriptor[offset:offset + size]
    if kind == 4:
        assert item[2] not in interfaces, 'Duplicate USB interface'
        interfaces[item[2]] = item
    elif kind == 5:
        endpoints.append(item[2])
        assert struct.unpack_from('<H', item, 4)[0] <= 64, 'Full-speed packet size'
    elif kind == 11 and item[4] == 2:
        cdc_groups.append((item[2], item[3]))
    offset += size
assert set(interfaces) == set(range(6))
assert cdc_groups == [(1, 2), (3, 2)], 'UART CDC0 and telemetry CDC1 must be independent'
assert interfaces[1][8] == 6 and interfaces[3][8] == 8, 'Distinct serial interface names'
assert len(endpoints) == len(set(endpoints)), 'Endpoint address collision'
assert set(endpoints) == {0x04, 0x85, 0x81, 0x02, 0x83, 0x86, 0x07, 0x87}
print('Built firmware USB descriptor: DAP, UART CDC0, telemetry CDC1, reset; no endpoint collisions')
