// Derived from KiCad Connector_JST footprints; see THIRD_PARTY.md.
import { type ChipProps } from "tscircuit"
export const JstShVertical = (props: ChipProps) => (
  <connector standard="jst_sh" pinCount={5}
    footprint={<footprint insertionDirection="from_above">
        <smtpad portHints={["1"]} pcbX="-2mm" pcbY="-1.325mm" layer="top" cornerRadius="0.075mm" width="0.6mm" height="1.55mm" shape="rect" />
<smtpad portHints={["2"]} pcbX="-1mm" pcbY="-1.325mm" layer="top" cornerRadius="0.075mm" width="0.6mm" height="1.55mm" shape="rect" />
<smtpad portHints={["3"]} pcbX="0mm" pcbY="-1.325mm" layer="top" cornerRadius="0.075mm" width="0.6mm" height="1.55mm" shape="rect" />
<smtpad portHints={["4"]} pcbX="1mm" pcbY="-1.325mm" layer="top" cornerRadius="0.075mm" width="0.6mm" height="1.55mm" shape="rect" />
<smtpad portHints={["5"]} pcbX="2mm" pcbY="-1.325mm" layer="top" cornerRadius="0.075mm" width="0.6mm" height="1.55mm" shape="rect" />
<smtpad portHints={[]} pcbX="-3.3mm" pcbY="1.2mm" layer="top" cornerRadius="0.1249998mm" width="1.2mm" height="1.8mm" shape="rect" />
<smtpad portHints={[]} pcbX="3.3mm" pcbY="1.2mm" layer="top" cornerRadius="0.1249998mm" width="1.2mm" height="1.8mm" shape="rect" />
<silkscreenpath route={[{"x":-3.61,"y":0.04},{"x":-3.61,"y":-1.11}]} />
<silkscreenpath route={[{"x":-3.61,"y":-1.11},{"x":-2.56,"y":-1.11}]} />
<silkscreenpath route={[{"x":-2.56,"y":-1.11},{"x":-2.56,"y":-2.1}]} />
<silkscreenpath route={[{"x":3.61,"y":0.04},{"x":3.61,"y":-1.11}]} />
<silkscreenpath route={[{"x":3.61,"y":-1.11},{"x":2.56,"y":-1.11}]} />
<silkscreenpath route={[{"x":-2.44,"y":2.01},{"x":2.44,"y":2.01}]} />
<fabricationnotepath route={[{"x":-3.5,"y":-1},{"x":3.5,"y":-1}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-3.5,"y":1.9},{"x":3.5,"y":1.9}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-3.5,"y":-1},{"x":-3.5,"y":1.9}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":3.5,"y":-1},{"x":3.5,"y":1.9}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-2.15,"y":1.55},{"x":-2.15,"y":0.95}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-2.15,"y":0.95},{"x":-1.85,"y":0.95}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-1.85,"y":0.95},{"x":-1.85,"y":1.55}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-1.85,"y":1.55},{"x":-2.15,"y":1.55}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-1.15,"y":1.55},{"x":-1.15,"y":0.95}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-1.15,"y":0.95},{"x":-0.85,"y":0.95}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-0.85,"y":0.95},{"x":-0.85,"y":1.55}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-0.85,"y":1.55},{"x":-1.15,"y":1.55}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-0.15,"y":1.55},{"x":-0.15,"y":0.95}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-0.15,"y":0.95},{"x":0.15,"y":0.95}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":0.15,"y":0.95},{"x":0.15,"y":1.55}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":0.15,"y":1.55},{"x":-0.15,"y":1.55}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":0.85,"y":1.55},{"x":0.85,"y":0.95}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":0.85,"y":0.95},{"x":1.15,"y":0.95}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":1.15,"y":0.95},{"x":1.15,"y":1.55}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":1.15,"y":1.55},{"x":0.85,"y":1.55}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":1.85,"y":1.55},{"x":1.85,"y":0.95}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":1.85,"y":0.95},{"x":2.15,"y":0.95}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":2.15,"y":0.95},{"x":2.15,"y":1.55}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":2.15,"y":1.55},{"x":1.85,"y":1.55}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-2.5,"y":-1},{"x":-2,"y":-0.292893}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-2,"y":-0.292893},{"x":-1.5,"y":-1}]} strokeWidth={0.1} />
<silkscreentext pcbX={0} pcbY={3.3} anchorAlignment="center" fontSize={1} font="tscircuit2024" layer="top" text="{NAME}" />
<courtyardoutline outline={[{"x":-4.4,"y":2.6},{"x":-4.4,"y":-2.6}]} layer="top" />
<courtyardoutline outline={[{"x":-4.4,"y":-2.6},{"x":4.4,"y":-2.6}]} layer="top" />
<courtyardoutline outline={[{"x":4.4,"y":-2.6},{"x":4.4,"y":2.6}]} layer="top" />
<courtyardoutline outline={[{"x":4.4,"y":2.6},{"x":-4.4,"y":2.6}]} layer="top" />
      </footprint>}
    {...props}
  />
)
