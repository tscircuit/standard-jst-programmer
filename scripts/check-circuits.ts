import { runAllRoutingChecks } from "@tscircuit/checks";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
const load = (name: string) =>
  JSON.parse(
    readFileSync(`dist/circuits/${name}/circuit.json`, "utf8"),
  ) as any[];
const expected = ["V3_3", "SWDIO", "GND", "SWCLK", "nRESET"];
for (const variant of ["upward", "side", "programmer"]) {
  const circuit = load(variant);
  // Run checks directly: asynchronous renderer failures must not look like clean DRC.
  const routingIssues = await runAllRoutingChecks(circuit);
  assert.equal(routingIssues.filter(e => e.type.endsWith("_error")).length, 0, `${variant}: independent routing DRC`);
  assert.equal(
    circuit.filter((e) => e.type.endsWith("_error")).length,
    0,
    `${variant}: build/DRC errors`,
  );
  const j = circuit.find(
    (e) => e.type === "source_component" && e.name === "J1",
  );
  const ports = circuit.filter(
    (e) =>
      e.type === "source_port" &&
      e.source_component_id === j.source_component_id,
  );
  assert.equal(ports.length, 5, `${variant}: exactly five electrical pins`);
  expected.forEach((label, i) =>
    assert(
      ports.find((p) => p.pin_number === i + 1 && p.port_hints.includes(label)),
      `${variant}: pin ${i + 1} = ${label}`,
    ),
  );
  const pc = circuit.find(
    (e) =>
      e.type === "pcb_component" &&
      e.source_component_id === j.source_component_id,
  );
  const cad = circuit.find((e) => e.type === "cad_component" && e.pcb_component_id === pc.pcb_component_id);
  const part = variant === "upward" ? "C160391" : "C136657";
  assert.deepEqual(j.supplier_part_numbers.jlcpcb, [part], `${variant}: JLCPCB part number`);
  assert(cad?.model_obj_url?.includes(`${part}.obj`), `${variant}: matching 3D model`);
  assert(cad?.model_step_url?.includes(`${part}.step`), `${variant}: matching STEP model`);
  const pads = circuit.filter(
    (e) =>
      e.type === "pcb_smtpad" && e.pcb_component_id === pc.pcb_component_id,
  );
  assert.equal(
    pads.length,
    7,
    `${variant}: five contacts plus two mounting tabs`,
  );
  const signalPads = pads.filter((p) => p.pcb_port_id);
  assert.equal(signalPads.length, 5);
  for (const pad of signalPads)
    assert(Math.abs(Math.min(pad.width, pad.height) - 0.6) < 0.001);
}
const circuit = load("programmer");
const components = circuit.filter((e) => e.type === "source_component");
const port = (name: string, label: string) => {
  const component = components.find((e) => e.name === name);
  return circuit.find(
    (e) =>
      e.type === "source_port" &&
      e.source_component_id === component.source_component_id &&
      e.port_hints.includes(label),
  ).source_port_id;
};
// Union ports and named nets through wires only; resistors and the open jumper do not short nets.
const parent = new Map<string, string>();
const root = (s: string): string => (parent.has(s) ? root(parent.get(s)!) : s);
for (const trace of circuit.filter((e) => e.type === "source_trace")) {
  const nodes = [
    ...trace.connected_source_port_ids,
    ...trace.connected_source_net_ids,
  ];
  nodes.slice(1).forEach((n) => {
    const a = root(nodes[0]),
      b = root(n);
    if (a !== b) parent.set(b, a);
  });
}
const connected = (a: string, b: string) => assert.equal(root(a), root(b));
connected(port("U1", "GPIO2"), port("R_CLK", "pin1"));
connected(port("U1", "GPIO3"), port("R_DIO", "pin1"));
connected(port("U1", "GPIO1"), port("R_RST", "pin1"));
connected(port("R_CLK", "pin2"), port("J1", "SWCLK"));
connected(port("R_DIO", "pin2"), port("J1", "SWDIO"));
connected(port("R_RST", "pin2"), port("J1", "nRESET"));
connected(port("J1", "GND"), port("U1", "GND"));
connected(port("JP_PWR", "pin2"), port("J1", "V3_3"));
connected(port("JP_PWR", "pin1"), port("U3", "VOUT"));
assert.notEqual(
  root(port("J1", "V3_3")),
  root(port("U3", "VOUT")),
  "Open jumper must isolate target and probe power",
);
assert.notEqual(
  root(port("J1", "V3_3")),
  root(port("J1", "GND")),
  "Target supply must not short to ground",
);
assert(
  circuit.some((e) => e.type === "pcb_trace"),
  "Programmer must have routed copper",
);
// Discrete support circuit: verify silicon pins, supplies, USB-C and external QSPI flash.
const mcu = components.find((e) => e.name === "U1");
assert.equal(
  circuit.filter(
    (e) =>
      e.type === "source_port" &&
      e.source_component_id === mcu.source_component_id,
  ).length,
  57,
  "U1 must be the bare 57-pad RP2040, not a module",
);
for (const pin of [
  "IOVDD1",
  "IOVDD2",
  "IOVDD3",
  "IOVDD4",
  "IOVDD5",
  "IOVDD6",
  "USB_VDD",
  "VREG_IN",
])
  connected(port("U1", pin), port("U3", "VOUT"));
