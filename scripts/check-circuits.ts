import { runAllRoutingChecks } from "@tscircuit/checks";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
const load = (name: string) =>
  JSON.parse(
    readFileSync(`dist/circuits/${name}/circuit.json`, "utf8"),
  ) as any[];

for (const variant of ["upward", "side", "programmer"]) {
  const circuit = load(variant);
  // Run checks directly: asynchronous renderer failures must not look like clean DRC.
  const routingIssues = await runAllRoutingChecks(circuit);
  assert.equal(
    routingIssues.filter((e) => e.type.endsWith("_error")).length,
    0,
    `${variant}: independent routing DRC`,
  );
  assert.equal(
    circuit.filter((e) => e.type.endsWith("_error")).length,
    0,
    `${variant}: build/DRC errors`,
  );
  for (const [name, expected] of [
    ["J1", ["SWCLK", "GND", "SWDIO"]],
    ["J2", ["VOUT", "GND"]],
    ["J3", ["VOUT", "SWDIO", "GND", "SWCLK", "NRST"]],
  ] as const) {
    const j = circuit.find(
      (e) => e.type === "source_component" && e.name === name,
    );
    const ports = circuit.filter(
      (e) =>
        e.type === "source_port" &&
        e.source_component_id === j.source_component_id,
    );
    assert.equal(
      ports.length,
      expected.length,
      `${variant} ${name}: electrical pin count`,
    );
    expected.forEach((label, i) =>
      assert(
        ports.find(
          (p) => p.pin_number === i + 1 && p.port_hints.includes(label),
        ),
        `${variant}: pin ${i + 1} = ${label}`,
      ),
    );
    const pc = circuit.find(
      (e) =>
        e.type === "pcb_component" &&
        e.source_component_id === j.source_component_id,
    );
    const cad = circuit.find(
      (e) =>
        e.type === "cad_component" &&
        e.pcb_component_id === pc.pcb_component_id,
    );
    const part =
      name === "J3"
        ? variant === "upward"
          ? "C160391"
          : "C136657"
        : name === "J1"
          ? variant === "upward"
            ? "C160389"
            : "C160403"
          : variant === "upward"
            ? "C160388"
            : "C160402";
    assert.deepEqual(
      j.supplier_part_numbers.jlcpcb,
      [part],
      `${variant}: JLCPCB part number`,
    );
    assert(
      cad?.model_obj_url?.includes(`${part}.obj`),
      `${variant}: matching 3D model`,
    );
    assert(
      cad?.model_step_url?.includes(`${part}.step`),
      `${variant}: matching STEP model`,
    );
    const pads = circuit.filter(
      (e) =>
        e.type === "pcb_smtpad" && e.pcb_component_id === pc.pcb_component_id,
    );
    assert.equal(
      pads.length,
      expected.length + 2,
      `${variant}: contacts plus two mounting tabs`,
    );
    const signalPads = pads.filter((p) => p.pcb_port_id);
    assert.equal(signalPads.length, expected.length);
    for (const pad of signalPads)
      assert(Math.abs(Math.min(pad.width, pad.height) - 0.6) < 0.001);
  }
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
// Union ports and named nets through wires only; resistors and the selector do not short nets.
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
connected(port("R_CLK", "pin2"), port("J1", "SWCLK"));
connected(port("R_DIO", "pin2"), port("J1", "SWDIO"));
connected(port("J1", "GND"), port("U1", "GND"));
connected(port("J2", "GND"), port("U1", "GND"));
connected(port("SW_PWR", "pin2"), port("R_SHUNT", "pin1"));
connected(port("R_SHUNT", "pin2"), port("J2", "VOUT"));
connected(port("SW_PWR", "pin3"), port("J_USB", "A4B9"));
connected(port("SW_PWR", "pin1"), port("U3", "VOUT"));
const powerNodes = [
  port("SW_PWR", "pin1"),
  port("SW_PWR", "pin2"),
  port("SW_PWR", "pin3"),
  port("J2", "GND"),
].map(root);
assert.equal(
  new Set(powerNodes).size,
  4,
  "Selector throws, common, and ground must be separate copper nets",
);
for (const selected of [0, 2]) {
  const state = (n: string) =>
    root(n) === powerNodes[selected] ? powerNodes[1] : root(n);
  assert.equal(
    state(port("R_SHUNT", "pin1")),
    state(port("SW_PWR", selected === 0 ? "pin1" : "pin3")),
  );
  assert.notEqual(
    state(port("SW_PWR", "pin1")),
    state(port("SW_PWR", "pin3")),
    "Neither selector position shorts the supply rails",
  );
}
for (const name of ["R_CLK", "R_DIO"])
  assert.equal(
    components.find((e) => e.name === name).resistance,
    100,
    "100 ohm source termination",
  );
assert(
  !components.some((e) => ["R_RST", "R_PULLUP", "JP_PWR"].includes(e.name)),
  "Old reset and jumper circuit removed",
);
assert.deepEqual(
  components.find((e) => e.name === "SW_PWR").supplier_part_numbers.jlcpcb,
  ["C221660"],
);
assert(
  readFileSync("firmware/board_standard_jst_config.h", "utf8").includes(
    "#define PROBE_PIN_RESET 1",
  ),
);
assert(
  readFileSync("firmware/openocd.cfg", "utf8").includes("reset_config none"),
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
console.log(
  "Validated all three circuits: JST pinouts, bare RP2040 supplies/flash/USB/boot, SWD, selectable power isolation and DRC.",
);

const preview = JSON.parse(
  readFileSync("dist/preview/circuit.json", "utf8"),
) as any[];
assert.equal(
  (await runAllRoutingChecks(preview)).filter((e) => e.type.endsWith("_error"))
    .length,
  0,
  "preview: independent routing DRC",
);
assert.equal(
  preview.filter((e) => e.type === "pcb_board").length,
  3,
  "preview: all three boards",
);
assert.equal(
  preview.filter(
    (e) =>
      e.type === "cad_component" &&
      /C160389|C160403|C160388|C160402|C160391|C136657/.test(
        e.model_obj_url ?? "",
      ),
  ).length,
  9,
  "preview: all nine JST models",
);
assert.equal(
  preview.filter((e) => e.type.endsWith("_error")).length,
  0,
  "preview: no build errors",
);
const positions = preview
  .filter((e) => e.type === "pcb_board")
  .map((e) => `${e.display_offset_x},${e.display_offset_y}`);
assert.equal(new Set(positions).size, 3, "preview: separate board positions");
console.log("Three-board preview and JST CAD checks passed");

const compact = load("programmer");
// Ground vias must escape the crystal solder lands rather than wick solder.
for (const design of [compact, preview]) {
  const crystalSourceIds = new Set(design.filter((e) =>
    e.type === "source_component" && e.name === "Y1",
  ).map((e) => e.source_component_id));
  const crystalPcbIds = new Set(design.filter((e) =>
    e.type === "pcb_component" && crystalSourceIds.has(e.source_component_id),
  ).map((e) => e.pcb_component_id));
  const crystalPads = design.filter((e) =>
    e.type === "pcb_smtpad" && crystalPcbIds.has(e.pcb_component_id),
  );
  assert.equal(crystalPads.length, 4, "crystal has four solder lands");
  for (const via of design.filter((e) => e.type === "pcb_via")) {
    for (const pad of crystalPads) {
      const distance = Math.hypot(
        Math.max(Math.abs(via.x - pad.x) - pad.width / 2, 0),
        Math.max(Math.abs(via.y - pad.y) - pad.height / 2, 0),
      );
      assert(distance - via.outer_diameter / 2 > 0,
        "crystal via copper must not overlap solder lands");
    }
  }
}
const compactBoard = compact.find((e) => e.type === "pcb_board");
assert.equal(compactBoard.width, 26);
assert.equal(compactBoard.height, 42);
assert.equal(compactBoard.num_layers, 4);
assert(
  compact.filter((e) => e.type === "pcb_via").every((via) =>
    ["top", "inner1", "inner2", "bottom"].every((layer) => via.layers.includes(layer)),
  ),
  "all programmer vias must be through vias across all four copper layers",
);

assert(
  compact
    .filter((e) => e.type === "pcb_component")
    .every((e) => e.layer === "top"),
  "single-sided component assembly",
);
assert(
  !compact.some(
    (e) => e.type === "source_component" && e.name.startsWith("TP_"),
  ),
  "no test points",
);
const pcbFor = (name: string) => {
  const source = compact.find(
    (e) => e.type === "source_component" && e.name === name,
  );
  return compact.find(
    (e) =>
      e.type === "pcb_component" &&
      e.source_component_id === source.source_component_id,
  );
};
assert(
  pcbFor("J_USB").center.y > 14 && pcbFor("J1").center.y < -15,
  "opposite connector edges",
);
for (const label of [
  "1:CLK 2:GND",
  "3:DIO",
  "1:VOUT",
  "2:GND",
  "1:VOUT 2:DIO 3:GND",
  "4:CLK 5:NRST",
  "5V",
  "3V3",
  "IO:3V3",
])
  assert(
    compact.some(
      (e) =>
        e.type === "pcb_silkscreen_text" &&
        e.text === label &&
        e.layer === "top",
    ),
    `JST legend: ${label}`,
  );
console.log(
  "Compact board dimensions, top-side assembly, opposite connectors, and pinout legend verified",
);

// Five-pin extension shares one SWD target and one sensed power domain.
for (const label of ["SWCLK", "SWDIO", "GND"])
  connected(port("J3", label), port("J1", label));
connected(port("J3", "VOUT"), port("J2", "VOUT"));
connected(port("J3", "NRST"), port("R_NRST", "pin2"));
connected(port("R_NRST", "pin1"), port("U1", "GPIO1"));
assert.notEqual(root(port("J3", "NRST")), root(port("U1", "RUN")));
assert.notEqual(root(port("J3", "NRST")), root(port("J3", "VOUT")));
// All supplied target current must cross the shunt; monitor supply is upstream.
assert.equal(components.find((e) => e.name === "R_SHUNT").resistance, 0.1);
assert.notEqual(root(port("R_SHUNT", "pin1")), root(port("R_SHUNT", "pin2")));
connected(port("U_SENSE", "IN_POS"), port("R_SHUNT", "pin1"));
connected(port("U_SENSE", "IN_NEG"), port("R_SHUNT", "pin2"));
connected(port("U_SENSE", "VS"), port("U3", "VOUT"));
for (const label of ["GND", "A0", "A1"])
  connected(port("U_SENSE", label), port("U1", "GND"));
connected(port("U_SENSE", "SDA"), port("U1", "GPIO18"));
connected(port("U_SENSE", "SCL"), port("U1", "GPIO19"));
for (const [r, l] of [
  ["R_SDA", "SDA"],
  ["R_SCL", "SCL"],
]) {
  connected(port(r!, "pin1"), port("U_SENSE", l!));
  connected(port(r!, "pin2"), port("U3", "VOUT"));
}
connected(port("U1", "GPIO25"), port("U_RGB", "A"));
connected(port("U_RGB", "Y"), port("R_RGB", "pin1"));
connected(port("R_RGB", "pin2"), port("D_RGB", "DI"));
connected(port("U_RGB", "N_OE"), port("U1", "GND"));
connected(port("D_RGB", "GND"), port("U1", "GND"));
for (const [name, label] of [
  ["D_RGB", "VDD"],
  ["U_RGB", "VCC"],
])
  connected(port(name!, label!), port("J_USB", "A4B9"));
assert.notEqual(
  root(port("D_RGB", "VDD")),
  root(port("J2", "VOUT")),
  "Probe LED current excluded from measurement",
);
for (const [name, cid] of [
  ["D_RGB", "C41413180"],
  ["U_SENSE", "C87469"],
  ["U_RGB", "C350557"],
])
  assert.deepEqual(
    components.find((e) => e.name === name).supplier_part_numbers.jlcpcb,
    [cid],
  );
assert.equal(
  components.find((e) => e.name === "D_RGB").manufacturer_part_number,
  "XL-1615RGBC-2812B-S",
);
console.log(
  "NRST, shared five-pin interface, current sensing and buffered RGB verified",
);

// The TC2030 cable is straight-through; header and target use the same six-pin map.
const tagLabels = ["VOUT", "SWDIO", "NRST", "SWCLK", "GND", "SWO"];
for (const variant of ["programmer", "upward", "side"]) {
  const cj = load(variant);
  const sc = cj.find((e) => e.type === "source_component" && e.name === "J4");
  const pc = cj.find(
    (e) =>
      e.type === "pcb_component" &&
      e.source_component_id === sc.source_component_id,
  );
  const ports = cj.filter(
    (e) =>
      e.type === "source_port" &&
      e.source_component_id === sc.source_component_id,
  );
  assert.equal(ports.length, 6);
  tagLabels.forEach((label, i) =>
    assert(
      ports.some((p) => p.pin_number === i + 1 && p.port_hints.includes(label)),
    ),
  );
  const pads = cj.filter(
    (e) =>
      e.type === "pcb_smtpad" && e.pcb_component_id === pc.pcb_component_id,
  );
  assert.equal(pads.length, 6);
  if (variant === "programmer") {
    assert.deepEqual(sc.supplier_part_numbers.jlcpcb, ["C3324375"]);
    assert.equal(sc.manufacturer_part_number, "FTSH-103-01-L-DV-TR");
    assert(
      cj.some(
        (e) =>
          e.type === "cad_component" &&
          e.pcb_component_id === pc.pcb_component_id,
      ),
    );
    // Check actual copper endpoints, not only a router's connectsTo metadata.
    for (const pad of pads) {
      const pp = cj.find(
        (e) => e.type === "pcb_port" && e.pcb_port_id === pad.pcb_port_id,
      );
      const sp = ports.find((p) => p.source_port_id === pp.source_port_id);
      const endpoints = cj
        .filter((e) => e.type === "pcb_trace")
        .flatMap((t) => [t.route[0], t.route.at(-1)]);
      const touched = endpoints.some(
        (p) =>
          p?.route_type === "wire" &&
          p.layer === "top" &&
          Math.abs(p.x - pad.x) <= pad.width / 2 + 0.001 &&
          Math.abs(p.y - pad.y) <= pad.height / 2 + 0.001,
      );
      assert.equal(
        touched,
        sp.pin_number !== 6,
        `IDC pin ${sp.pin_number}: actual routed endpoint`,
      );
    }
  } else {
    assert.equal(pc.do_not_place, true, "Bare-pad target is not assembled");
    assert(
      pads.every(
        (p) => p.shape === "circle" && Math.abs(p.radius - 0.3937) < 0.00001,
      ),
    );
    assert(
      !cj.some(
        (e) =>
          e.type === "pcb_solder_paste" &&
          pads.some((p) => e.pcb_smtpad_id === p.pcb_smtpad_id),
      ),
      "No paste on spring contacts",
    );
    const holes = cj.filter(
      (e) =>
        e.type === "pcb_hole" && e.pcb_component_id === pc.pcb_component_id,
    );
    assert.equal(holes.length, 3, "Three unplated alignment holes");
    assert(holes.every((h) => Math.abs(h.hole_diameter - 0.9906) < 0.00001));
    assert(
      !cj.some(
        (e) =>
          e.type === "cad_component" &&
          e.pcb_component_id === pc.pcb_component_id,
      ),
    );
  }
}
for (const label of ["VOUT", "SWDIO", "NRST", "SWCLK", "GND"])
  connected(port("J4", label), port("J3", label));
assert(
  !circuit.some(
    (e) =>
      e.type === "source_trace" &&
      e.connected_source_port_ids.includes(port("J4", "SWO")),
  ),
);
console.log("IDC physical connections and TC2030 bare-pad target verified");

assert(
  pcbFor("J4").center.y < -5,
  "IDC header stays beside the lower target connectors",
);
assert(
  pcbFor("SW_RUN").center.y > 14,
  "RUN button moved away from the target cables",
);
