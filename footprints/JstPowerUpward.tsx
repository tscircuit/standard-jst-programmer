import type { ChipProps } from "@tscircuit/props"

const pinLabels = {pin1: ["pin1"],pin2: ["pin2"]} as const

export const JstPowerUpward = (props: ChipProps) => {
  return (
    <connector standard="jst_sh" pinCount={2}
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C160388"
  ]
}}
      manufacturerPartNumber="BM02B-SRSS-TB(LF)(SN)"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="0.502031mm" pcbY="1.3125577mm" width="0.5999988mm" height="1.5500096mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-0.497967mm" pcbY="1.3125577mm" width="0.5999988mm" height="1.5500096mm" shape="rect" />
<smtpad portHints={[]} pcbX="1.799971mm" pcbY="-1.1875643mm" width="1.1999976mm" height="1.7999964mm" shape="rect" />
<smtpad portHints={[]} pcbX="-1.799971mm" pcbY="-1.1875643mm" width="1.1999976mm" height="1.7999964mm" shape="rect" />
<silkscreenpath route={[{"x":-0.9999979999998914,"y":-1.9374993000000131},{"x":0.999998000000005,"y":-1.9374993000000131}]} />
<silkscreenpath route={[{"x":-1.99999600000001,"y":1.3140816999999743},{"x":-1.0291063999999324,"y":1.3140816999999743}]} />
<silkscreenpath route={[{"x":1.0331704000000173,"y":1.3140816999999743},{"x":1.9999960000001238,"y":1.3140816999999743}]} />
<silkscreenpath route={[{"x":1.9999960000001238,"y":1.3140816999999743},{"x":1.9999960000001238,"y":-0.056299100000046565}]} />
<silkscreenpath route={[{"x":-1.99999600000001,"y":1.3140816999999743},{"x":-1.99999600000001,"y":-0.056299100000046565}]} />
<silkscreencircle pcbX="1.3199872mm" pcbY="1.9024981mm" radius="0.152654mm" />
<silkscreentext text="{NAME}" pcbX="0.011303mm" pcbY="3.0760817mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.638996999999904,"y":2.326081699999918},{"x":2.6616030000000137,"y":2.326081699999918},{"x":2.6616030000000137,"y":-2.339518299999895},{"x":-2.638996999999904,"y":-2.339518299999895},{"x":-2.638996999999904,"y":2.326081699999918}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C160388.obj?uuid=868d8c16cff34c5e9973dfa3b6ac90ae",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C160388.step?uuid=868d8c16cff34c5e9973dfa3b6ac90ae",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0.34950469999998857, z: -0.05 },
      }}
      {...props}
    />
  )
}