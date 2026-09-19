import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["DO"],
  pin2: ["VDD"],
  pin3: ["GND"],
  pin4: ["DI"]
} as const

const pinAttributes = {
  pin2: {requiresPower: true},
  pin3: {requiresGround: true}
} as const

export const XL_1615RGBC_2812B_S = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C41413180"
  ]
}}
      manufacturerPartNumber="XL-1615RGBC-2812B-S"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="0.6249924mm" pcbY="0.4750054mm" width="0.4500118mm" height="0.6500114mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="0.6249924mm" pcbY="-0.4750054mm" width="0.4500118mm" height="0.6500114mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-0.6249924mm" pcbY="-0.4750054mm" width="0.4500118mm" height="0.6500114mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-0.6249924mm" pcbY="0.4750054mm" width="0.4500118mm" height="0.6500114mm" shape="rect" />
<silkscreenpath route={[{"x":-0.7620253999999704,"y":1.0159745999998222},{"x":0.7619746000000305,"y":1.0159745999998222}]} />
<silkscreenpath route={[{"x":0.7619746000000305,"y":-1.0160254000001032},{"x":-0.7620253999999704,"y":-1.0160254000001032}]} />
<silkscreentext text="{NAME}" pcbX="0.354838mm" pcbY="2.313942mm" anchorAlignment="center" fontSize="1mm" />
<fabricationnotepath route={[{"x":-0.9999979999998914,"y":-0.39999920000013844},{"x":-0.36499799999990046,"y":-0.39999920000013844},{"x":-0.36499799999990046,"y":-0.5269992000002048},{"x":-0.9999979999998914,"y":-0.5269992000002048},{"x":-0.9999979999998914,"y":-0.39999920000013844}]} strokeWidth="0.254mm" />
<fabricationnotepath route={[{"x":0.44452540000008867,"y":0.444525399999975},{"x":0.44452540000008867,"y":0.3175253999999086},{"x":0.6985254000001078,"y":0.3175253999999086},{"x":0.6985254000001078,"y":0.06352539999988949},{"x":0.8255254000000605,"y":0.06352539999988949},{"x":0.8255254000000605,"y":0.3175253999999086},{"x":1.0795254000000796,"y":0.3175253999999086},{"x":1.0795254000000796,"y":0.444525399999975},{"x":0.8255254000000605,"y":0.444525399999975},{"x":0.8255254000000605,"y":0.6985253999998804},{"x":0.6985254000001078,"y":0.6985253999998804},{"x":0.6985254000001078,"y":0.444525399999975},{"x":0.44452540000008867,"y":0.444525399999975}]} strokeWidth="0.254mm" />
<fabricationnotepath route={[{"x":-0.6599935999998934,"y":0.040004999999950996},{"x":-0.5800090000000182,"y":0.040004999999950996},{"x":-0.5800090000000182,"y":-0.04000500000006468},{"x":-0.6599935999998934,"y":-0.04000500000006468},{"x":-0.6599935999998934,"y":0.040004999999950996}]} strokeWidth="0.254mm" />
<fabricationnotepath route={[{"x":0.010007599999994454,"y":0.37000179999984084},{"x":0.129997200000048,"y":0.37000179999984084},{"x":0.129997200000048,"y":-0.31998920000012276},{"x":0.010007599999994454,"y":-0.31998920000012276},{"x":0.010007599999994454,"y":-0.049987200000146004},{"x":-0.09999979999997777,"y":-0.049987200000146004},{"x":-0.09999979999997777,"y":0.08000999999990199},{"x":0.010007599999994454,"y":0.08000999999990199},{"x":0.010007599999994454,"y":0.37000179999984084}]} strokeWidth="0.254mm" />
<courtyardrect width={2.2} height={2.1} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C41413180.obj?uuid=7651a5d35ba24a0994248e32765d9a4a",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C41413180.step?uuid=7651a5d35ba24a0994248e32765d9a4a",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.000012699999842880061, z: -0.02 },
      }}
      {...props}
    />
  )
}