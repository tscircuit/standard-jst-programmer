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

// The vertical KiCad footprint is rotated 180° relative to the EasyEDA import;
// its model therefore uses 0° instead of the importer's 180° rotation.
/** JST BM05B-SRSS-TB, top entry, 1 mm pitch. No implicit global-net connections. */
export function StandardJstSwdUpward(props: SwdConnectorProps) {
  return <JstShVertical
    cadModel={{
      objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C160391.obj?uuid=eaf9e23008df4ce1b5a7b451075b7284",
      stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C160391.step?uuid=eaf9e23008df4ce1b5a7b451075b7284",
      pcbRotationOffset: 0,
      modelOriginPosition: { x: 2.0000254, y: -0.432503, z: -0.01 },
    }}
    manufacturerPartNumber="BM05B-SRSS-TB(LF)(SN)"
    supplierPartNumbers={{jlcpcb: ["C160391"]}}
    schPinArrangement={{leftSide: {pins: ["V3_3", "SWDIO", "GND", "SWCLK", "nRESET"], direction: "top-to-bottom"}}}
    {...props} pinLabels={swdPinLabels}
  />
}

/** JST SM05B-SRSS-TB, side entry, 1 mm pitch; identical electrical pinout. */
export function StandardJstSwdSide(props: SwdConnectorProps) {
  return <JstShHorizontal
    cadModel={{
      objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C136657.obj?uuid=50fdec209daa46e6a009eae73d7d93b4",
      stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C136657.step?uuid=50fdec209daa46e6a009eae73d7d93b4",
      pcbRotationOffset: 0,
      modelOriginPosition: { x: 2, y: 0.5124965, z: -0.01 },
    }}
    manufacturerPartNumber="SM05B-SRSS-TB(LF)(SN)"
    supplierPartNumbers={{jlcpcb: ["C136657"]}}
    schPinArrangement={{leftSide: {pins: ["V3_3", "SWDIO", "GND", "SWCLK", "nRESET"], direction: "top-to-bottom"}}}
    {...props} pinLabels={swdPinLabels}
  />
}