for (const pin of ["DVDD1", "DVDD2"])
  connected(port("U1", pin), port("U1", "VREG_VOUT"));
assert.notEqual(
  root(port("U1", "VREG_VOUT")),
  root(port("U3", "VOUT")),
  "1.1 V core and 3.3 V must remain separate",
);
connected(port("U1", "TESTEN"), port("U1", "GND"));
connected(port("U2", "VCC"), port("U3", "VOUT"));
connected(port("U2", "GND"), port("U1", "GND"));
connected(port("U2", "EP"), port("U1", "GND"));
for (const [a, b] of [
  ["QSPI_SS", "CS"],
  ["QSPI_SCLK", "CLK"],
  ["QSPI_SD0", "pin5"],
  ["QSPI_SD1", "pin2"],
  ["QSPI_SD2", "pin3"],
  ["QSPI_SD3", "pin7"],
])
  connected(port("U1", a!), port("U2", b!));
for (const [usb, resistor, mcuPin] of [
  ["A7", "R_USB1", "USB_DM"],
  ["B7", "R_USB1", "USB_DM"],
  ["A6", "R_USB2", "USB_DP"],
  ["B6", "R_USB2", "USB_DP"],
]) {
  connected(port("J_USB", usb!), port(resistor!, "pin1"));
  connected(port(resistor!, "pin2"), port("U1", mcuPin!));
}
connected(port("J_USB", "A5"), port("R_CC1", "pin1"));
connected(port("J_USB", "B5"), port("R_CC2", "pin1"));
for (const name of ["R_CC1", "R_CC2"])
  connected(port(name, "pin2"), port("U1", "GND"));
connected(port("J_USB", "A4B9"), port("J_USB", "B4A9"));
connected(port("U3", "VIN"), port("C_REG_IN", "pin1"));
connected(port("U3", "VOUT"), port("C_REG_OUT", "pin1"));
connected(port("U1", "VREG_IN"), port("C_VREG_IN", "pin1"));
connected(port("U1", "VREG_VOUT"), port("C_CORE", "pin1"));
for (let i = 1; i <= 6; i++)
  connected(port("U1", `IOVDD${i}`), port(`C_IOVDD${i}`, "pin1"));
connected(port("U1", "QSPI_SS"), port("R_BOOT_SER", "pin2"));
connected(port("R_BOOT_SER", "pin1"), port("SW_BOOT", "pin1"));
assert.notEqual(
  root(port("SW_BOOT", "pin1")),
  root(port("U1", "QSPI_SS")),
  "BOOTSEL must include the 1k series resistor",
);
assert.notEqual(
  root(port("J1", "nRESET")),
  root(port("U1", "RUN")),
  "Target reset must not reset the programmer",
);
console.log(
  "Validated all three circuits: JST pinouts, bare RP2040 supplies/flash/USB/boot, SWD/reset, power isolation and DRC.",
);

const preview = JSON.parse(readFileSync("dist/preview/circuit.json", "utf8")) as any[];
assert.equal((await runAllRoutingChecks(preview)).filter(e => e.type.endsWith("_error")).length, 0, "preview: independent routing DRC");
assert.equal(preview.filter(e => e.type === "pcb_board").length, 3, "preview: all three boards");
assert.equal(preview.filter(e => e.type === "cad_component" && /C160391|C136657/.test(e.model_obj_url ?? "")).length, 3, "preview: all three JST models");
assert.equal(preview.filter(e => e.type.endsWith("_error")).length, 0, "preview: no build errors");
const positions = preview.filter(e => e.type === "pcb_board").map(e => `${e.display_offset_x},${e.display_offset_y}`);
assert.equal(new Set(positions).size, 3, "preview: separate board positions");
console.log("Three-board preview and JST CAD checks passed");

const compact = load("programmer");
const compactBoard = compact.find(e => e.type === "pcb_board");
assert.equal(compactBoard.width, 26);
assert.equal(compactBoard.height, 38);
assert(compact.filter(e => e.type === "pcb_component").every(e => e.layer === "top"), "single-sided component assembly");
assert(!compact.some(e => e.type === "source_component" && e.name.startsWith("TP_")), "no test points");
const pcbFor = (name: string) => {
  const source = compact.find(e => e.type === "source_component" && e.name === name);
  return compact.find(e => e.type === "pcb_component" && e.source_component_id === source.source_component_id);
};
assert(pcbFor("J_USB").center.y > 14 && pcbFor("J1").center.y < -15, "opposite connector edges");
for (const label of ["1:3V3", "2:SWDIO", "3:GND", "4:SWCLK", "5:nRESET"])
  assert(compact.some(e => e.type === "pcb_silkscreen_text" && e.text === label && e.layer === "top"), `JST legend: ${label}`);
console.log("Compact board dimensions, top-side assembly, opposite connectors, and pinout legend verified");
