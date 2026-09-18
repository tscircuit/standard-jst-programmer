import { strict as assert } from "node:assert"
import { readFileSync } from "node:fs"
const load = (name: string) => JSON.parse(readFileSync(`dist/circuits/${name}/circuit.json`, "utf8")) as any[]
const expected = ["V3_3", "SWDIO", "GND", "SWCLK", "nRESET"]
for (const variant of ["upward", "side", "programmer"]) {
  const circuit = load(variant)
  assert.equal(circuit.filter(e => e.type.endsWith("_error")).length, 0, `${variant}: build/DRC errors`)
  const j = circuit.find(e => e.type === "source_component" && e.name === "J1")
  const ports = circuit.filter(e => e.type === "source_port" && e.source_component_id === j.source_component_id)
  assert.equal(ports.length, 5, `${variant}: exactly five electrical pins`)
  expected.forEach((label, i) => assert(ports.find(p => p.pin_number === i + 1 && p.port_hints.includes(label)), `${variant}: pin ${i + 1} = ${label}`))
  const pc = circuit.find(e => e.type === "pcb_component" && e.source_component_id === j.source_component_id)
  const pads = circuit.filter(e => e.type === "pcb_smtpad" && e.pcb_component_id === pc.pcb_component_id)
  assert.equal(pads.length, 7, `${variant}: five contacts plus two mounting tabs`)
  const signalPads = pads.filter(p => p.pcb_port_id)
  assert.equal(signalPads.length, 5)
  for (const pad of signalPads) assert(Math.abs(Math.min(pad.width, pad.height) - 0.6) < 0.001)
}
const circuit = load("programmer")
const components = circuit.filter(e => e.type === "source_component")
const port = (name: string, label: string) => {
  const component = components.find(e => e.name === name)
  return circuit.find(e => e.type === "source_port" && e.source_component_id === component.source_component_id && e.port_hints.includes(label)).source_port_id
}
// Union ports and named nets through wires only; resistors and the open jumper do not short nets.
const parent = new Map<string, string>()
const root = (s: string): string => parent.has(s) ? root(parent.get(s)!) : s
for (const trace of circuit.filter(e => e.type === "source_trace")) {
  const nodes = [...trace.connected_source_port_ids, ...trace.connected_source_net_ids]
  nodes.slice(1).forEach(n => { const a = root(nodes[0]), b = root(n); if (a !== b) parent.set(b, a) })
}
const connected = (a: string, b: string) => assert.equal(root(a), root(b))
connected(port("U1", "GP2"), port("R_CLK", "pin1"))
connected(port("U1", "GP3"), port("R_DIO", "pin1"))
connected(port("U1", "GP1"), port("R_RST", "pin1"))
connected(port("R_CLK", "pin2"), port("J1", "SWCLK"))
connected(port("R_DIO", "pin2"), port("J1", "SWDIO"))
connected(port("R_RST", "pin2"), port("J1", "nRESET"))
connected(port("J1", "GND"), port("U1", "GND"))
connected(port("JP_PWR", "pin2"), port("J1", "V3_3"))
connected(port("JP_PWR", "pin1"), port("U1", "3V3"))
assert.notEqual(root(port("J1", "V3_3")), root(port("U1", "3V3")), "Open jumper must isolate target and probe power")
assert.notEqual(root(port("J1", "V3_3")), root(port("J1", "GND")), "Target supply must not short to ground")
assert(circuit.some(e => e.type === "pcb_trace"), "Programmer must have routed copper")
console.log("Validated all three circuits: connector pinouts, pads, SWD/reset wiring, open-jumper isolation and DRC.")
