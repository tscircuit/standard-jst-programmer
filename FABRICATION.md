# Standard JST programmer v0.8.1 fabrication package

This package contains the current UART programmer layout with Economic-compatible
RGB and stocked shunt replacements, based on PR #3. The outline remains 26 × 42 mm.
The power switch is raised on the left edge, with J5 UART below it.

Upload the **gerbers ZIP** for bare PCB fabrication. The separate **fabrication ZIP**
contains the same Gerbers plus BOM, placement data, drawings, circuit JSON, and
validation results. Use the manifest's Git commit and circuit SHA-256 to identify
this revision. The v0.8.1 registry package has not been published.

## Fabrication specification

| Setting | Value |
|---|---|
| Outline | 26 × 42 mm; closed rectangular routed outline |
| Construction | Four-layer FR-4; source thickness 1.4 mm |
| Copper order | F_Cu / In1_Cu / In2_Cu / B_Cu |
| Suggested copper | 1 oz outer, 0.5 oz inner; do not select 2 oz with this routing |
| Suggested finish / mask | ENIG / green; fine-pitch solder-mask requirements apply |
| Routing | Minimum trace width 0.10 mm; configured trace-to-pad clearance 0.12 mm |
| Board-edge copper clearance | 0.20 mm minimum |
| Through vias | 121 unique holes, 0.30 mm drill / 0.55 mm pad; 0.125 mm radial ring |
| USB mounting slots | Four plated slots, 0.60 mm drill tool, L1–L4 |
| Non-plated holes | Two 0.70 mm USB locators, two 1.00 mm switch locators |
| Assembly | 63 components, all on the top side |
| Coordinates | Millimetres, board centre (0,0), +Y upward |

Preserve the mask openings supplied in the Gerbers. Through vias are tented;
filled/capped vias are not specified. Confirm the source-defined 1.4 mm thickness
with the chosen fabricator rather than silently changing the stackup. There is no
controlled-impedance certification for the USB pair.

The USB connector is SHOU HAN TYPE-C 16PIN 2MD(073), C2765186. Its manufacturer
land pattern uses four plated mounting slots and two locating holes, without a
board cutout. J5 uses SM03B-SRSS-TB(LF)(SN), C160403. Host pin order is
**1 TX / 2 GND / 3 RX**. Full-size 1.7 mm UART labels (0.153 mm strokes) with leader lines are printed
on the back; the small labels on the front supplement that legend.

Some inherited front reference text and connector legends are smaller than the
fabricator's recommended text size and may be clipped or reduced during CAM.
Use the assembly drawing and BOM for component identification. The readable
back-side UART legend is included in the actual B_SilkScreen Gerber.

## Economic assembly replacements

Availability was checked in JLCPCB's live parts catalogue on 2026-09-30.
Both replacements are listed for **Economic and Standard** PCBA:

| Designator | Replacement | JLCPCB part | Observed stock | Specification |
|---|---|---|---:|---|
| D_RGB | Worldsemi WS2812C-2020-V6 | C55109522 | 14,960 | Addressable GRB LED; 2.2 × 2.0 mm body; 5 V |
| R_SHUNT | UNI-ROYAL 0603WAF100LT5E | C111027 | 101,748 | 0.1 Ω ±1%, 0603, 100 mW, ±800 ppm/°C |

Stock is a snapshot and must be confirmed when placing an order. The shunt
preserves the original resistance, package, power rating and current calibration.
The LED is **not a drop-in substitution on the v0.8.0 PCB**. Upload this revision's
Gerbers, BOM and single JLCPCB CPL together. Its numbered pin map is 1 DO / 2 GND /
3 DI / 4 VDD. At authored 0°, pin 1 is upper-left and the package polarity mark
faces downward in the top-view assembly drawing. The manufacturer's solder lands
are 0.7 mm squares, with 1.13 mm horizontal and 0.40 mm vertical gaps.

Use this revision's UF2 firmware for the replacement LED. Its assembled PIO
program produces 300/900 ns high/low for zero and 600/600 ns for one, with frames
separated by at least 10 ms. These meet the Worldsemi V1.0 timing table; the
original firmware's 300 ns one-bit low interval does not meet that table.

## Assembly review

