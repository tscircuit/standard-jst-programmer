import { JstSwdResetSide } from "./footprints/JstSwdResetSide"
import { JstSwdResetUpward } from "./footprints/JstSwdResetUpward"
import type { ChipProps } from "tscircuit"
import { JstSwdUpward } from "./footprints/JstSwdUpward"
import { JstSwdSide } from "./footprints/JstSwdSide"
import { JstPowerUpward } from "./footprints/JstPowerUpward"
import { JstPowerSide } from "./footprints/JstPowerSide"

export const swdPinLabels = { pin1: ["SWCLK"], pin2: ["GND"], pin3: ["SWDIO"] } as const
export const powerPinLabels = { pin1: ["VOUT"], pin2: ["GND"] } as const
export type SwdConnectorProps = Omit<ChipProps<typeof swdPinLabels>, "footprint" | "pinLabels">
export type PowerConnectorProps = Omit<ChipProps<typeof powerPinLabels>, "footprint" | "pinLabels">
export function StandardJstSwdUpward(props: SwdConnectorProps) {
 return <JstSwdUpward {...props} pinLabels={swdPinLabels} />
}
export function StandardJstSwdSide(props: SwdConnectorProps) {
 return <JstSwdSide {...props} pinLabels={swdPinLabels} />
}
export function StandardJstPowerUpward(props: PowerConnectorProps) {
 return <JstPowerUpward {...props} pinLabels={powerPinLabels} />
}
export function StandardJstPowerSide(props: PowerConnectorProps) {
 return <JstPowerSide {...props} pinLabels={powerPinLabels} />
}

/** Five-pin powered SWD extension; pin 1 follows the programmer's voltage selector. */
export const swdResetPinLabels = {pin1:["VOUT"], pin2:["SWDIO"], pin3:["GND"], pin4:["SWCLK"], pin5:["NRST", "nRESET"]} as const
export type SwdResetConnectorProps = Omit<ChipProps<typeof swdResetPinLabels>, "footprint" | "pinLabels">
export function StandardJstSwdResetSide(props: SwdResetConnectorProps) {
 return <JstSwdResetSide {...props} pinLabels={swdResetPinLabels} />
}
export function StandardJstSwdResetUpward(props: SwdResetConnectorProps) {
 return <JstSwdResetUpward {...props} pinLabels={swdResetPinLabels} />
}
