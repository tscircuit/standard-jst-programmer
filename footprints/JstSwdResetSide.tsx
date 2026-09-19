import type { ChipProps } from "@tscircuit/props"

const pinLabels = {pin1: ["pin1"],pin2: ["pin2"],pin3: ["pin3"],pin4: ["pin4"],pin5: ["pin5"]} as const

export const JstSwdResetSide = (props: ChipProps) => {
  return (
    <connector standard="jst_sh" pinCount={5}
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C136657"
  ]
}}
      manufacturerPartNumber="SM05B-SRSS-TB(LF)(SN)"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-1.999615mm" pcbY="1.9998817mm" width="0.5999988mm" height="1.5500096mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-0.998855mm" pcbY="1.9998817mm" width="0.5999988mm" height="1.5500096mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="0.000635mm" pcbY="1.9998817mm" width="0.5999988mm" height="1.5500096mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="1.000125mm" pcbY="1.9998817mm" width="0.5999988mm" height="1.5500096mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="2.000885mm" pcbY="1.9998817mm" width="0.5999988mm" height="1.5500096mm" shape="rect" />
<smtpad portHints={[]} pcbX="-3.300095mm" pcbY="-1.8748883mm" width="1.1999976mm" height="1.7999964mm" shape="rect" />
<smtpad portHints={[]} pcbX="3.300095mm" pcbY="-1.8748883mm" width="1.1999976mm" height="1.7999964mm" shape="rect" />
<silkscreenpath route={[{"x":2.9635449999999963,"y":0.4098417000000012},{"x":3.4639250000000033,"y":0.4098417000000012},{"x":2.9635449999999963,"y":0.4098417000000012}]} />
<silkscreenpath route={[{"x":2.9635449999999963,"y":1.108341700000011},{"x":3.4639250000000033,"y":1.108341700000011},{"x":2.9635449999999963,"y":1.108341700000011}]} />
<silkscreenpath route={[{"x":2.9635449999999963,"y":1.6087216999999896},{"x":2.9635449999999963,"y":0.4098417000000012},{"x":2.9635449999999963,"y":1.6087216999999896}]} />
<silkscreenpath route={[{"x":3.4639250000000033,"y":-0.7407783000000023},{"x":3.4639250000000033,"y":1.6087216999999896},{"x":2.564764999999994,"y":1.6087216999999896}]} />
<silkscreenpath route={[{"x":-2.3983949999999936,"y":-2.5746582999999816},{"x":2.399664999999999,"y":-2.5746582999999816}]} />
<silkscreenpath route={[{"x":-3.500754999999998,"y":-0.6747382999999871},{"x":-3.500754999999998,"y":1.6747617000000048},{"x":-2.599054999999993,"y":1.6747617000000048}]} />
<silkscreenpath route={[{"x":-3.000374999999991,"y":1.6747617000000048},{"x":-3.000374999999991,"y":0.4758817000000022},{"x":-3.000374999999991,"y":1.6747617000000048}]} />
<silkscreenpath route={[{"x":-3.000374999999991,"y":1.1743816999999979},{"x":-3.500754999999998,"y":1.1743816999999979},{"x":-3.000374999999991,"y":1.1743816999999979}]} />
<silkscreenpath route={[{"x":-3.000374999999991,"y":0.4758817000000022},{"x":-3.500754999999998,"y":0.4758817000000022},{"x":-3.000374999999991,"y":0.4758817000000022}]} />
<silkscreenpath route={[{"x":-2.749600799999996,"y":2.249868499999991},{"x":-2.6480318362365978,"y":2.439960543897172},{"x":-2.4363364976885435,"y":2.4804120357115096},{"x":-2.2718356035995413,"y":2.3411615585241776},{"x":-2.2767775492432207,"y":2.1256927284669302},{"x":-2.44748974105822,"y":1.9941306248097561},{"x":-2.6571078746369494,"y":2.044245269654823},{"x":-2.7498548000000085,"y":2.238794100000007}]} />
<silkscreentext text="{NAME}" pcbX="-0.005715mm" pcbY="3.7618817mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.154614999999993,"y":3.0118817000000035},{"x":4.143185000000003,"y":3.0118817000000035},{"x":4.143185000000003,"y":-3.0253183000000092},{"x":-4.154614999999993,"y":-3.0253183000000092},{"x":-4.154614999999993,"y":3.0118817000000035}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C136657.obj?uuid=50fdec209daa46e6a009eae73d7d93b4",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C136657.step?uuid=50fdec209daa46e6a009eae73d7d93b4",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 2, y: 0.5124965000000032, z: -0.01 },
      }}
      {...props}
    />
  )
}