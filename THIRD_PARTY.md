# Third-party materials

The JST footprint files and derived TSX footprints originate from the KiCad `kicad-footprints` Connector_JST library, licensed under CC-BY-SA-4.0 with the KiCad libraries exception:
https://github.com/KiCad/kicad-footprints/blob/master/LICENSE.md

Original files:
- Connector_JST.pretty/JST_SH_BM05B-SRSS-TB_1x05-1MP_P1.00mm_Vertical.kicad_mod
- Connector_JST.pretty/JST_SH_SM05B-SRSS-TB_1x05-1MP_P1.00mm_Horizontal.kicad_mod

Changes: removed legacy WRL model references for conversion compatibility; converted to TSX with tsci; made mounting pads mechanical; specified connector insertion direction; removed long fabrication text; added application signal labels. Replaced the REF** placeholder with the component reference. Original copper geometry and pin numbering are preserved.

The discrete RP2040 support circuit and eight imported component definitions in `rp2040/` are adapted from `tscircuit/common`, revision `a5797da88ec19944442d87392174af0a36fe1a0a`:
https://github.com/tscircuit/common/tree/a5797da88ec19944442d87392174af0a36fe1a0a/lib/Microcontroller_RP2040

The original MIT license is retained at `rp2040/LICENSE`. Changes include local decoupling placement, regulator/core bypass capacitors, 1 kΩ BOOTSEL and crystal-drive resistors, explicit top-layer crystal routes, a bottom GND pour, and integration with the five-pin target interface. This is discrete circuitry; no RP2040 module is used.

Firmware sources are fetched from raspberrypi/debugprobe (MIT) and raspberrypi/pico-sdk (BSD-3-Clause), with their dependencies and original license notices. The build uses the pinned upstream versions and applies the local board configuration. Their licenses govern the resulting firmware and remain in the fetched source trees.

Original code in this repository is MIT licensed. The MIT license does not override the licenses of third-party material.

The JST 3D assets are referenced from the tscircuit model CDN, imported from JLCPCB/EasyEDA catalog parts C160391 (BM05B-SRSS-TB) and C136657 (SM05B-SRSS-TB). They are external vendor models, not original MIT-licensed model geometry. Model origin metadata is retained from tsci import; the vertical model rotation is adapted to the KiCad footprint.
