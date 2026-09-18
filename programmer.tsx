import { JS102011SAQN } from "./footprints/PowerSelector";
import { DiscreteRp2040Support } from "./rp2040/DiscreteRp2040Support";
import { StandardJstSwdSide, StandardJstPowerSide } from "./connectors";

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
          pcbX={-4.5}
          pcbY={-15.9}
          pcbRotation={0}
          schX={-14}
          schY={-2}
          schSectionName="target"
        />
        <resistor
          name="R_CLK"
          resistance="100"
          footprint="0402"
          pcbX={-6.5}
          pcbY={1.8}
          schX={-19}
          schY={0}
          schSectionName="target"
        />
        <resistor
          name="R_DIO"
          resistance="100"
          footprint="0402"
          pcbX={-6.5}
          pcbY={0.6}
          schX={-19}
          schY={-1}
          schSectionName="target"
        />
        <StandardJstPowerSide name="J2" pcbX={4.5} pcbY={-15.9} schX={-14} schY={4} schSectionName="target" pcbStyle={{silkscreenTextVisibility:"hidden"}} />
        {/* Datasheet top view: actuator toward pin 1 selects 2–3. Rotation 270° makes that the upper (5 V) position. */}
        <JS102011SAQN name="SW_PWR" pcbX={-8.5} pcbY={-7} pcbRotation={270} schX={-19} schY={4} schSectionName="target" pcbStyle={{silkscreenTextVisibility:"hidden"}} />
        <capacitor name="C_TARGET" capacitance="100nF" footprint="0603" pcbX={10} pcbY={-15} schX={-16} schY={6} schSectionName="target" />
        <trace name="T1" from=".U1 > .GPIO2" to=".R_CLK > .pin1" />
        <trace name="T2" from=".R_CLK > .pin2" to=".J1 > .SWCLK" />
        <trace name="T3" from=".U1 > .GPIO3" to=".R_DIO > .pin1" />
        <trace name="T4" from=".R_DIO > .pin2" to=".J1 > .SWDIO" />
        <trace from=".J1 > .GND" to="net.GND" />
        <trace from=".J2 > .GND" to="net.GND" />
        <trace from=".J2 > .VOUT" to="net.TARGET_POWER" />
        <trace from=".C_TARGET > .pin1" to="net.TARGET_POWER" />
        <trace from=".C_TARGET > .pin2" to="net.GND" />
        <trace from=".SW_PWR > .pin2" to="net.TARGET_POWER" />
        <trace from=".SW_PWR > .pin3" to="net.VBUS" />
        <trace from=".SW_PWR > .pin1" to="net.V3V3" />
        <silkscreentext text="5V" pcbX={-10.5} pcbY={-1.6} fontSize={0.9} />
        <silkscreentext text="3V3" pcbX={-10.5} pcbY={-12.2} fontSize={0.9} />
        <silkscreentext text="SWD" pcbX={-3.8} pcbY={-11} fontSize={0.9} />
        <silkscreentext text="1:CLK 2:GND 3:DIO" pcbX={-3.8} pcbY={-12.2} fontSize={0.65} />
        <silkscreentext text="POWER" pcbX={6.5} pcbY={-11} fontSize={0.9} />
        <silkscreentext text="1:VOUT 2:GND" pcbX={6.5} pcbY={-12.2} fontSize={0.65} />
        <silkscreentext text="IO:3V3" pcbX={8.5} pcbY={-9.6} fontSize={0.7} />
      </DiscreteRp2040Support>
    </board>
  );
}
