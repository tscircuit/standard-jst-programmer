import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["DO"],
  pin2: ["GND"],
  pin3: ["DI"],
  pin4: ["VDD"],
} as const

// Worldsemi V1.0 (2026-05-21), page 2: 0.7 mm square solder lands,
// 1.13 mm horizontal inner gap and 0.40 mm vertical gap. The local
// footprint is rotated 180 degrees from the datasheet's top-view drawing.
// Pin 1 is upper-left; the package polarity mark is toward negative Y.
export const WS2812C_2020_V6 = (props: ChipProps<typeof pinLabels>) => (
  <chip
    pinLabels={pinLabels}
    pinAttributes={{ pin2: { requiresGround: true }, pin4: { requiresPower: true } }}
    supplierPartNumbers={{ jlcpcb: ["C55109522"] }}
    manufacturerPartNumber="WS2812C-2020-V6"
    footprint={
      <footprint>
        <smtpad portHints={["pin1"]} pcbX={-0.915} pcbY={0.55} width={0.7} height={0.7} shape="rect" />
        <smtpad portHints={["pin2"]} pcbX={-0.915} pcbY={-0.55} width={0.7} height={0.7} shape="rect" />
        <smtpad portHints={["pin3"]} pcbX={0.915} pcbY={-0.55} width={0.7} height={0.7} shape="rect" />
        <smtpad portHints={["pin4"]} pcbX={0.915} pcbY={0.55} width={0.7} height={0.7} shape="rect" />
        <silkscreenpath route={[{ x: -1.1, y: 1.15 }, { x: 1.1, y: 1.15 }]} strokeWidth={0.1} />
        <silkscreenpath route={[{ x: -1.1, y: -1.15 }, { x: 1.1, y: -1.15 }]} strokeWidth={0.1} />
        <fabricationnotepath route={[{ x: -1.1, y: -1 }, { x: 1.1, y: -1 }, { x: 1.1, y: 1 }, { x: -1.1, y: 1 }, { x: -1.1, y: -1 }]} strokeWidth={0.1} />
        <fabricationnotepath route={[{ x: -0.35, y: -0.5 }, { x: 0.35, y: -0.5 }]} strokeWidth={0.1} />
        <courtyardrect width={3.03} height={2.5} />
      </footprint>
    }
    {...props}
  />
)
