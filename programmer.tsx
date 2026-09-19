import { TagConnectIdcHeader } from "./footprints/TagConnectIdcHeader";
import { INA219AIDCNR } from "./footprints/INA219AIDCNR";
import { XL_1615RGBC_2812B_S } from "./footprints/XL_1615RGBC_2812B_S";
import { SN74AHCT1G125DCKR } from "./footprints/SN74AHCT1G125DCKR";
import { JS102011SAQN } from "./footprints/PowerSelector";
import { DiscreteRp2040Support } from "./rp2040/DiscreteRp2040Support";
import {
  StandardJstSwdSide,
  StandardJstPowerSide,
  StandardJstSwdResetSide,
} from "./connectors";

/** Discrete RP2040 + USB-C support circuit adapted from tscircuit/common. */
export function ProgrammerBoard({
  previewPlacement = false,
}: {
  previewPlacement?: boolean;
} = {}) {
  return (
    <board
      pcbX={previewPlacement ? -11 : 0}
      placementDrcChecksDisabled={previewPlacement}
      doubleSidedAssembly={false}
      layers={4}
      width={26}
      height={42}
      autorouter="auto-local"
      minTraceToPadEdgeClearance={0.12}
      minViaEdgeToPadEdgeClearance={0.2}
      minViaPadDiameter={0.45}
      minViaHoleDiameter={0.2}
    >
      <DiscreteRp2040Support
        placementDrcChecksDisabled={previewPlacement}
        name="MCU"
        autorouter="auto-local"
        minTraceToPadEdgeClearance={0.12}
        minViaEdgeToPadEdgeClearance={0.2}
        minViaPadDiameter={0.45}
        minViaHoleDiameter={0.2}
      >
        <schematicsection name="target" displayName="Target SWD" />
        <StandardJstSwdSide
          name="J1"
          pcbStyle={{ silkscreenTextVisibility: "hidden" }}
          pcbX={-8.5}
          pcbY={-17.5}
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
        <StandardJstPowerSide
          name="J2"
          pcbX={-1.8}
          pcbY={-17.5}
          schX={-14}
          schY={4}
          schSectionName="target"
          pcbStyle={{ silkscreenTextVisibility: "hidden" }}
        />
        {/* Datasheet top view: actuator toward pin 1 selects 2–3. Rotation 270° makes that the upper (5 V) position. */}
        <JS102011SAQN
          name="SW_PWR"
          pcbX={-8.5}
          pcbY={-7}
          pcbRotation={270}
          schX={-19}
          schY={4}
          schSectionName="target"
          pcbStyle={{ silkscreenTextVisibility: "hidden" }}
        />
        <capacitor
          name="C_TARGET"
          capacitance="100nF"
          footprint="0402"
          pcbX={11}
          pcbY={-13.0}
          schX={-16}
          schY={6}
          schSectionName="target"
        />
        <trace
          name="T1"
          from=".U1 > .GPIO2"
          to=".R_CLK > .pin1"
          thickness={0.1}
        />
        <trace name="T2" from=".R_CLK > .pin2" to=".J1 > .SWCLK" />
        <trace
          name="T3"
          from=".U1 > .GPIO3"
          to=".R_DIO > .pin1"
          thickness={0.1}
        />
        <trace name="T4" from=".R_DIO > .pin2" to=".J1 > .SWDIO" />
        <trace from=".J1 > .GND" to="net.GND" />
        <trace from=".J2 > .GND" to="net.GND" />
        <trace from=".J2 > .VOUT" to="net.TARGET_POWER" />
        <trace from=".C_TARGET > .pin1" to="net.TARGET_POWER" />
        <trace from=".C_TARGET > .pin2" to="net.GND" />
        <trace from=".SW_PWR > .pin2" to="net.SELECTED_POWER" />
        <trace from=".SW_PWR > .pin3" to="net.VBUS" />
        <trace from=".SW_PWR > .pin1" to="net.V3V3" />
        <StandardJstSwdResetSide
          name="J3"
          pcbX={6.1}
          pcbY={-17.5}
          schX={-14}
          schY={-8}
          schSectionName="target"
          pcbStyle={{ silkscreenTextVisibility: "hidden" }}
        />
        <resistor
          name="R_NRST"
          resistance="100"
          footprint="0402"
          pcbX={-8.7}
          pcbY={3}
          schX={-19}
          schY={-8}
          schSectionName="target"
        />
        <trace
          name="NRST_GPIO"
          from=".U1 > .GPIO1"
          to=".R_NRST > .pin1"
          thickness={0.1}
        />
        <trace
          name="NRST_TARGET"
          from=".R_NRST > .pin2"
          to=".J3 > .NRST"
          thickness={0.1}
        />
        <trace from=".J3 > .VOUT" to="net.TARGET_POWER" />
        <trace
          name="SWCLK_PORTS"
          from=".J1 > .SWCLK"
          to=".J3 > .SWCLK"
          thickness={0.15}
        />
        <trace from=".J3 > .SWDIO" to=".J1 > .SWDIO" />
        <trace from=".J3 > .GND" to="net.GND" />

        <TagConnectIdcHeader
          name="J4"
          pcbX={9.5}
          pcbY={-8.5}
          pcbRotation={0}
          schX={-14}
          schY={-14}
          schSectionName="target"
          noConnect={["SWO"]}
        />
        <trace from=".J4 > .VOUT" to=".J3 > .VOUT" />
        <trace from=".J4 > .SWDIO" to=".R_DIO > .pin2" />
        <trace from=".J4 > .NRST" to=".R_NRST > .pin2" />
        <trace from=".J4 > .SWCLK" to=".J3 > .SWCLK" />
        <trace from=".J4 > .GND" to=".C_RGB > .pin2" />
        <silkscreentext
          text="TAG 1:VOUT 2:DIO"
          pcbX={0}
          pcbY={8}
          layer="bottom"
          fontSize={0.8}
        />
        <silkscreentext
          text="3:NRST 4:CLK"
          pcbX={0}
          pcbY={6.5}
          layer="bottom"
          fontSize={0.8}
        />
        <silkscreentext
          text="5:GND 6:NC"
          pcbX={0}
          pcbY={5}
          layer="bottom"
          fontSize={0.8}
        />
        <silkscreentext text="TAG" pcbX={9.5} pcbY={-4.3} fontSize={0.7} />
        <INA219AIDCNR
          name="U_SENSE"
          pcbX={3.4}
          pcbY={-10.5}
          schX={-23}
          schY={8}
        />
        <resistor
          name="R_SHUNT"
          resistance="0.1"
          footprint="0603"
          manufacturerPartNumber="RL0603FR-070R1L"
          supplierPartNumbers={{ jlcpcb: ["C326946"] }}
          pcbX={6.5}
          pcbY={-12.1}
          pcbRotation={90}
          schX={-23}
          schY={5}
        />
        <capacitor
          name="C_SENSE"
          capacitance="100nF"
          footprint="0402"
          pcbX={3.4}
          pcbY={-8}
          schX={-20}
          schY={9}
        />
        <resistor
          name="R_SDA"
          resistance="4.7k"
          footprint="0402"
          pcbX={0}
          pcbY={-12.3}
          schX={-26}
          schY={11}
        />
        <resistor
          name="R_SCL"
          resistance="4.7k"
          footprint="0402"
          pcbX={-0.1}
          pcbY={-10.8}
          schX={-24}
          schY={11}
        />
        <trace from=".R_SHUNT > .pin1" to="net.SELECTED_POWER" />
        <trace from=".R_SHUNT > .pin2" to="net.TARGET_POWER" />
        <trace
          from=".U_SENSE > .IN_POS"
          to=".R_SHUNT > .pin1"
          thickness={0.15}
        />
        <trace
          from=".U_SENSE > .IN_NEG"
          to=".R_SHUNT > .pin2"
          thickness={0.15}
        />
        <trace from=".U_SENSE > .VS" to="net.V3V3" />
        <trace from=".U_SENSE > .GND" to="net.GND" />
        <trace
          name="SENSE_GND_LINK"
          from=".U_SENSE > .GND"
          to=".U_SENSE > .A0"
          thickness={0.15}
        />
        <trace from=".U_SENSE > .A0" to="net.GND" />
        <trace from=".U_SENSE > .A1" to="net.GND" />
        <trace from=".U_SENSE > .SDA" to=".U1 > .GPIO18" />
        <trace from=".U_SENSE > .SCL" to=".U1 > .GPIO19" />
        <trace from=".R_SDA > .pin1" to=".U_SENSE > .SDA" />
        <trace from=".R_SDA > .pin2" to="net.V3V3" />
        <trace from=".R_SCL > .pin1" to=".U_SENSE > .SCL" />
        <trace from=".R_SCL > .pin2" to="net.V3V3" />
        <trace from=".C_SENSE > .pin1" to="net.V3V3" />
        <trace from=".C_SENSE > .pin2" to="net.GND" />

        <XL_1615RGBC_2812B_S
          name="D_RGB"
          pcbX={10.5}
          pcbY={4}
          schX={16}
          schY={-12}
          noConnect={["DO"]}
          pcbStyle={{ silkscreenTextVisibility: "hidden" }}
        />
        <SN74AHCT1G125DCKR
          name="U_RGB"
          pcbX={8.5}
          pcbY={1}
          schX={12}
          schY={-12}
        />
        <resistor
          name="R_RGB"
          resistance="100"
          footprint="0402"
          pcbX={11}
          pcbY={1.5}
          schX={14}
          schY={-12}
        />
        <resistor
          name="R_RGB_PD"
          resistance="100k"
          footprint="0402"
          pcbX={8.3}
          pcbY={-1.5}
          schX={10}
          schY={-15}
        />
        <capacitor
          name="C_RGB"
          capacitance="100nF"
          footprint="0402"
          pcbX={10.5}
          pcbY={6.7}
          schX={16}
          schY={-15}
        />
        <capacitor
          name="C_RGB_BUF"
          capacitance="100nF"
          footprint="0402"
          pcbX={11}
          pcbY={-0.3}
          schX={12}
          schY={-15}
        />
        <trace from=".U1 > .GPIO25" to=".U_RGB > .A" />
        <trace from=".R_RGB_PD > .pin1" to=".U_RGB > .A" />
        <trace from=".R_RGB_PD > .pin2" to="net.GND" />
        <trace from=".U_RGB > .N_OE" to="net.GND" />
        <trace from=".U_RGB > .GND" to="net.GND" />
        <trace from=".U_RGB > .VCC" to="net.VBUS" />
        <trace from=".U_RGB > .Y" to=".R_RGB > .pin1" />
        <trace from=".R_RGB > .pin2" to=".D_RGB > .DI" />
        <trace from=".D_RGB > .VDD" to="net.VBUS" />
        <trace from=".D_RGB > .GND" to="net.GND" />
        <trace from=".C_RGB > .pin1" to="net.VBUS" />
        <trace from=".C_RGB > .pin2" to="net.GND" />
        <trace from=".C_RGB_BUF > .pin1" to="net.VBUS" />
        <trace from=".C_RGB_BUF > .pin2" to="net.GND" />
        <silkscreentext text="5V" pcbX={-10.5} pcbY={-1.6} fontSize={0.9} />
        <silkscreentext text="3V3" pcbX={-10.5} pcbY={-12.2} fontSize={0.9} />
        <silkscreentext text="SWD" pcbX={-8.5} pcbY={-13} fontSize={0.7} />
        <silkscreentext
          text="1:CLK 2:GND"
          pcbX={-8.5}
          pcbY={-13.6}
          fontSize={0.55}
        />
        <silkscreentext text="3:DIO" pcbX={-8.5} pcbY={-14.5} fontSize={0.55} />
        <silkscreentext text="POWER" pcbX={-1.8} pcbY={-13} fontSize={0.7} />
        <silkscreentext
          text="1:VOUT"
          pcbX={-1.8}
          pcbY={-13.6}
          fontSize={0.55}
        />
        <silkscreentext text="2:GND" pcbX={-1.8} pcbY={-14.5} fontSize={0.55} />
        <silkscreentext text="5PIN" pcbX={10} pcbY={-13} fontSize={0.7} />
        <silkscreentext
          text="1:VOUT 2:DIO 3:GND"
          pcbX={6.1}
          pcbY={-13.6}
          fontSize={0.55}
        />
        <silkscreentext
          text="4:CLK 5:NRST"
          pcbX={6.1}
          pcbY={-14.5}
          fontSize={0.55}
        />
        <silkscreentext
          text="IO:3V3"
          pcbX={-1.8}
          pcbY={-20.5}
          fontSize={0.55}
        />
      </DiscreteRp2040Support>
    </board>
  );
}
