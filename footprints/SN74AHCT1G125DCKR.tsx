import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["N_OE"],
  pin2: ["A"],
  pin3: ["GND"],
  pin4: ["Y"],
  pin5: ["VCC"]
} as const

const pinAttributes = {
  pin3: {requiresGround: true},
  pin5: {requiresPower: true}
} as const

export const SN74AHCT1G125DCKR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C350557"
  ]
}}
      manufacturerPartNumber="SN74AHCT1G125DCKR"
      footprint={<footprint>
        <smtpad portHints={["pin5"]} pcbX="-0.649986mm" pcbY="1.099947mm" width="0.350012mm" height="0.850011mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="0.649986mm" pcbY="1.099947mm" width="0.350012mm" height="0.850011mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="0.649986mm" pcbY="-1.099947mm" width="0.350012mm" height="0.850011mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="0mm" pcbY="-1.099947mm" width="0.350012mm" height="0.850011mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-0.649986mm" pcbY="-1.099947mm" width="0.350012mm" height="0.850011mm" shape="rect" />
<silkscreenpath route={[{"x":-1.000048799999945,"y":0.5000243999999157},{"x":-1.000048799999945,"y":-0.48999140000000807},{"x":0.9999472000000651,"y":-0.48999140000000807},{"x":0.9999472000000651,"y":0.49004219999983434},{"x":0.9899649999999838,"y":0.5000243999999157},{"x":-1.000048799999945,"y":0.5000243999999157}]} />
<silkscreencircle pcbX="-0.780034mm" pcbY="-0.259969mm" radius="0.050038mm" />
<silkscreencircle pcbX="-1.070102mm" pcbY="-0.909955mm" radius="0.050038mm" />
<silkscreentext text="{NAME}" pcbX="-0.05461mm" pcbY="2.530731mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.3587099999999737,"y":1.7807309999998324},{"x":1.249490000000037,"y":1.7807309999998324},{"x":1.249490000000037,"y":-1.7672690000001694},{"x":-1.3587099999999737,"y":-1.7672690000001694},{"x":-1.3587099999999737,"y":1.7807309999998324}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C350557.obj?uuid=4e343cd4ee3f40efaa150725a58cf9ea",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C350557.step?uuid=4e343cd4ee3f40efaa150725a58cf9ea",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.00005079999993995443, y: -0.000025399999913133797, z: -0.5 },
      }}
      {...props}
    />
  )
}