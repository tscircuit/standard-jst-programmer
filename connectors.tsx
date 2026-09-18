import type { ChipProps } from "tscircuit"
import { JstShVertical } from "./footprints/JstShVertical"
import { JstShHorizontal } from "./footprints/JstShHorizontal"

export const swdPinLabels = {
  pin1: ["V3_3"],
  pin2: ["SWDIO"],
  pin3: ["GND"],
  pin4: ["SWCLK"],
  pin5: ["nRESET", "nReset"],
} as const
export type SwdConnectorProps = Omit<ChipProps<typeof swdPinLabels>, "footprint" | "pinLabels">

/** JST BM05B-SRSS-TB, top entry, 1 mm pitch. No implicit global-net connections. */
export function StandardJstSwdUpward(props: SwdConnectorProps) {
  return <JstShVertical
    manufacturerPartNumber="BM05B-SRSS-TB(LF)(SN)"
    supplierPartNumbers={{jlcpcb: ["C160391"]}}
    schPinArrangement={{leftSide: {pins: ["V3_3", "SWDIO", "GND", "SWCLK", "nRESET"], direction: "top-to-bottom"}}}
    {...props} pinLabels={swdPinLabels}
  />
}

/** JST SM05B-SRSS-TB, side entry, 1 mm pitch; identical electrical pinout. */
export function StandardJstSwdSide(props: SwdConnectorProps) {
  return <JstShHorizontal
    manufacturerPartNumber="SM05B-SRSS-TB(LF)(SN)"
    supplierPartNumbers={{jlcpcb: ["C136657"]}}
    schPinArrangement={{leftSide: {pins: ["V3_3", "SWDIO", "GND", "SWCLK", "nRESET"], direction: "top-to-bottom"}}}
    {...props} pinLabels={swdPinLabels}
  />
}
