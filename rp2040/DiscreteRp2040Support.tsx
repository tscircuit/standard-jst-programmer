// Adapted from tscircuit/common @ a5797da88ec19944442d87392174af0a36fe1a0a.
// MIT license retained in ./LICENSE. Discrete components, not a module.
import type { ReactNode } from "react";
import type { ChipProps, SubcircuitProps } from "@tscircuit/props";
import { RP2040 } from "./imports/RP2040";
import { TYPE_C_16PIN_2MD_073_ } from "./imports/TYPE_C_16PIN_2MD_073_";
import { W25Q16JVUXIQ } from "./imports/W25Q16JVUXIQ";
import { AP2112K_3_3TRG1 } from "./imports/AP2112K_3_3TRG1";
import { X322512MSB4SI } from "./imports/X322512MSB4SI";
import { SKRPACE010 } from "./imports/SKRPACE010";
import { B5819W_SL } from "./imports/B5819W_SL";
import { XL_1608SURC_06 } from "./imports/XL_1608SURC_06";

const denseTraceProps = { thickness: "0.1mm" } as const;
const gndLabel = { displayName: "GND", schDisplayLabel: "GND" } as const;
const vbusLabel = { displayName: "VBUS", schDisplayLabel: "VBUS" } as const;
const vsysLabel = { displayName: "VSYS", schDisplayLabel: "VSYS" } as const;
const v3v3Label = { displayName: "V3V3", schDisplayLabel: "V3V3" } as const;
const v1v1Label = { displayName: "V1V1", schDisplayLabel: "V1V1" } as const;
const adcRefLabel = {
  displayName: "ADC_REF",
  schDisplayLabel: "ADC_REF",
} as const;
// Keep every functional subset attached to one of the four visible sections so
// section bounds and dividers account for all schematic components.
const schSections = {
  rp2040: (name: string) => `${name}__rp2040`,
  usb: (name: string) => `${name}__usb`,
  power: (name: string) => `${name}__rp2040`,
  flash: (name: string) => `${name}__usb`,
  clock: (name: string) => `${name}__clock`,
  controls: (name: string) => `${name}__status`,
  display: (name: string) => `${name}__status`,
  status: (name: string) => `${name}__status`,
  debug: (name: string) => `${name}__status`,
} as const;

export type MicrocontrollerRP2040Props = Omit<
  SubcircuitProps,
  "children" | "connections"
> & {
  connections?: ChipProps["connections"];
  children?: ReactNode;
};

/**
 * Complete Pico-style RP2040 support circuit adapted from
 * https://tscircuit.com/abse/gameboy.
 */