BOM.csv and CPL-jlcpcb.csv contain exactly the same 63 designators. The BOM
identifies L_AVDD as **Sunlord GZ1608D601TF, C1002, 600 ohm at 100 MHz**, a
non-polarised 0603 ferrite bead. It must not be substituted with a 600-MH inductor.
J4 is Samtec **FTSH-103-01-L-DV-TR, C3324375**; its LCSC listing confirms the
manufacturer part number.

CPL-jlcpcb.csv is the single placement file for JLCPCB and applies
verified JLCPCB orientation corrections where available. The remaining supplier
metadata warnings are recorded in rotation-review.json. Before releasing PCBA,
the assembler must compare these rows with the assembly drawing:

| Part | Authored rotation | Physical check |
|---|---:|---|
| J_USB | 180° | Mouth faces the upper board edge; pins and locating holes match |
| D_PWR | 0° | Cathode is pad 1; preserve the LED polarity |
| L_AVDD | 90° | Non-polarised ferrite; either 180° equivalent orientation is acceptable |
| SW_PWR | 270° | Actuator faces left; upper position selects 5 V |
| J4 | 0° | Pin 1 matches the labelled lower-left land in the top-view drawing |

These warnings do not prevent bare PCB fabrication. They prevent treating the
supplier CPL as an automatically verified, unattended assembly release. No
assembly order or manufacturer CAM/placement approval is included.

## Validation

- All four tscircuit builds, TypeScript, circuit connectivity and pinout tests pass.
- Independent @tscircuit/checks reports zero routing/placement errors.
- `tsci check shorts dist/fabrication/circuit.json --mode gerber --layer all` passes.
- Replacement LED pin numbers and manufacturer land dimensions are checked.
- Built firmware USB descriptors and assembled RGB PIO pulse durations pass checks.
- Gerbonara independently parses the Gerbers and Excellon files. The geometry audit
  compares all 236 solder lands and 3,056 routed segments against circuit JSON,
  verifies all 121 via drills and annular copper on every copper layer, checks the
  outline and copper-edge clearance, and verifies all 28 ground vias connect to
  the exported bottom ground region.
- All four plated slots and four non-plated holes match the source.
- Silkscreen is clipped to the board and kept 0.15 mm clear of solder-mask openings.
- An imported zero-width silkscreen stroke is excluded from manufacturing export
  because drawing with a zero-size aperture is invalid Gerber.
- The audit retains parser warnings. Gerbonara 1.6.3 does not interpret the valid
  LR180 paste-aperture commands; those apertures have 180° rotational symmetry.
  It also warns about the drill file's G90 header placement. Copper geometry and
  the slots/drills are parsed and verified separately.
- Validation is recorded in validation/manifest.json, independent-checks.json,
  gerber-audit.json, and build-warnings.json.

These are prototype fabrication files. Manufacturing checks cannot establish
that unbuilt hardware works; electrical bring-up and firmware tests still require
a populated board.

## Reproduce

Run `npm ci`, `npm run build`, `npm test`, `npm run typecheck`, and
`npm run export:fabrication` with Bun available. Fabrication output defaults to
`dist/fabrication`. For the separate Gerber fidelity audit, install
`gerbonara==1.6.3` and `shapely==2.1.2`, then run
`python scripts/audit-gerbers.py dist/fabrication --clip-silkscreen`.
This prepares the final silkscreen and audits the delivered files.

Primary references:
- [JLCPCB manufacturing capabilities](https://jlcpcb.com/capabilities/pcb-capabilities)
- [USB connector manufacturer drawing](https://xonstorage.z8.web.core.windows.net/pdf/shou_typec16pin2md073_apr22_xonlink.pdf)
- [C1002 ferrite specification](https://jlcpcb.com/partdetail/Sunlord-GZ1608D601TF/C1002)
- [C3324375 header identification](https://www.lcsc.com/product-detail/C3324375.html)

- [C55109522 Economic-compatible LED](https://jlcpcb.com/partdetail/Worldsemi-WS2812C_2020V6/C55109522)
- [Worldsemi WS2812C-2020-V6 datasheet](https://datasheet.lcsc.com/datasheet/pdf/8c7f104c99e52e4adb687ae84e594e95.pdf?productCode=C55109522)
- [C111027 Economic-compatible shunt](https://jlcpcb.com/partdetail/0603WAF100LT5E/C111027)
