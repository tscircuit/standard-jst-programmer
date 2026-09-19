import type { ChipProps } from "tscircuit";
import { tagConnectPinLabels } from "../tag-connect";
import model from "./ftsh-103-model.json";

/** Samtec FTSH-103-01-L-DV-TR. Manufacturer DV land pattern, without optional alignment pins. */
export function TagConnectIdcHeader(
  props: ChipProps<typeof tagConnectPinLabels>,
) {
  return (
    <chip
      {...props}
      pinLabels={tagConnectPinLabels}
      manufacturerPartNumber="FTSH-103-01-L-DV-TR"
      supplierPartNumbers={{ jlcpcb: ["C3324375"] }}
      cadModel={{ jscad: model }}
      footprint={
        <footprint>
          <smtpad
            shape="rect"
            width={0.7366}
            height={2.794}
            pcbX={-1.27}
            pcbY={-2.032}
            portHints={["pin1"]}
          />
          <smtpad
            shape="rect"
            width={0.7366}
            height={2.794}
            pcbX={-1.27}
            pcbY={2.032}
            portHints={["pin2"]}
          />
          <smtpad
            shape="rect"
            width={0.7366}
            height={2.794}
            pcbX={0}
            pcbY={-2.032}
            portHints={["pin3"]}
          />
          <smtpad
            shape="rect"
            width={0.7366}
            height={2.794}
            pcbX={0}
            pcbY={2.032}
            portHints={["pin4"]}
          />
          <smtpad
            shape="rect"
            width={0.7366}
            height={2.794}
            pcbX={1.27}
            pcbY={-2.032}
            portHints={["pin5"]}
          />
          <smtpad
            shape="rect"
            width={0.7366}
            height={2.794}
            pcbX={1.27}
            pcbY={2.032}
            portHints={["pin6"]}
          />
          <courtyardrect width={4.32} height={7.36} />
          <silkscreenpath
            route={[
              { x: -1.9, y: -0.5 },
              { x: -1.9, y: 0.5 },
            ]}
          />
          <silkscreenpath
            route={[
              { x: 1.9, y: -0.5 },
              { x: 1.9, y: 0.5 },
            ]}
          />
          <silkscreentext text="1" pcbX={-2.2} pcbY={-2.5} fontSize={0.65} />
        </footprint>
      }
    />
  );
}
