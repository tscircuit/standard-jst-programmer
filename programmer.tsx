import { RP2040_Zero } from "@tsci/piuzera.RP2040_Zero"
import { StandardJstSwdSide } from "./connectors"

/** USB-C and the RP2040 support circuitry are on the Waveshare RP2040-Zero module. */
export function ProgrammerBoard() {
  return <board width={42} height={34} autorouter="auto-local">
    <RP2040_Zero name="U1" pcbX={-9} pcbY={2} schX={-6} schY={0} />
    <StandardJstSwdSide name="J1" pcbX={17.5} pcbY={7} pcbRotation={90} schX={6} schY={0} />
    <resistor name="R_CLK" resistance="47" footprint="0603" pcbX={3} pcbY={7.8} schX={0} schY={1} />
    <resistor name="R_DIO" resistance="47" footprint="0603" pcbX={3} pcbY={5.3} schX={0} schY={0} />
    <resistor name="R_RST" resistance="100" footprint="0603" pcbX={3} pcbY={10.4} schX={0} schY={-1} />
    <resistor name="R_PULLUP" resistance="10k" footprint="0603" pcbX={9} pcbY={11} schX={3} schY={-2} />
    <capacitor name="C_TARGET" capacitance="100nF" footprint="0603" pcbX={9} pcbY={3} schX={3} schY={3} />
    <pinheader name="JP_PWR" pinCount={2} pitch="2.54mm" pcbX={5} pcbY={-7} schX={0} schY={4} />
    <trace name="T1" from=".U1 > .GP2" to=".R_CLK > .pin1" />
    <trace name="T2" from=".R_CLK > .pin2" to=".J1 > .SWCLK" />
    <trace name="T3" from=".U1 > .GP3" to=".R_DIO > .pin1" />
    <trace name="T4" from=".R_DIO > .pin2" to=".J1 > .SWDIO" />
    <trace name="T5" from=".U1 > .GP1" to=".R_RST > .pin1" />
    <trace name="T6" from=".R_RST > .pin2" to=".J1 > .nRESET" />
    <trace name="T7" from=".R_PULLUP > .pin1" to=".J1 > .nRESET" />
    <trace name="T8" from=".R_PULLUP > .pin2" to="net.TARGET_V3_3" />
    <trace name="T9" from=".U1 > .GND" to="net.GND" />
    <trace name="T10" from=".J1 > .GND" to="net.GND" />
    <trace name="T11" from=".C_TARGET > .pin2" to="net.GND" />
    <trace name="T12" from=".C_TARGET > .pin1" to="net.TARGET_V3_3" />
    <trace name="T13" from=".J1 > .V3_3" to="net.TARGET_V3_3" />
    <trace name="T14" from=".JP_PWR > .pin2" to="net.TARGET_V3_3" />
    <trace name="T15" from=".JP_PWR > .pin1" to=".U1 > .3V3" />
    <silkscreentext text="JST SWD v0.1" pcbX={8} pcbY={-13} fontSize={1.1} />
    <silkscreentext text="3V3 POWER" pcbX={6} pcbY={-9.5} fontSize={0.8} />
    <silkscreentext text="OPEN: EXT PWR" pcbX={7} pcbY={-11} fontSize={0.7} />
  </board>
}
