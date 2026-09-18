import { DiscreteRp2040Support } from "./rp2040/DiscreteRp2040Support";
import { StandardJstSwdSide } from "./connectors";

/** Discrete RP2040 + USB-C support circuit adapted from tscircuit/common. */
export function ProgrammerBoard() {
  return (
    <board
      width={46}
      height={70}
      autorouter="auto-local"
      autorouterEffortLevel="10x"
      minViaEdgeToPadEdgeClearance={0.15}
      minViaPadDiameter={0.45}
      minViaHoleDiameter={0.2}
    >
      <DiscreteRp2040Support
        name="MCU"
        minViaEdgeToPadEdgeClearance={0.15}
        minViaPadDiameter={0.45}
        minViaHoleDiameter={0.2}
      >
        <schematicsection name="target" displayName="Target SWD" />
        <StandardJstSwdSide
          name="J1"
          pcbX={-19.5}
          pcbY={3}
          pcbRotation={270}
          schX={-14}
          schY={-2}
          schSectionName="target"
        />
        <resistor
          name="R_CLK"
          resistance="47"
          footprint="0603"
          pcbX={-13}
          pcbY={4}
          schX={-19}
          schY={0}
          schSectionName="target"
        />
        <resistor
          name="R_DIO"
          resistance="47"
          footprint="0603"
          pcbX={-13}
          pcbY={2}
          schX={-19}
          schY={-1}
          schSectionName="target"
        />
        <resistor
          name="R_RST"
          resistance="100"
          footprint="0603"
          pcbX={-13}
          pcbY={6}
          schX={-19}
          schY={-2}
          schSectionName="target"
        />
        <resistor
          name="R_PULLUP"
          resistance="10k"
          footprint="0603"
          pcbX={-14}
          pcbY={8}
          schX={-16}
          schY={-5}
          schSectionName="target"
        />
        <capacitor
          name="C_TARGET"
          capacitance="100nF"
          footprint="0603"
          pcbX={-16}
          pcbY={-3}
          schX={-16}
          schY={3}
          schSectionName="target"
        />
        <pinheader
          name="JP_PWR"
          pinCount={2}
          pitch="2.54mm"
          pcbX={-16}
          pcbY={-18}
          schX={-19}
          schY={4}
          schSectionName="target"
        />
        <trace name="T1" from=".U1 > .GPIO2" to=".R_CLK > .pin1" />
        <trace name="T2" from=".R_CLK > .pin2" to=".J1 > .SWCLK" />
        <trace name="T3" from=".U1 > .GPIO3" to=".R_DIO > .pin1" />
        <trace name="T4" from=".R_DIO > .pin2" to=".J1 > .SWDIO" />
        <trace name="T5" from=".U1 > .GPIO1" to=".R_RST > .pin1" />
        <trace name="T6" from=".R_RST > .pin2" to=".J1 > .nRESET" />
        <trace name="T7" from=".R_PULLUP > .pin1" to=".J1 > .nRESET" />
        <trace name="T8" from=".R_PULLUP > .pin2" to="net.TARGET_V3_3" />
        <trace name="T10" from=".J1 > .GND" to="net.GND" />
        <trace name="T11" from=".C_TARGET > .pin2" to="net.GND" />
        <trace name="T12" from=".C_TARGET > .pin1" to="net.TARGET_V3_3" />
        <trace name="T13" from=".J1 > .V3_3" to="net.TARGET_V3_3" />
        <trace name="T14" from=".JP_PWR > .pin2" to="net.TARGET_V3_3" />
        <trace name="T15" from=".JP_PWR > .pin1" to="net.V3V3" />
        <silkscreentext
          text="JST SWD v0.2"
          pcbX={0}
          pcbY={-23}
          fontSize={1.1}
        />
        <silkscreentext text="3V3 POWER" pcbX={-16} pcbY={-21} fontSize={0.8} />
        <silkscreentext
          text="OPEN: EXT PWR"
          pcbX={-15}
          pcbY={-22.5}
          fontSize={0.7}
        />
      </DiscreteRp2040Support>
    </board>
  );
}
