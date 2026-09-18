import type { ChipProps } from "@tscircuit/props"

const pinLabels = {pin1: ["pin1"],pin2: ["pin2"],pin3: ["pin3"]} as const

export const JstSwdUpward = (props: ChipProps) => {
  return (
    <connector standard="jst_sh" pinCount={3}
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C160389"
  ]
}}
      manufacturerPartNumber="BM03B-SRSS-TB(LF)(SN)"
      footprint={<footprint>
        <smtpad portHints={[]} pcbX="-2.299843mm" pcbY="-1.2000103mm" width="1.1999976mm" height="1.7999964mm" shape="rect" />
<smtpad portHints={[]} pcbX="2.299843mm" pcbY="-1.1997563mm" width="1.1999976mm" height="1.7999964mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="1.000125mm" pcbY="1.3250037mm" width="0.5999988mm" height="1.5500096mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="0.000127mm" pcbY="1.3250037mm" width="0.5999988mm" height="1.5500096mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-0.999871mm" pcbY="1.3250037mm" width="0.5999988mm" height="1.5500096mm" shape="rect" />
<silkscreenpath route={[{"x":-1.5002509999999347,"y":2.0260437000000593},{"x":-2.8007563999999547,"y":2.0260437000000593},{"x":-2.799816599999872,"y":-0.03752849999978025}]} />
<silkscreenpath route={[{"x":-2.8007563999999547,"y":-2.2741508999998814},{"x":2.8011374000002434,"y":-2.2741508999998814}]} />
<silkscreenpath route={[{"x":1.5001240000001417,"y":2.0625181000001476},{"x":2.800146800000107,"y":2.0625181000001476},{"x":2.800146800000107,"y":-0.03752849999978025}]} />
<silkscreencircle pcbX="1.524mm" pcbY="2.3484967mm" radius="0.127mm" />
<silkscreentext text="{NAME}" pcbX="-0.013843mm" pcbY="3.4829897mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-3.1594429999998965,"y":2.7329897000000756},{"x":3.131757000000107,"y":2.7329897000000756},{"x":3.131757000000107,"y":-2.5168102999997473},{"x":-3.1594429999998965,"y":-2.5168102999997473},{"x":-3.1594429999998965,"y":2.7329897000000756}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C160389.obj?uuid=bb01000407ec457b89090f9b882df046",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C160389.step?uuid=bb01000407ec457b89090f9b882df046",
        pcbRotationOffset: 180,
        modelOriginPosition: { x: 1.0000000000002274, y: -0.43250299999996966, z: -0.01 },
      }}
      {...props}
    />
  )
}