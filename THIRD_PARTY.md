# Third-party materials

The discrete RP2040 support circuit and eight imported component definitions in `rp2040/` are adapted from `tscircuit/common`, revision `a5797da88ec19944442d87392174af0a36fe1a0a`:
https://github.com/tscircuit/common/tree/a5797da88ec19944442d87392174af0a36fe1a0a/lib/Microcontroller_RP2040

The original MIT license is retained at `rp2040/LICENSE`. Changes include local decoupling placement, regulator/core bypass capacitors, 1 kΩ BOOTSEL and crystal-drive resistors, explicit top-layer crystal routes and a compact flash-data route, a bottom GND pour, integration with the three-pin SWD and separate power interface, compact top-side placement, and removal of the recovery test points. This is discrete circuitry; no RP2040 module is used.

Firmware sources are fetched from raspberrypi/debugprobe (MIT) and raspberrypi/pico-sdk (BSD-3-Clause), with their dependencies and original license notices. The build uses the pinned upstream versions and applies the local board configuration. Their licenses govern the resulting firmware and remain in the fetched source trees.

Original code in this repository is MIT licensed. The MIT license does not override the licenses of third-party material.

The JST footprints and CAD metadata are imported from JLCPCB/EasyEDA catalog parts C160389 (BM03B-SRSS-TB), C160403 (SM03B-SRSS-TB), C160388 (BM02B-SRSS-TB), and C160402 (SM02B-SRSS-TB). Mounting tabs are mechanical; signal contact numbering and pad geometry are preserved. The C&K JS102011SAQN selector footprint/model uses C221660. External vendor 3D models are referenced from the tscircuit model CDN and are not original MIT-licensed geometry.
