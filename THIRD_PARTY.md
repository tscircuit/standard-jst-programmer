# Third-party materials

The JST footprint files and derived TSX footprints originate from the KiCad `kicad-footprints` Connector_JST library, licensed under CC-BY-SA-4.0 with the KiCad libraries exception:
https://github.com/KiCad/kicad-footprints/blob/master/LICENSE.md

Original files:
- Connector_JST.pretty/JST_SH_BM05B-SRSS-TB_1x05-1MP_P1.00mm_Vertical.kicad_mod
- Connector_JST.pretty/JST_SH_SM05B-SRSS-TB_1x05-1MP_P1.00mm_Horizontal.kicad_mod

Changes: removed legacy WRL model references for conversion compatibility; converted to TSX with tsci; made mounting pads mechanical; specified connector insertion direction; removed long fabrication text; added application signal labels. Original copper geometry and pin numbering are preserved.

The module footprint remains an external dependency, `@tsci/piuzera.RP2040_Zero@0.1.0`, generated from JLCPCB C5350143. The package does not declare a license; its files are not relicensed or vendored here.

Firmware sources are fetched from raspberrypi/debugprobe (MIT) and raspberrypi/pico-sdk (BSD-3-Clause), with their dependencies and original license notices. The build uses the pinned upstream versions and applies the local board configuration. Their licenses govern the resulting firmware and remain in the fetched source trees.

Original code in this repository is MIT licensed. The MIT license does not override the licenses of third-party material.
