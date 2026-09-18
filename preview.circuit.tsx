import UpwardBoard from "./circuits/upward.circuit"
import SideBoard from "./circuits/side.circuit"
import { ProgrammerBoard } from "./programmer"

/** Display panel: the three standalone circuits are the fabrication outputs.
 * Placement DRC is run on each standalone circuit. The current panel checker
 * incorrectly checks coupon pads against the programmer board's outline.
 * Routing DRC remains enabled here.
 */
export default function Preview() {
  return (
    <panel layoutMode="none" width={90} height={80} panelizationMethod="outline_routing">
      <ProgrammerBoard previewPlacement />
      <UpwardBoard placementDrcChecksDisabled pcbX={35} pcbY={9} />
      <SideBoard placementDrcChecksDisabled pcbX={35} pcbY={-9} />
    </panel>
  )
}
