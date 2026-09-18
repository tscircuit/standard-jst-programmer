# Standard JST programmer

Importable five-pin JST SH (1 mm) SWD connectors and a USB-C RP2040 programmer board for 3.3 V targets.

## Install

```sh
tsci add tscircuit/standard-jst-programmer
```

## Choose a component

| Export | Use |
| --- | --- |
| `StandardJstSwdUpward` | Add an upward-facing programming connector to your board. |
| `StandardJstSwdSide` | Add a side-facing programming connector with the same pinout. |
| `ProgrammerBoard` | Use the complete 26 × 38 mm USB-C programmer board. |

Both connectors include their footprint, JLCPCB part number, and 3D model.

## Add a connector to your board

```tsx
import { StandardJstSwdUpward } from "@tsci/tscircuit.standard-jst-programmer"

export default () => (
  <board width={30} height={20}>
    <StandardJstSwdUpward name="J_DEBUG" pcbX={0} pcbY={5} />

    <trace from=".J_DEBUG > .V3_3" to="net.V3_3" />
    <trace from=".J_DEBUG > .SWDIO" to="net.SWDIO" />
    <trace from=".J_DEBUG > .GND" to="net.GND" />
    <trace from=".J_DEBUG > .SWCLK" to="net.SWCLK" />
    <trace from=".J_DEBUG > .nRESET" to="net.nRESET" />

    {/* Add your MCU and connect its power, SWD, and reset pins to these nets. */}
  </board>
)
```

The connector does not connect to global nets automatically. Use its `name` in trace selectors and wire all five signals explicitly. The net names above are examples; use the corresponding nets on your board.

### Use the side-facing connector

Replace the connector in the example with:

```tsx
import { StandardJstSwdSide } from "@tsci/tscircuit.standard-jst-programmer"

// Inside your <board>:
<StandardJstSwdSide
  name="J_DEBUG"
  pcbX={0}
  pcbY={5}
  pcbRotation={90}
/>
```

At `pcbRotation={0}`, the side connector opens toward −Y. Rotate it 90° to open toward +X, 180° toward +Y, or 270° toward −X. Keep the same traces and pin assignments when switching connector orientation.

Both connectors accept placement props such as `pcbX`, `pcbY`, `pcbRotation`, `schX`, and `schY`. The package also exports the `SwdConnectorProps` TypeScript type.

### Default import

The default export is the upward-facing connector:

```tsx
import StandardJstSwdUpward from "@tsci/tscircuit.standard-jst-programmer"
```

## Connect the pins

| Pin | Selector | Connect to |
| --- | --- | --- |
| 1 | `.V3_3` | Target's 3.3 V rail |
| 2 | `.SWDIO` | MCU SWD data |
| 3 | `.GND` | Target ground |
| 4 | `.SWCLK` | MCU SWD clock |
| 5 | `.nRESET` or `.nReset` | MCU active-low reset; `RUN` on an RP2040 |

This pinout is the convention used by this package. Use a five-way JST SH cable wired **1→1, 2→2, 3→3, 4→4, 5→5**; check contact numbers rather than relying on wire colors.

## Use the programmer board

```tsx
import { ProgrammerBoard } from "@tsci/tscircuit.standard-jst-programmer"

export default () => <ProgrammerBoard />
```

`ProgrammerBoard` already contains a `<board>`, so use it as the root circuit rather than placing it inside another board. USB-C and the target JST connector are on opposite edges.

For an assembled programmer, connect USB-C to your computer and the JST cable to your target's matching connector. Use this project's [custom firmware and OpenOCD configuration](firmware/).

Use **3.3 V targets only**. Leave `JP_PWR` open when the target has its own supply. Close it only when powering a small target from the programmer, with the target's other supplies disconnected; start with a target load of at most 50 mA. Power both boards before debugging.
