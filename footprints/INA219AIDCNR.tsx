import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["IN_POS"],
  pin2: ["IN_NEG"],
  pin3: ["GND"],
  pin4: ["VS"],
  pin5: ["SCL"],
  pin6: ["SDA"],
  pin7: ["A0"],
  pin8: ["A1"]
} as const

const pinAttributes = {
  pin3: {requiresGround: true}
} as const

export const INA219AIDCNR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C87469"
  ]
}}
      manufacturerPartNumber="INA219AIDCNR"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="1.226058mm" pcbY="-0.975106mm" width="1.2519914mm" height="0.3640074mm" radius="0.1820037mm" shape="pill" />
<smtpad portHints={["pin2"]} pcbX="1.226058mm" pcbY="-0.32512mm" width="1.2519914mm" height="0.3640074mm" radius="0.1820037mm" shape="pill" />
<smtpad portHints={["pin3"]} pcbX="1.226058mm" pcbY="0.324866mm" width="1.2519914mm" height="0.3640074mm" radius="0.1820037mm" shape="pill" />
<smtpad portHints={["pin4"]} pcbX="1.226058mm" pcbY="0.975106mm" width="1.2519914mm" height="0.3640074mm" radius="0.1820037mm" shape="pill" />
<smtpad portHints={["pin8"]} pcbX="-1.226058mm" pcbY="-0.975106mm" width="1.2519914mm" height="0.3640074mm" radius="0.1820037mm" shape="pill" />
<smtpad portHints={["pin7"]} pcbX="-1.226058mm" pcbY="-0.32512mm" width="1.2519914mm" height="0.3640074mm" radius="0.1820037mm" shape="pill" />
<smtpad portHints={["pin6"]} pcbX="-1.226058mm" pcbY="0.324866mm" width="1.2519914mm" height="0.3640074mm" radius="0.1820037mm" shape="pill" />
<smtpad portHints={["pin5"]} pcbX="-1.226058mm" pcbY="0.975106mm" width="1.2519914mm" height="0.3640074mm" radius="0.1820037mm" shape="pill" />
<silkscreenpath route={[{"x":0.37139879999995173,"y":-1.5262097999999469},{"x":-0.3713988000000654,"y":-1.5262097999999469},{"x":-0.3713988000000654,"y":1.5262098000000606},{"x":0.37139879999995173,"y":1.5262098000000606},{"x":0.37139879999995173,"y":-1.5262097999999469}]} />
<silkscreencircle pcbX="1.226058mm" pcbY="-1.609344mm" radius="0.150114mm" />
<silkscreentext text="{NAME}" pcbX="0.1397mm" pcbY="2.524mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.9263999999999442,"y":1.774000000000001},{"x":2.205799999999954,"y":1.774000000000001},{"x":2.205799999999954,"y":-2.0026000000000295},{"x":-1.9263999999999442,"y":-2.0026000000000295},{"x":-1.9263999999999442,"y":1.774000000000001}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C87469.obj?uuid=7304035254c941188b587adb626783d8",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C87469.step?uuid=7304035254c941188b587adb626783d8",
        pcbRotationOffset: 180,
        modelOriginPosition: { x: 0, y: -0.000012699999956566899, z: -0.049083 },
      }}
      {...props}
    />
  )
}