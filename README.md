# Standard JST programmer

Use a three-pin JST SH (1 mm) connector for SWD with separate two-pin power, or use the five-pin connector for SWD, power, and NRST in one cable. The SWD connector follows the [Raspberry Pi Debug Connector pinout](https://datasheets.raspberrypi.com/debug/debug-connector-specification.pdf).

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
| `StandardJstSwdResetUpward` | Upward-facing five-pin SWD, power, and NRST drop-in. |
| `StandardJstSwdResetSide` | Side-facing five-pin SWD, power, and NRST drop-in. |
| `StandardTagConnectSwd` | Bare-pad TC2030 no-legs target footprint for the TC2030-IDC-NL-050 cable. |
| `ProgrammerBoard` | Complete 26 × 42 mm USB-C programmer; four copper layers, top-side assembly. |

Each JST connector includes its footprint, JLCPCB part number, and 3D model. The Tag-Connect target is bare copper and alignment holes: no purchased connector is required. Choose the three-pin interface for Raspberry Pi Debug Probe cable compatibility, or the five-pin extension when you also need NRST.

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

All six connector components accept placement props including `pcbX`, `pcbY`, `pcbRotation`, `schX`, and `schY`. The package exports `SwdConnectorProps`, `PowerConnectorProps`, and `SwdResetConnectorProps` types.

## Add the five-pin drop-in

```tsx
import { StandardJstSwdResetSide } from "@tsci/tscircuit.standard-jst-programmer"

export default () => (
  <board width={30} height={20}>
    <StandardJstSwdResetSide name="J_DEBUG" pcbX={0} pcbY={-7} />
    <trace from=".J_DEBUG > .VOUT" to="net.TARGET_POWER_IN" />
    <trace from=".J_DEBUG > .SWDIO" to="net.SWDIO" />
    <trace from=".J_DEBUG > .GND" to="net.GND" />
    <trace from=".J_DEBUG > .SWCLK" to="net.SWCLK" />
    <trace from=".J_DEBUG > .NRST" to="net.NRST" />
    {/* Add the MCU, power circuit, and target-side SWD series resistors. */}
    <resistor name="R_RESET" resistance="10k" footprint="0402"
      connections={{pin1:"net.NRST", pin2:"net.V3V3"}} />
  </board>
)
```

Use `StandardJstSwdResetUpward` for top entry. Connect `NRST` to the MCU's active-low reset (`RUN` on RP2040) and provide a pull-up to the target's **3.3 V logic rail**, never the selectable 5 V supply. The programmer drives reset open-drain through 100 Ω. `.nRESET` is an alias for `.NRST`.

| Five-pin contact | Selector | Target connection |
| --- | --- | --- |
| 1 | `.VOUT` | Selected 3.3 V / 5 V supply input |
| 2 | `.SWDIO` | SWD data |
| 3 | `.GND` | Ground |
| 4 | `.SWCLK` | SWD clock |
| 5 | `.NRST` | Active-low reset, with a target-side 3.3 V pull-up |

Use a straight-through five-way JST SH cable. Pin 1 follows the voltage switch; it is **not fixed at 3.3 V**. This five-pin extension is not the Raspberry Pi three-pin connector standard.

## Use a Tag-Connect cable

The programmer's **J4 TAG** header mates with the [TC2030-IDC-NL-050](https://www.tag-connect.com/product/tc2030-idc-050-6-pin-tag-connect-plug-of-nails-spring-pin-cable-no-legs-to-6-pin-0-05-idc) cable: **6 pins, 2 × 3, 1.27 mm (0.05 inch)**. Align the IDC socket's pin-1 mark/red stripe with the programmer's **1** mark. This header is unshrouded; check its orientation before applying USB power. The 2.54 mm IDC and 10-pin Cortex cables do not fit.

```tsx
import { StandardTagConnectSwd } from "@tsci/tscircuit.standard-jst-programmer"

export default () => (
  <board width={30} height={25}>
    <StandardTagConnectSwd name="J_DEBUG" pcbX={0} pcbY={0}
      noConnect={["SWO"]} />
    <trace from=".J_DEBUG > .VOUT" to="net.TARGET_POWER_IN" />
    <trace from=".J_DEBUG > .SWDIO" to="net.SWDIO" />
    <trace from=".J_DEBUG > .NRST" to="net.NRST" />
    <trace from=".J_DEBUG > .SWCLK" to="net.SWCLK" />
    <trace from=".J_DEBUG > .GND" to="net.GND" />
    <resistor name="R_RESET" resistance="10k" footprint="0402"
      connections={{pin1:"net.NRST", pin2:"net.V3V3"}} />
    {/* Add your MCU, supply input, and target-side SWD series resistors. */}
  </board>
)
```

| IDC / Tag-Connect contact | Selector | Use |
| --- | --- | --- |
| 1 | `.VOUT` | Selected, current-sensed 3.3 V or 5 V output |
| 2 | `.SWDIO` | SWD data |
| 3 | `.NRST` | Open-drain target reset; add a pull-up to 3.3 V |
| 4 | `.SWCLK` | SWD clock |
| 5 | `.GND` | Ground |
| 6 | `.SWO` | Unconnected on this programmer; SWO capture is not supported |

This uses the [TC2030 SWD signal positions](https://www.tag-connect.com/wp-content/uploads/bsk-pdf-manager/TC2030-CTX_1.pdf), with **pin 1 supplying power**, not sensing VTref. Set the selector to match the target's power input before connecting. SWD/reset logic remains 3.3 V in both switch positions. For a separately powered target, leave `.VOUT` unconnected on the target footprint. Do not join the programmer's VOUT to another supply. J4 shares all signals and the current monitor with the JST ports; connect only one target at a time.

Place `StandardTagConnectSwd` on the target's top side with the usual `pcbX`, `pcbY`, and `pcbRotation` props. It provides six 0.7874 mm pads on a 1.27 mm grid, three 0.9906 mm non-plated alignment holes, no solder paste, and a central routing keepout, following the [manufacturer's Rev B footprint](https://www.tag-connect.com/wp-content/uploads/bsk-pdf-manager/2019/12/TC2030-IDC-NL-Datasheet-Rev-B.pdf). Route each contact outward, keep unrelated tracks at least 0.508 mm from the contact pads, and keep the probe's 10.4 × 7.8 mm courtyard clear for access. Mark the footprint **DNL** in the assembly BOM. Hold the no-legs cable against the board during programming, or use a TC2030-CLIP with access to the board underside. There is no connector body to assemble or display in 3D.

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

Use straight-through JST SH cables: **1→1, 2→2, 3→3** for SWD and **1→1, 2→2** for power. Check contact numbers, not wire colors. The three-pin SWD connector accepts Raspberry Pi Debug Probe SWD cables. The separate power connector is this project's extension; the Raspberry Pi Debug Probe does not supply it. The three- and two-pin cables do not carry reset. The five-pin cable adds it.

## Use the programmer

```tsx
import { ProgrammerBoard } from "@tsci/tscircuit.standard-jst-programmer"

export default () => <ProgrammerBoard />
```

`ProgrammerBoard` contains a `<board>`; use it as the root circuit. USB-C and all three target connectors are on opposite edges. The default package preview displays the programmer and both connector example boards together.

Connect USB-C to your computer and the SWD cable to your target. Download the [v0.5.0 UF2 firmware](https://github.com/tscircuit/standard-jst-programmer/releases/download/v0.5.0/standard-jst-programmer.uf2). Hold BOOT while connecting USB, then copy the UF2 to the mounted drive. Use the [OpenOCD configuration](https://github.com/tscircuit/standard-jst-programmer/tree/main/firmware). Use `firmware/openocd.cfg` with the three-pin cable, or `firmware/openocd-reset.cfg` with the five-pin cable for hardware reset.

Before connecting target power, set `SW_PWR` to the labeled **3V3** or **5V** position. Disconnect the power cable before changing voltage. Both positions supply power; there is no OFF position. Leave the two-pin power cable unplugged when the target has another supply. With a five-pin cable, leave pin 1 disconnected on a separately powered target. The connectors share SWD signals and power: connect only one target at a time, using either the five-pin cable or the three-pin plus power pair. Keep combined target consumption at or below 50 mA; this output has no dedicated current limiter.

**SWD signal levels always remain 3.3 V**, including when the power output is set to 5 V. Use 5 V only with a compatible target power input; never connect it directly to a 3.3 V rail. Power the target before debugging.

## Read target current

Flash this version's custom firmware using BOOTSEL, then open the programmer's USB serial port at 115200 baud with DTR enabled. It streams CSV at approximately 10 samples per second:

```text
voltage_mV,current_uA,power_uW,status
3300,12000,39600,OK
```

That example means **3.3 V, 12 mA, and 39.6 mW**. Readings cover the combined target current delivered through the two-pin and five-pin power outputs, in either voltage setting. They exclude the programmer and its RGB LED. USB serial is used for telemetry, not UART passthrough.

Treat these as basic measurements: nominal current resolution is 0.1 mA, with shunt tolerance, sensor offset, and PCB trace resistance contributing to error. `SENSOR_ERROR` indicates unavailable data; `OVER_BUDGET` means the target exceeds the recommended 50 mA load. Neither status cuts off power.

## Read the RGB status

| Color | Meaning |
| --- | --- |
| Blue | USB not configured or suspended. |
| Green | USB ready, idle. |
| Amber | Recent SWD activity, including programming. |
| Red | SWD fault/protocol error, sensor error, or target load above 50 mA. |

Amber indicates traffic, and green indicates idle; neither verifies that a flash operation succeeded. Use your programming tool's result for that. The `XL-1615RGBC-2812B-S` replaces the previous single-color status LED.
