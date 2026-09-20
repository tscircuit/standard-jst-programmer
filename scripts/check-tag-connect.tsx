import { Circuit } from "tscircuit";
import { strict as assert } from "node:assert";
import { runAllRoutingChecks } from "@tscircuit/checks";
import { StandardTagConnectSwd } from "../index";
const circuit = new Circuit();
circuit.add(
  <board width={24} height={20} autorouter="auto-local">
    <StandardTagConnectSwd name="J_TAG" pcbX={0} pcbY={0} />
    <resistor
      name="R1"
      resistance="10k"
      footprint="0603"
      pcbX={-4}
      pcbY={-6}
      pcbRotation={90}
    />
    <resistor
      name="R2"
      resistance="10k"
      footprint="0603"
      pcbX={-4}
      pcbY={6}
      pcbRotation={90}
    />
    <resistor
      name="R3"
      resistance="10k"
      footprint="0603"
      pcbX={0}
      pcbY={-6}
      pcbRotation={90}
    />
    <resistor
      name="R4"
      resistance="10k"
      footprint="0603"
      pcbX={0}
      pcbY={6}
      pcbRotation={90}
    />
    <resistor
      name="R5"
      resistance="10k"
      footprint="0603"
      pcbX={4}
      pcbY={-6}
      pcbRotation={90}
    />
    <resistor name="R6" resistance="10k" footprint="0603"
      pcbX={4} pcbY={6} pcbRotation={90} />
    <trace from=".J_TAG > .V5" to=".R6 > .pin1" />
    <trace from=".J_TAG > .V3_3" to=".R1 > .pin2" />
    <trace from=".J_TAG > .SWDIO" to=".R2 > .pin1" />
    <trace from=".J_TAG > .NRST" to=".R3 > .pin2" />
    <trace from=".J_TAG > .SWCLK" to=".R4 > .pin1" />
    <trace from=".J_TAG > .GND" to=".R5 > .pin2" />
  </board>,
);
await circuit.renderUntilSettled();
const json = circuit.getCircuitJson();
assert.equal(
  json.filter((e) => e.type.endsWith("_error")).length,
  0,
  "Imported Tag-Connect routes with the default autorouter",
);
assert.equal(
  (await runAllRoutingChecks(json)).filter((e) => e.type.endsWith("_error"))
    .length,
  0,
);
console.log("Imported Tag-Connect routes outward with its keepout intact");
