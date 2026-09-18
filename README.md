# Standard JST programmer

Use a three-pin JST SH (1 mm) connector for SWD and an optional separate two-pin JST SH connector for power. The SWD connector follows the [Raspberry Pi Debug Connector pinout](https://datasheets.raspberrypi.com/debug/debug-connector-specification.pdf).

## Install

```sh
tsci add tscircuit/standard-jst-programmer
```

## Choose components

| Export | Use |
| --- | --- |
| `StandardJstSwdUpward` | Upward-facing three-pin SWD connector. Also the default export. |
| `StandardJstSwdSide` | Side-facing three-pin SWD connector. |
| `StandardJstPowerUpward` | Upward-facing two-pin power connector. |
| `StandardJstPowerSide` | Side-facing two-pin power connector. |
| `ProgrammerBoard` | Complete 26 × 38 mm USB-C programmer. |

Each connector includes its footprint, JLCPCB part number, and 3D model. Version 0.4 replaces the previous five-pin interface; use matching three- and two-pin cables.

## Add SWD and power to a target board

```tsx
import {
  StandardJstSwdUpward,
  StandardJstPowerUpward,
} from "@tsci/tscircuit.standard-jst-programmer"

export default () => (
  <board width={30} height={20}>
    <StandardJstSwdUpward name="J_DEBUG" pcbX={-5} pcbY={5} />
    <StandardJstPowerUpward name="J_POWER" pcbX={5} pcbY={5} />

    <trace from=".J_DEBUG > .SWCLK" to="net.SWCLK" />
    <trace from=".J_DEBUG > .GND" to="net.GND" />
    <trace from=".J_DEBUG > .SWDIO" to="net.SWDIO" />
    <trace from=".J_POWER > .VOUT" to="net.TARGET_POWER_IN" />
    <trace from=".J_POWER > .GND" to="net.GND" />

    {/* Add your MCU and power circuit. Connect SWCLK/SWDIO through
        100 ohm series resistors placed close to the target MCU. */}
  </board>
)
```

Connect `TARGET_POWER_IN` to the appropriate supply input on your target: a 3.3 V rail when selecting **3V3**, or a 5 V-rated input/regulator when selecting **5V**. Omit the power connector if the target has its own supply. Connectors do not connect to global nets automatically.

For side entry, substitute `StandardJstSwdSide` and `StandardJstPowerSide`; the electrical pin assignments stay the same. At `pcbRotation={0}`, side-entry connectors open toward −Y. Rotate 90° for +X, 180° for +Y, or 270° for −X.

All four components accept placement props including `pcbX`, `pcbY`, `pcbRotation`, `schX`, and `schY`. The package exports `SwdConnectorProps` and `PowerConnectorProps` types.

## Connect the cables

| SWD pin | Selector | Target connection |
| --- | --- | --- |
| 1 | `.SWCLK` | SWD clock |
| 2 | `.GND` | Ground |
| 3 | `.SWDIO` | SWD data |

| Power pin | Selector | Target connection |
| --- | --- | --- |
| 1 | `.VOUT` | Selected supply input |
| 2 | `.GND` | Ground |

Use straight-through JST SH cables: **1→1, 2→2, 3→3** for SWD and **1→1, 2→2** for power. Check contact numbers, not wire colors. The three-pin SWD connector accepts Raspberry Pi Debug Probe SWD cables. The separate power connector is this project's extension; the Raspberry Pi Debug Probe does not supply it. No reset signal is carried by either cable.

## Use the programmer

```tsx
import { ProgrammerBoard } from "@tsci/tscircuit.standard-jst-programmer"

export default () => <ProgrammerBoard />
```

`ProgrammerBoard` contains a `<board>`; use it as the root circuit. USB-C and the two target connectors are on opposite edges. The default package preview displays the programmer and both connector example boards together.

Connect USB-C to your computer and the SWD cable to your target. Use the [custom firmware and OpenOCD configuration](https://github.com/tscircuit/standard-jst-programmer/tree/main/firmware). Software reset is used; there is no external reset wire.

Before connecting target power, set `SW_PWR` to the labeled **3V3** or **5V** position. Disconnect the power cable before changing voltage. Both positions supply power; there is no OFF position. Leave the power cable unplugged when the target has another supply. Keep target consumption at or below 50 mA; this output has no dedicated current limiter.

**SWD signal levels always remain 3.3 V**, including when the power output is set to 5 V. Use 5 V only with a compatible target power input; never connect it directly to a 3.3 V rail. Power the target before debugging.
