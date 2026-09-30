import fs from "node:fs/promises"
import path from "node:path"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { runAllChecks } from "@tscircuit/checks"
import { convertCircuitJsonToGerberFiles } from "circuit-json-to-gerber"
import { convertCircuitJsonToBomRows, convertBomRowsToCsv } from "circuit-json-to-bom-csv"
import { convertCircuitJsonToPickAndPlaceCsv, convertCircuitJsonToPickAndPlaceRows } from "circuit-json-to-pnp-csv"
import { convertCircuitJsonToPcbSvg, convertCircuitJsonToAssemblySvg, convertCircuitJsonToSchematicSvg } from "circuit-to-svg"

const out = path.resolve(process.argv[2] ?? "dist/fabrication")
const text = await fs.readFile("dist/circuits/programmer/circuit.json", "utf8")
const circuit = JSON.parse(text)
const config = JSON.parse(await fs.readFile("tscircuit.config.json", "utf8"))
const pkg = JSON.parse(await fs.readFile("package.json", "utf8"))
assert.equal(config.version, pkg.version)
const vias = circuit.filter(e => e.type === "pcb_via")
assert(vias.length > 0)
assert(vias.every(v => Math.abs(v.hole_diameter - 0.3) < 1e-9 && v.outer_diameter >= 0.55))
for (const text of [config.projectName.split("-").slice(0, -1).join(" ").toUpperCase(), config.projectName.split("-").slice(-1)[0].toUpperCase(), `V${config.version}`])
  assert(circuit.some(e => e.type === "pcb_silkscreen_text" && e.layer === "bottom" && e.text === text))
const board = circuit.find(e => e.type === "pcb_board")
assert.equal(circuit.filter(e => e.type === "pcb_board").length, 1)
assert.equal(board.num_layers, 4)
assert.equal(board.width, 26)
assert.equal(board.height, 42)
const checks = await runAllChecks(circuit)
const errors = [...circuit, ...checks].filter(e => e.type.endsWith("_error"))
assert.equal(errors.length, 0, JSON.stringify(errors, null, 2))
await fs.mkdir(path.join(out, "gerbers"), { recursive: true })
await fs.mkdir(path.join(out, "assembly"), { recursive: true })
await fs.mkdir(path.join(out, "validation"), { recursive: true })
const write = (name, data) => fs.writeFile(path.join(out, name), data)
// Suppress an imported zero-width reference stroke; zero-size draw apertures are invalid Gerber.
const fabricationCircuit = circuit.filter(e => !(e.type === "pcb_silkscreen_path" && e.stroke_width === 0))
const files = convertCircuitJsonToGerberFiles(fabricationCircuit, { flip_y_axis: false })
assert.equal(Object.keys(files).filter(n => /Cu\.gbr$/.test(n)).length, 4)
assert(Object.entries(files).filter(([name]) => name.endsWith(".drl")).some(([,data]) => /T\d+C0\.300000/.test(data)))
assert(!Object.entries(files).filter(([name]) => name.endsWith(".drl")).some(([,data]) => /T\d+C0\.200000/.test(data)))
for (const [name, data] of Object.entries(files)) {
  assert(data.length > 0)
  assert(!/NaN|Infinity|undefined/.test(data), name)
  await write(`gerbers/${name}`, data)
}
const bom = await convertCircuitJsonToBomRows({ circuitJson: circuit })
for (const row of bom) {
  const source = circuit.find(e => e.type === "source_component" && e.name === row.designator)
  if (source.manufacturer_part_number) row.comment = source.manufacturer_part_number
  if (row.designator === "L_AVDD") row.comment = "GZ1608D601TF, ferrite bead 600 ohm at 100 MHz"
  if (row.designator === "L_AVDD") row.value = "600 ohm at 100 MHz"
}
await write("assembly/BOM.csv", convertBomRowsToCsv(bom))
await write("assembly/CPL-pcb-rotations.csv", convertCircuitJsonToPickAndPlaceCsv(circuit, { flip_y_axis: false }))
const rotations = []
const supplierCsv = convertCircuitJsonToPickAndPlaceCsv(circuit, {
  flip_y_axis: false, supplier: "jlcpcb", onRotationWarning: warning => rotations.push(warning),
})
await write("assembly/CPL-jlcpcb-REVIEW-REQUIRED.csv", supplierCsv)
const pnp = convertCircuitJsonToPickAndPlaceRows(circuit)
assert.deepEqual(bom.map(r => r.designator).sort(), pnp.map(r => r.designator).sort())
assert(pnp.every(r => r.layer === "top"))
for (const name of ["J1", "J2", "J3", "J5"]) assert(!rotations.some(r => r.designator === name))
await write("assembly/rotation-review.json", JSON.stringify(rotations, null, 2))
await write("assembly/assembly-top.svg", convertCircuitJsonToAssemblySvg(circuit, { width: 1000, height: 1400 }))
for (const layer of ["top", "inner1", "inner2", "bottom"])
  await write(`pcb-${layer}.svg`, convertCircuitJsonToPcbSvg(circuit, { layer, width: 1000, height: 1400, matchBoardAspectRatio: true }))
await write("schematic.svg", convertCircuitJsonToSchematicSvg(circuit))
await write("circuit.json", text)
await write("validation/independent-checks.json", JSON.stringify(checks, null, 2))
await write("validation/build-warnings.json", JSON.stringify(circuit.filter(e => e.type.endsWith("_warning")), null, 2))
const manifest = {
  source: "https://tscircuit.com/tscircuit/standard-jst-programmer",
  sourceVersion: config.version,
  sourceRepository: "https://github.com/tscircuit/standard-jst-programmer",
  sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  sourceDirty: execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8" }).trim().length > 0,
  publishedRegistryRelease: false, basedOnVersion: "0.7.1",
  tscircuit: "0.0.2646", checks: "0.0.223", gerberExporter: "0.0.107",
  designVersion: config.version, viaCount: vias.length, viaDrillMm: 0.3, viaPadMm: 0.55,
  backLabel: `${config.projectName} v${config.version}`,
  circuitSha256: createHash("sha256").update(text).digest("hex"),
  board, componentCount: bom.length, buildAndIndependentErrorCount: errors.length,
  jstSupplierRotationWarnings: 0, unresolvedSupplierRotations: rotations.map(r => r.designator),
  gerberFiles: Object.keys(files),
}
await write("validation/manifest.json", JSON.stringify(manifest, null, 2))
console.log(JSON.stringify(manifest, null, 2))
