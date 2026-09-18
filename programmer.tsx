import { DiscreteRp2040Support } from "./rp2040/DiscreteRp2040Support";
import { StandardJstSwdSide } from "./connectors";

/** Discrete RP2040 + USB-C support circuit adapted from tscircuit/common. */
export function ProgrammerBoard({ previewPlacement = false }: { previewPlacement?: boolean } = {}) {
  return (
    <board
      placementDrcChecksDisabled={previewPlacement}
      doubleSidedAssembly={false}
      width={26}
      height={38}
      autorouter="auto-local"
      autorouterEffortLevel="10x"
      minViaEdgeToPadEdgeClearance={0.15}
      minViaPadDiameter={0.45}
      minViaHoleDiameter={0.2}
    >
      <DiscreteRp2040Support
        placementDrcChecksDisabled={previewPlacement}
        name="MCU"
        minViaEdgeToPadEdgeClearance={0.15}
        minViaPadDiameter={0.45}
        minViaHoleDiameter={0.2}
      >
        <schematicsection name="target" displayName="Target SWD" />
        <StandardJstSwdSide
          name="J1"
          pcbStyle={{ silkscreenTextVisibility: "hidden" }}
          pcbX={0}
          pcbY={-15.9}
          pcbRotation={0}
          schX={-14}
          schY={-2}
          schSectionName="target"
        />
        <resistor
          name="R_CLK"
          resistance="47"
          footprint="0603"
          pcbX={-9}
          pcbY={-1}
          schX={-19}
          schY={0}
          schSectionName="target"
        />
        <resistor
          name="R_DIO"
          resistance="47"
          footprint="0603"
          pcbX={-9}
          pcbY={1}
          schX={-19}
          schY={-1}
          schSectionName="target"
        />
        <resistor
          name="R_RST"
          resistance="100"
          footprint="0603"
          pcbX={-9}
          pcbY={3}
          schX={-19}
          schY={-2}
          schSectionName="target"
        />
        <resistor
          name="R_PULLUP"
          resistance="10k"
          footprint="0603"
          pcbX={-9}
          pcbY={5}
          schX={-16}
          schY={-5}
          schSectionName="target"
        />
        <capacitor
          name="C_TARGET"
          capacitance="100nF"
          footprint="0603"
          pcbX={-9}
          pcbY={-5}
          schX={-16}
          schY={3}
          schSectionName="target"
        />
        <pinheader
          name="JP_PWR"
          pinCount={2}
          pitch="2.54mm"
          pcbX={-9}
          pcbY={-13}
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
        <silkscreentext text="JST SWD" pcbX={0} pcbY={-11} fontSize={0.8} />
        <silkscreentext text="1:3V3" pcbX={8.2} pcbY={-11.7} fontSize={0.9} />
        <silkscreentext text="2:SWDIO" pcbX={8.2} pcbY={-13} fontSize={0.9} />
        <silkscreentext text="3:GND" pcbX={8.2} pcbY={-14.3} fontSize={0.9} />
        <silkscreentext text="4:SWCLK" pcbX={8.2} pcbY={-15.6} fontSize={0.9} />
        <silkscreentext text="5:nRESET" pcbX={8.2} pcbY={-16.9} fontSize={0.9} />
        <silkscreentext text="1" pcbX={-2} pcbY={-12.5} fontSize={0.65} />
        <silkscreentext text="2" pcbX={-1} pcbY={-12.5} fontSize={0.65} />
        <silkscreentext text="3" pcbX={0} pcbY={-12.5} fontSize={0.65} />
        <silkscreentext text="4" pcbX={1} pcbY={-12.5} fontSize={0.65} />
        <silkscreentext text="5" pcbX={2} pcbY={-12.5} fontSize={0.65} />
        <silkscreentext text="3V3 OUT" pcbX={-9} pcbY={-16} fontSize={0.7} />
        <silkscreentext text="OPEN=OFF" pcbX={-9} pcbY={-17.3} fontSize={0.65} />
      </DiscreteRp2040Support>
    </board>
  );
}
