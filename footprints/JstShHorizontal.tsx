// Derived from KiCad Connector_JST footprints; see THIRD_PARTY.md.
import { type ChipProps } from "tscircuit"
export const JstShHorizontal = (props: ChipProps) => (
  <connector standard="jst_sh" pinCount={5}
    footprint={<footprint insertionDirection="from_y_neg">
        <smtpad portHints={["1"]} pcbX="-2mm" pcbY="2mm" layer="top" cornerRadius="0.075mm" width="0.6mm" height="1.55mm" shape="rect" />
<smtpad portHints={["2"]} pcbX="-1mm" pcbY="2mm" layer="top" cornerRadius="0.075mm" width="0.6mm" height="1.55mm" shape="rect" />
<smtpad portHints={["3"]} pcbX="0mm" pcbY="2mm" layer="top" cornerRadius="0.075mm" width="0.6mm" height="1.55mm" shape="rect" />
<smtpad portHints={["4"]} pcbX="1mm" pcbY="2mm" layer="top" cornerRadius="0.075mm" width="0.6mm" height="1.55mm" shape="rect" />
<smtpad portHints={["5"]} pcbX="2mm" pcbY="2mm" layer="top" cornerRadius="0.075mm" width="0.6mm" height="1.55mm" shape="rect" />
<smtpad portHints={[]} pcbX="-3.3mm" pcbY="-1.875mm" layer="top" cornerRadius="0.1249998mm" width="1.2mm" height="1.8mm" shape="rect" />
<smtpad portHints={[]} pcbX="3.3mm" pcbY="-1.875mm" layer="top" cornerRadius="0.1249998mm" width="1.2mm" height="1.8mm" shape="rect" />
<silkscreenpath route={[{"x":-3.61,"y":-0.715},{"x":-3.61,"y":1.785}]} />
<silkscreenpath route={[{"x":-3.61,"y":1.785},{"x":-2.56,"y":1.785}]} />
<silkscreenpath route={[{"x":-2.56,"y":1.785},{"x":-2.56,"y":2.775}]} />
<silkscreenpath route={[{"x":3.61,"y":-0.715},{"x":3.61,"y":1.785}]} />
<silkscreenpath route={[{"x":3.61,"y":1.785},{"x":2.56,"y":1.785}]} />
<silkscreenpath route={[{"x":-2.44,"y":-2.685},{"x":2.44,"y":-2.685}]} />
<fabricationnotepath route={[{"x":-3.5,"y":1.675},{"x":3.5,"y":1.675}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-3.5,"y":-2.575},{"x":3.5,"y":-2.575}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-3.5,"y":1.675},{"x":-3.5,"y":-2.575}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":3.5,"y":1.675},{"x":3.5,"y":-2.575}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-2.5,"y":1.675},{"x":-2,"y":0.967893}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-2,"y":0.967893},{"x":-1.5,"y":1.675}]} strokeWidth={0.1} />
<silkscreentext pcbX={0} pcbY={3.98} anchorAlignment="center" fontSize={1} font="tscircuit2024" layer="top" text="{NAME}" />
<courtyardoutline outline={[{"x":-4.4,"y":3.28},{"x":-4.4,"y":-3.28}]} layer="top" />
<courtyardoutline outline={[{"x":-4.4,"y":-3.28},{"x":4.4,"y":-3.28}]} layer="top" />
<courtyardoutline outline={[{"x":4.4,"y":-3.28},{"x":4.4,"y":3.28}]} layer="top" />
<courtyardoutline outline={[{"x":4.4,"y":3.28},{"x":-4.4,"y":3.28}]} layer="top" />
      </footprint>}
    {...props}
  />
)