export const DiscreteRp2040Support = ({
  name = "Microcontroller_RP2040",
  connections,
  children,
  ...props
}: MicrocontrollerRP2040Props) => (
  <subcircuit name={name} {...props}>
    <schematicsection
      name={schSections.rp2040(name)}
      displayName="RP2040 & Power"
    />
    <schematicsection
      name={schSections.usb(name)}
      displayName="Programming USB-C & QSPI"
    />
    <schematicsection name={schSections.clock(name)} displayName="Clock" />
    <schematicsection
      name={schSections.status(name)}
      displayName="Status & SWD Debug"
    />

    <autoroutingphase
      name="crystal-signals"
      phaseIndex={0}
      connections={["Y1.X1", "Y1.X2"]}
    />

    <trace name="Y1_G1" from=".Y1 > .pin2" to="net.GND" {...gndLabel} />
    <trace name="Y1_G2" from=".Y1 > .pin4" to="net.GND" {...gndLabel} />

    <trace name="USB_DN_B" from=".J_USB > .B7" to=".R_USB1 > .pin1" />
    <trace name="USB_DP_B" from=".J_USB > .B6" to=".R_USB2 > .pin1" />

    <B5819W_SL
      name="D_VBUS"
      schSectionName={schSections.power(name)}
      pcbX={-9}
      pcbY={7}
      pcbRotation={0}
      schX={3}
      schY={-5.8}
      schRotation={90}
    />
    <trace name="VBUS_D" from="net.VBUS" to=".D_VBUS > .anode" {...vbusLabel} />
    <trace
      name="D_VSYS"
      from=".D_VBUS > .cathode"
      to="net.VSYS"
      {...vsysLabel}
    />

    <resistor
      name="R_3V3_EN"
      resistance="100k"
      footprint="0402"
      schSectionName={schSections.power(name)}
      pcbX={-6.5}
      pcbY={11.7}
      pcbRotation={90}
      schX={3}
      schY={-7}
      schRotation={270}
    />

    <trace
      name="EN_VSYS"
      from=".R_3V3_EN > .pin1"
      to="net.VSYS"
      {...vsysLabel}
    />
    <trace name="EN_R" from=".R_3V3_EN > .pin2" to=".U3 > .EN" />

    <capacitor
      name="C_IOVDD1"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2040(name)}
      schOrientation="vertical"
      pcbX={6}
      pcbY={4.5}
      schX={-11.3}
      schY={-6.4}
      pcbRotation={0}
    />
    <capacitor
      name="C_IOVDD2"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2040(name)}
      schOrientation="vertical"
      pcbX={5.5}
      pcbY={3.1}
      schX={-9.6}
      schY={-6.4}
      pcbRotation={0}
    />
    <capacitor
      name="C_IOVDD3"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2040(name)}
      schOrientation="vertical"
      pcbX={5.5}
      pcbY={-0.5}
      schX={-7.9}
      schY={-6.4}
      pcbRotation={0}
    />
    <capacitor
      name="C_IOVDD4"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2040(name)}
      schOrientation="vertical"
      pcbX={3}
      pcbY={-5}
      schX={-6.2}
      schY={-6.4}
      pcbRotation={270}
    />
    <capacitor
      name="C_IOVDD5"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2040(name)}
      schOrientation="vertical"
      pcbX={-5.5}
      pcbY={-0.5}
      schX={-4.5}
      schY={-6.4}
      pcbRotation={180}
    />
    <capacitor
      name="C_IOVDD6"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.rp2040(name)}
      schOrientation="vertical"
      pcbX={-5.5}
      pcbY={3.2}
      schX={-2.8}
      schY={-6.4}
      pcbRotation={180}
    />

    <trace
      name="IO5_3V3"
      from=".C_IOVDD5 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO5_G" from=".C_IOVDD5 > .pin2" to="net.GND" {...gndLabel} />
    <trace
      name="IO6_3V3"
      from=".C_IOVDD6 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO6_G" from=".C_IOVDD6 > .pin2" to="net.GND" {...gndLabel} />

    <trace
      name="IO3_3V3"
      from=".C_IOVDD3 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO3_G" from=".C_IOVDD3 > .pin2" to="net.GND" {...gndLabel} />
    <trace
      name="IO4_3V3"
      from=".C_IOVDD4 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO4_G" from=".C_IOVDD4 > .pin2" to="net.GND" {...gndLabel} />

    <resistor
      name="R_RUN"
      resistance="10k"
      footprint="0402"
      schSectionName={schSections.controls(name)}
      pcbX={9}
      pcbY={-3.5}
      schX={12.8}
      schY={-13.5}
      schRotation={90}
    />

    <capacitor
      name="C_FLASH"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.flash(name)}
      schOrientation="vertical"
      pcbX={-6.5}
      pcbY={9.5}
      schX={16.8}
      schY={-1.7}
      pcbRotation={90}
    />

    <capacitor
      name="C_USB_VDD"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.usb(name)}
      schOrientation="vertical"
      pcbX={0.8}
      pcbY={5.7}
      schX={7.2}
      schY={-2.2}
      pcbRotation={90}
    />

    <capacitor
      name="C_ADC"
      capacitance="100nF"
      footprint="0402"
      schSectionName={schSections.power(name)}
      schOrientation="vertical"
      pcbX={7}
      pcbY={6.5}
      schX={1.3}
      schY={-9.2}
      pcbRotation={90}
    />
    {/* RUN pullup */}
    <trace
      {...denseTraceProps}
      name="RUN_R"
      from=".R_RUN > .pin1"
      to=".U1 > .RUN"
    />
    <trace name="RUN_3V3" from=".R_RUN > .pin2" to="net.V3V3" {...v3v3Label} />

    {/* TESTEN */}
    <trace name="TEST_G" from=".U1 > .TESTEN" to="net.GND" {...gndLabel} />

    {/* Flash decoupling */}
    <trace
      name="FLSH_3V3"
      from=".C_FLASH > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="FLSH_G" from=".C_FLASH > .pin2" to="net.GND" {...gndLabel} />

    {/* IOVDD decoupling */}
    <trace
      name="IO1_3V3"
      from=".C_IOVDD1 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO1_G" from=".C_IOVDD1 > .pin2" to="net.GND" {...gndLabel} />

    <trace
      name="IO2_3V3"
      from=".C_IOVDD2 > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="IO2_G" from=".C_IOVDD2 > .pin2" to="net.GND" {...gndLabel} />

    {/* USB_VDD decoupling */}
    <trace
      name="UVDD_3V3"
      from=".C_USB_VDD > .pin1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="UVDD_G" from=".C_USB_VDD > .pin2" to="net.GND" {...gndLabel} />

    {/* ADC decoupling */}
    <trace
      name="ADC_REF"
      from=".C_ADC > .pin1"
      to="net.ADC_VREF"
      {...adcRefLabel}
    />
    <trace name="ADC_G" from=".C_ADC > .pin2" to="net.GND" {...gndLabel} />

    <TYPE_C_16PIN_2MD_073_
      name="J_USB"
      schSectionName={schSections.usb(name)}
      pcbX={0}
      pcbY={15}
      pcbRotation={180}
      schX={10.5}
      schY={-5.3}
      schWidth={2.6}
      schHeight={1.8}
      schPinArrangement={{
        leftSide: [13, 15, 17, 18, 20, 22, 23, 25],
        rightSide: [14, 16, 28, 27, 26, 24, 21, 19],
      }}
    />

    <RP2040
      name="U1"
      connections={connections}
      showPinAliases
      schSectionName={schSections.rp2040(name)}
      pcbX={0}
      pcbY={0.5}
      schX={-0.08}
      schY={-2.5}
      schWidth={2.8}
      schHeight={5.8}
    />
    <W25Q16JVUXIQ
      name="U2"
      schSectionName={schSections.flash(name)}
      pcbX={-3.8}
      pcbY={9.5}
      schX={17}
      schY={-4}
      schHeight={2}
      schPinArrangement={{
        leftSide: [8, 1, 2, 3, 5, 6, 7, 4, 9],
      }}
      pcbRotation={90}
    />
    <AP2112K_3_3TRG1
      name="U3"
      schSectionName={schSections.power(name)}
      pcbX={-9}
      pcbY={13}
      pcbRotation={180}
      schX={1.3}
      schY={-7.8}
      schHeight={0.6}
    />

    <X322512MSB4SI
      name="Y1"
      maxTraceLength="20mm"
      schSectionName={schSections.clock(name)}
      pcbX={-2.8}
      pcbY={-8}
      schX={1.2}
      schY={-12.5}
      pcbRotation={180}
    />
    <SKRPACE010
      name="SW_BOOT"
      schSectionName={schSections.controls(name)}
      pcbX={8.5}
      pcbY={12.5}
      schX={8.6}
      schY={-12}
    />
    <SKRPACE010
      name="SW_RUN"
      schSectionName={schSections.controls(name)}
      pcbX={8.5}
      pcbY={-7.5}
      pcbRotation={90}
      schX={12.8}
      schY={-12}
    />
    <XL_1608SURC_06
      name="D1"
      color="green"
      schSectionName={schSections.status(name)}
      pcbX={10}
      pcbY={4.2}
      pcbRotation={90}
      schX={10.4}
      schY={-13.2}
      schRotation={90}
    />
    <XL_1608SURC_06
      name="D_PWR"
      color="green"
      schSectionName={schSections.status(name)}
      pcbX={-8}
      pcbY={17.5}
      pcbRotation={0}
      schX={14.5}
      schY={-13.4}
      schRotation={90}
    />

    <resistor
      name="R_BOOT"
      resistance="10k"
      footprint="0402"
      schSectionName={schSections.controls(name)}
      pcbX={9}
      pcbY={9}
      pcbRotation={90}
      schX={8.6}
      schY={-13.5}
      schRotation={90}
    />
    <resistor
      name="R_LED"
      resistance="330"
      footprint="0402"
      schSectionName={schSections.status(name)}
      pcbX={7.2}
      pcbY={1.2}
      pcbRotation={90}
      schX={10.4}
      schY={-12.2}
      schRotation={270}
    />
    <resistor
      name="R_PWR_LED"
      resistance="330"
      footprint="0402"
      schSectionName={schSections.status(name)}
      pcbX={-11}
      pcbY={18}
      pcbRotation={0}
      schX={14.5}
      schY={-12.2}
      schRotation={270}
    />
    <resistor
      name="R_CC1"
      resistance="5.1k"
      footprint="0402"
      schSectionName={schSections.usb(name)}
      pcbX={0}
      pcbY={11.5}
      pcbRotation={180}
      schX={7.2}
      schY={-7.5}
      schRotation={270}
    />
    <resistor
      name="R_CC2"
      resistance="5.1k"
      footprint="0402"
      schSectionName={schSections.usb(name)}
      pcbX={2}
      pcbY={11.5}
      schX={14.8}
      schY={-6.5}
      schRotation={270}
    />
    <resistor
      name="R_USB1"
      resistance="27"
      footprint="0402"
      schSectionName={schSections.usb(name)}
      pcbX={1.2}
      pcbY={9}
      schX={13.3}
      schY={-7.7}
      pcbRotation={90}
    />
    <resistor
      name="R_USB2"
      resistance="27"
      footprint="0402"
      schSectionName={schSections.usb(name)}
      pcbX={2.8}
      pcbY={9}
      schX={13.3}
      schY={-6.6}
      pcbRotation={90}
    />

    <capacitor
      name="C_VBUS"
      capacitance="10uF"
      footprint="0603"
      schSectionName={schSections.usb(name)}
      schOrientation="vertical"
      pcbX={-7.5}
      pcbY={15.5}
      pcbRotation={0}
      schX={9}
      schY={-2.2}
    />
    <capacitor
      name="C_3V3"
      capacitance="10uF"
      footprint="0603"
      schSectionName={schSections.power(name)}
      schOrientation="vertical"
      pcbX={-9}
      pcbY={9}
      schX={4.1}
      schY={-7.8}
    />
    <capacitor
      name="C_CORE"
      capacitance="1uF"
      footprint="0402"
      schSectionName={schSections.rp2040(name)}
      schOrientation="vertical"
      pcbX={2.5}
      pcbY={5.7}
      schX={-3.65}
      schY={-3.7}
      pcbRotation={90}
    />
    <capacitor
      name="C_USB"
      capacitance="1uF"
      footprint="0402"
      schSectionName={schSections.usb(name)}
      schOrientation="vertical"
      pcbX={6}
      pcbY={9}
      schX={10.8}
      schY={-2.2}
    />
    <capacitor
      name="C_XIN"
      capacitance="18pF"
      footprint="0402"
      schSectionName={schSections.clock(name)}
      schOrientation="vertical"
      pcbX={0}
      pcbY={-8}
      schX={0.4}
      schY={-14.2}
      pcbRotation={90}
    />
    <capacitor
      name="C_XOUT"
      capacitance="18pF"
      footprint="0402"
      schSectionName={schSections.clock(name)}
      schOrientation="vertical"
      pcbX={-5.5}
      pcbY={-8}
      schX={2.2}
      schY={-14.2}
      pcbRotation={90}
    />
    <inductor
      name="L_AVDD"
      inductance="600ohm@100MHz"
      footprint="0603"
      schSectionName={schSections.power(name)}
      pcbX={8.5}
      pcbY={6}
      supplierPartNumbers={{ jlcpcb: ["C1002"] }}
      schX={3.7}
      schY={-9.2}
      pcbRotation={90}
    />

    <trace
      {...denseTraceProps}
      name="QSPI_SS"
      from=".U1 > .QSPI_SS"
      to=".U2 > .CS"
      schDisplayLabel="QSPI_SS"
    />
    <trace
      {...denseTraceProps}
      name="QSPI_SD0"
      pcbPath={[
        ".U1 > .QSPI_SD0",
        { x: -1.40035, y: 3.8656 },
        { x: -1.564, y: 4.2154 },
        { x: -1.564, y: 4.2154, via: true, fromLayer: "top", toLayer: "bottom" },
        { x: -1.564, y: 4.2154 },
        { x: -4.3, y: 10.9 },
        { x: -4.3, y: 10.9, via: true, fromLayer: "bottom", toLayer: "top" },
        { x: -4.3, y: 10.9 },
        { x: -5.5, y: 10.5 },
        { x: -5.5, y: 9.75 },
        ".U2 > .pin5",
      ]}
      from=".U1 > .QSPI_SD0"
      to=".U2 > .pin5"
      schDisplayLabel="QSPI_SD0"
    />
    <trace
      {...denseTraceProps}
      name="QSPI_SD1"
      from=".U1 > .QSPI_SD1"
      to=".U2 > .pin2"
      schDisplayLabel="QSPI_SD1"
    />
    <trace
      {...denseTraceProps}
      name="QSPI_SD2"
      from=".U1 > .QSPI_SD2"
      to=".U2 > .pin3"
      schDisplayLabel="QSPI_SD2"
    />
    <trace
      {...denseTraceProps}
      name="QSPI_SD3"
      from=".U1 > .QSPI_SD3"
      to=".U2 > .pin7"
      schDisplayLabel="QSPI_SD3"
    />
    <trace
      {...denseTraceProps}
      name="QSPI_SCLK"
      from=".U1 > .QSPI_SCLK"
      to=".U2 > .CLK"
      schDisplayLabel="QSPI_SCLK"
    />

    <trace
      {...denseTraceProps}
      name="IOVDD1_P"
      from=".U1 > .IOVDD1"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="IOVDD2_P"
      from=".U1 > .IOVDD2"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="IOVDD3_P"
      from=".U1 > .IOVDD3"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="IOVDD4_P"
      from=".U1 > .IOVDD4"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="IOVDD5_P"
      from=".U1 > .IOVDD5"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="IOVDD6_P"
      from=".U1 > .IOVDD6"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="DVDD1_P"
      from=".U1 > .DVDD1"
      to="net.V1V1"
      {...v1v1Label}
    />
    <trace
      {...denseTraceProps}
      name="DVDD2_P"
      from=".U1 > .DVDD2"
      to="net.V1V1"
      {...v1v1Label}
    />
    <trace
      {...denseTraceProps}
      name="VREG_IN_P"
      from=".U1 > .VREG_IN"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace
      {...denseTraceProps}
      name="VREG_VOUT_P"
      from=".U1 > .VREG_VOUT"
      to="net.V1V1"
      {...v1v1Label}
    />
    <trace
      {...denseTraceProps}
      name="USB_VDD_P"
      from=".U1 > .USB_VDD"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="GND_G" from=".U1 > .GND" to="net.GND" {...gndLabel} />
    <trace
      {...denseTraceProps}
      name="USBV_IO1"
      from=".U1 > .USB_VDD"
      to=".U1 > .IOVDD1"
    />
    <trace name="VBUS_A" from=".J_USB > .A4B9" to="net.VBUS" {...vbusLabel} />
    <trace name="VBUS_B" from=".J_USB > .B4A9" to="net.VBUS" {...vbusLabel} />
    <trace name="USB_DN_A" from=".J_USB > .A7" to=".R_USB1 > .pin1" />
    <trace
      {...denseTraceProps}
      name="USB_DN"
      from=".R_USB1 > .pin2"
      to=".U1 > .USB_DM"
    />
    <trace name="USB_DP_A" from=".J_USB > .A6" to=".R_USB2 > .pin1" />
    <trace
      {...denseTraceProps}
      name="USB_DP"
      from=".R_USB2 > .pin2"
      to=".U1 > .USB_DP"
    />
    <trace
      {...denseTraceProps}
      name="CC1"
      from=".J_USB > .A5"
      to=".R_CC1 > .pin1"
    />
    <trace
      {...denseTraceProps}
      name="CC2"
      from=".J_USB > .B5"
      to=".R_CC2 > .pin1"
    />
    <trace
      {...denseTraceProps}
      name="USB_G"
      from=".J_USB > .A1B12"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      {...denseTraceProps}
      name="USB_G_B"
      from=".J_USB > .B1A12"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      {...denseTraceProps}
      name="USB_EH1"
      from=".J_USB > .EH1"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      {...denseTraceProps}
      name="USB_EH1_ALT"
      from=".J_USB > .pin13_alt1"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      {...denseTraceProps}
      name="USB_EH2"
      from=".J_USB > .EH2"
      to="net.GND"
      {...gndLabel}
    />
    <trace
      {...denseTraceProps}
      name="USB_EH2_ALT"
      from=".J_USB > .pin14_alt1"
      to="net.GND"
      {...gndLabel}
    />
    <trace name="CC1_G" from=".R_CC1 > .pin2" to="net.GND" {...gndLabel} />
    <trace name="CC2_G" from=".R_CC2 > .pin2" to="net.GND" {...gndLabel} />

    <trace name="VBUS_C" from="net.VBUS" to=".C_VBUS > .pin1" {...vbusLabel} />
    <trace name="VBUS_G" from=".C_VBUS > .pin2" to="net.GND" {...gndLabel} />

    <trace name="VSYS_IN" from="net.VSYS" to=".U3 > .VIN" {...vsysLabel} />

    <trace name="REG_3V3" from=".U3 > .VOUT" to="net.V3V3" {...v3v3Label} />
    <trace name="REG_G" from=".U3 > .GND" to="net.GND" {...gndLabel} />
    <trace name="C3V3_P" from=".C_3V3 > .pin1" to="net.V3V3" {...v3v3Label} />
    <trace name="C3V3_G" from=".C_3V3 > .pin2" to="net.GND" {...gndLabel} />
    <trace name="CORE_P" from=".C_CORE > .pin1" to="net.V1V1" {...v1v1Label} />
    <trace name="CORE_G" from=".C_CORE > .pin2" to="net.GND" {...gndLabel} />
    <trace name="CUSB_P" from=".C_USB > .pin1" to="net.V3V3" {...v3v3Label} />
    <trace name="CUSB_G" from=".C_USB > .pin2" to="net.GND" {...gndLabel} />
    <trace name="AVDD_IN" from=".L_AVDD > .pin1" to="net.V3V3" {...v3v3Label} />
    <trace
      name="AVDD"
      from=".L_AVDD > .pin2"
      to="net.ADC_VREF"
      {...adcRefLabel}
    />
    <trace
      name="ADC_AVDD"
      from=".U1 > .ADC_AVDD"
      to="net.ADC_VREF"
      {...adcRefLabel}
    />
    <trace name="FLSH_GND" from=".U2 > .GND" to="net.GND" {...gndLabel} />
    <trace name="FLSH_VCC" from=".U2 > .VCC" to="net.V3V3" {...v3v3Label} />
    <trace name="FLSH_EP" from=".U2 > .EP" to="net.GND" {...gndLabel} />

    <trace
      name="XIN"
      from=".U1 > .XIN"
      to=".Y1 > .X1"
      thickness="0.1mm"
      pcbPath={[
        ".U1 > .XIN",
        { x: -0.60015, y: -4.8 },
        { x: -1.7, y: -5.9 },
        ".Y1 > .X1",
      ]}
    />
    <trace
      name="XOUT"
      from=".Y1 > .X2"
      to=".R_XOSC > .pin1"
      thickness="0.1mm"
      pcbPath={[
        ".Y1 > .X2",
        { x: 1.1, y: 2 },
        { x: -3.6, y: 2 },
        ".R_XOSC > .pin1",
      ]}
    />
    <trace
      name="XOUT_DRIVE"
      from=".U1 > .XOUT"
      to=".R_XOSC > .pin2"
      thickness="0.1mm"
      pcbPath={[
        ".U1 > .XOUT",
        { x: -0.20005, y: -4 },
        { x: 0.8, y: -4.8 },
        ".R_XOSC > .pin2",
      ]}
    />
    <trace name="CXIN" from=".C_XIN > .pin1" to=".Y1 > .X1"
      pcbPath={[".C_XIN > .pin1", ".Y1 > .X1"]} thickness="0.1mm" />
    <trace name="CXIN_G" from=".C_XIN > .pin2" to="net.GND" {...gndLabel} />
    <trace name="CXOUT" from=".C_XOUT > .pin1" to=".Y1 > .X2" />
    <trace name="CXOUT_G" from=".C_XOUT > .pin2" to="net.GND" {...gndLabel} />

    <trace name="BOOT_SW" from=".SW_BOOT > .pin1" to=".R_BOOT_SER > .pin1" />
    <trace name="BOOT_LIMIT" from=".R_BOOT_SER > .pin2" to=".U1 > .QSPI_SS" />
    <trace name="BOOT_G" from=".SW_BOOT > .pin3" to="net.GND" {...gndLabel} />
    <trace name="BOOT_R" from=".R_BOOT > .pin1" to=".U1 > .QSPI_SS" />
    <trace
      name="BOOT_3V3"
      from=".R_BOOT > .pin2"
      to="net.V3V3"
      {...v3v3Label}
    />
    <trace name="RUN_SW" from=".SW_RUN > .pin1" to=".U1 > .RUN" />
    <trace name="RUN_G" from=".SW_RUN > .pin4" to="net.GND" {...gndLabel} />

    <trace name="LED_GP25" from=".U1 > .GPIO25" to=".R_LED > .pin1" />
    <trace name="LED_D1" from=".R_LED > .pin2" to=".D1 > .anode" />
    <trace name="LED_G" from=".D1 > .cathode" to="net.GND" {...gndLabel} />
    <trace
      name="PLED_3V3"
      from="net.V3V3"
      to=".R_PWR_LED > .pin1"
      {...v3v3Label}
    />
    <trace name="PLED_D" from=".R_PWR_LED > .pin2" to=".D_PWR > .anode" />
    <trace name="PLED_G" from=".D_PWR > .cathode" to="net.GND" {...gndLabel} />

    <resistor
      name="R_BOOT_SER"
      resistance="1k"
      footprint="0402"
      pcbX={6.5}
      pcbY={8}
      schX={7}
      schY={-10.5}
      schSectionName={schSections.controls(name)}
    />
    <resistor
      name="R_XOSC"
      resistance="1k"
      footprint="0402"
      pcbX={0.8}
      pcbY={-5}
      schX={3.3}
      schY={-12.5}
      schSectionName={schSections.clock(name)}
      pcbRotation={90}
    />
    <capacitor
      name="C_REG_IN"
      capacitance="1uF"
      footprint="0603"
      pcbX={-11}
      pcbY={10.5}
      schX={-1}
      schY={-7.8}
      schOrientation="vertical"
      schSectionName={schSections.power(name)}
      pcbRotation={0}
    />
    <capacitor
      name="C_REG_OUT"
      capacitance="1uF"
      footprint="0603"
      pcbX={-11}
      pcbY={16}
      schX={5.7}
      schY={-7.8}
      schOrientation="vertical"
      schSectionName={schSections.power(name)}
      pcbRotation={0}
    />
    <capacitor
      name="C_VREG_IN"
      capacitance="1uF"
      footprint="0402"
      pcbX={4.1}
      pcbY={5.7}
      schX={-10.5}
      schY={-9.2}
      schOrientation="vertical"
      schSectionName={schSections.rp2040(name)}
      pcbRotation={90}
    />
    <capacitor
      name="C_DVDD1"
      capacitance="100nF"
      footprint="0402"
      pcbX={-2.4}
      pcbY={5.7}
      schX={-8.5}
      schY={-9.2}
      schOrientation="vertical"
      schSectionName={schSections.rp2040(name)}
      pcbRotation={90}
    />
    <capacitor
      name="C_DVDD2"
      capacitance="100nF"
      footprint="0402"
      pcbX={4.6}
      pcbY={-5}
      schX={-6.5}
      schY={-9.2}
      schOrientation="vertical"
      schSectionName={schSections.rp2040(name)}
      pcbRotation={270}
    />
    <trace name="CREGI_P" from=".C_REG_IN > .pin1" to="net.VSYS" />
    <trace name="CREGI_G" from=".C_REG_IN > .pin2" to="net.GND" />
    <trace name="CREGO_P" from=".C_REG_OUT > .pin1" to="net.V3V3" />
    <trace name="CREGO_G" from=".C_REG_OUT > .pin2" to="net.GND" />
    <trace name="CVREG_P" from=".C_VREG_IN > .pin1" to="net.V3V3" />
    <trace name="CVREG_G" from=".C_VREG_IN > .pin2" to="net.GND" />
    <trace name="CDVDD1_P" from=".C_DVDD1 > .pin1" to="net.V1V1" />
    <trace name="CDVDD1_G" from=".C_DVDD1 > .pin2" to="net.GND" />
    <trace name="CDVDD2_P" from=".C_DVDD2 > .pin1" to="net.V1V1" />
    <trace name="CDVDD2_G" from=".C_DVDD2 > .pin2" to="net.GND" />
    {/* Keep ground vias outside the crystal/capacitor pad gaps. Points are in
        Y1's local frame (180 degree rotation at -2.8,-8). */}
    <trace
      name="XOSC_GROUND_LINK"
      from=".Y1 > .pin2"
      to=".C_XIN > .pin2"
      thickness="0.15mm"
      pcbPath={[
        ".Y1 > .pin2",
        { x: -1.8, y: 1.5 },
        { x: -1.8, y: 1.5, via: true, fromLayer: "top", toLayer: "bottom" },
        { x: -1.8, y: 1.5 },
        { x: -2.5, y: -1.8 },
        { x: -2.5, y: -1.8, via: true, fromLayer: "bottom", toLayer: "top" },
        { x: -2.5, y: -1.8 },
        ".C_XIN > .pin2",
      ]}
    />
    <copperpour name="GND_BOTTOM" connectsTo="net.GND" layer="bottom" />
    <silkscreentext text="BOOT" fontSize={0.75} pcbX={8.5} pcbY={15.5} />
    <silkscreentext text="RUN" fontSize={0.75} pcbX={8.5} pcbY={-10.3} />
    <silkscreentext text="PWR" fontSize={0.65} pcbX={-7.5} pcbY={18.5} />
    {children}
  </subcircuit>
);
