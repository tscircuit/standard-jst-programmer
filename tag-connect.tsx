import type { ChipProps } from "tscircuit";

/** Project-specific TC2030 assignment: fixed 3.3 V on pin 1 and USB 5 V on pin 6. */
export const tagConnectPinLabels = {
  pin1: ["V3_3"],
  pin2: ["SWDIO"],
  pin3: ["NRST", "nRESET"],
  pin4: ["SWCLK"],
  pin5: ["GND"],
  pin6: ["V5"],
} as const;
export type TagConnectProps = Omit<
  ChipProps<typeof tagConnectPinLabels>,
  "footprint" | "pinLabels" | "cadModel" | "doNotPlace"
>;

/** TC2030-NL-FP Rev B, viewed from PCB top. Bare pads: no connector or solder paste. */
export function StandardTagConnectSwd(props: TagConnectProps) {
  return (
    <chip
      {...props}
      pinLabels={tagConnectPinLabels}
      doNotPlace
      manufacturerPartNumber="TC2030-NL-FP (DNL)"
      footprint={
        <footprint>
          <smtpad
            shape="circle"
            radius={0.3937}
            pcbX={-1.27}
            pcbY={-0.635}
            portHints={["pin1"]}
            solderPasteMargin={-0.3937}
            solderMaskMargin={0.05}
          />
          <smtpad
            shape="circle"
            radius={0.3937}
            pcbX={-1.27}
            pcbY={0.635}
            portHints={["pin2"]}
            solderPasteMargin={-0.3937}
            solderMaskMargin={0.05}
          />
          <smtpad
            shape="circle"
            radius={0.3937}
            pcbX={0}
            pcbY={-0.635}
            portHints={["pin3"]}
            solderPasteMargin={-0.3937}
            solderMaskMargin={0.05}
          />
          <smtpad
            shape="circle"
            radius={0.3937}
            pcbX={0}
            pcbY={0.635}
            portHints={["pin4"]}
            solderPasteMargin={-0.3937}
            solderMaskMargin={0.05}
          />
          <smtpad
            shape="circle"
            radius={0.3937}
            pcbX={1.27}
            pcbY={-0.635}
            portHints={["pin5"]}
            solderPasteMargin={-0.3937}
            solderMaskMargin={0.05}
          />
          <smtpad
            shape="circle"
            radius={0.3937}
            pcbX={1.27}
            pcbY={0.635}
            portHints={["pin6"]}
            solderPasteMargin={-0.3937}
            solderMaskMargin={0.05}
          />
          <hole name="ALIGN1" diameter={0.9906} pcbX={-2.54} pcbY={0} />
          <hole name="ALIGN2" diameter={0.9906} pcbX={2.54} pcbY={1.016} />
          <hole name="ALIGN3" diameter={0.9906} pcbX={2.54} pcbY={-1.016} />
          {/* Reserve the central spring-contact area; pads themselves are intentional exceptions. */}
          <keepout
            shape="rect"
            width={2.54}
            height={1.27}
            layers={["top", "bottom"]}
            excludeRefs={[`.${props.name}`]}
          />
          <courtyardrect width={10.4} height={7.8} />
          <silkscreentext text="1" pcbX={-1.27} pcbY={-1.6} fontSize={0.6} />
          <silkscreentext
            text="TC2030-NL"
            pcbX={0}
            pcbY={3.4}
            fontSize={0.65}
          />
        </footprint>
      }
    />
  );
}
