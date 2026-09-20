import { StandardTagConnectSwd } from "../tag-connect";
import type { BoardProps } from "@tscircuit/props";
import {
  StandardJstSwdUpward,
  StandardJstPowerUpward,
  StandardJstSwdResetUpward,
} from "../connectors";
export default (props: BoardProps = {}) => (
  <board {...props} width={20} height={33}>
    <schematicsheet name="upward-connectors" displayName="Upward target connector footprints">
      <schematicsection name="upward-swd" displayName="3-pin SWD" sectionTitleFontSize={0.35} />
      <schematicsection name="upward-power" displayName="2-pin power" sectionTitleFontSize={0.35} />
      <schematicsection name="upward-reset" displayName="5-pin SWD with NRST" sectionTitleFontSize={0.35} />
      <schematicsection name="upward-tag" displayName="Tag-Connect target pads" sectionTitleFontSize={0.35} />
    </schematicsheet>
    <StandardJstSwdUpward
      name="J1" schX={-7} schY={3} schSheetName="upward-connectors" schSectionName="upward-swd"
      pcbX={-4.5}
      pcbY={9.0}
      pcbStyle={{ silkscreenTextVisibility: "hidden" }}
    />
    <StandardJstPowerUpward
      name="J2" schX={7} schY={3} schSheetName="upward-connectors" schSectionName="upward-power"
      pcbX={4.5}
      pcbY={9.0}
      pcbStyle={{ silkscreenTextVisibility: "hidden" }}
    />
    <silkscreentext text="SWD" pcbX={-4.5} pcbY={14.7} fontSize={0.8} />
    <silkscreentext
      text="1:CLK 2:GND 3:DIO"
      pcbX={-4.5}
      pcbY={13.5}
      fontSize={0.55}
    />
    <silkscreentext text="POWER" pcbX={4.5} pcbY={14.7} fontSize={0.8} />
    <silkscreentext
      text="1:VOUT 2:GND"
      pcbX={4.5}
      pcbY={13.5}
      fontSize={0.55}
    />
    <StandardJstSwdResetUpward
      name="J3" schX={-7} schY={-3} schSheetName="upward-connectors" schSectionName="upward-reset"
      pcbX={0}
      pcbY={-1.0}
      pcbStyle={{ silkscreenTextVisibility: "hidden" }}
    />
    <silkscreentext text="SWD+NRST" pcbX={0} pcbY={3.8} fontSize={0.8} />
    <silkscreentext
      text="1:VOUT 2:DIO 3:GND 4:CLK 5:NRST"
      pcbX={0}
      pcbY={2.5}
      fontSize={0.65}
    />
    <StandardTagConnectSwd name="J4" schX={7} schY={-3} schSheetName="upward-connectors" schSectionName="upward-tag" pcbX={0} pcbY={-11} />
  </board>
);
