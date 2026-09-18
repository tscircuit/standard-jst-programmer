import type { BoardProps } from "@tscircuit/props"
import { StandardJstSwdUpward, StandardJstPowerUpward } from "../connectors"
export default (props: BoardProps = {}) => <board {...props} width={20} height={12}>
  <StandardJstSwdUpward name="J1" pcbX={-4.5} pcbY={-1} pcbStyle={{silkscreenTextVisibility:"hidden"}} />
  <StandardJstPowerUpward name="J2" pcbX={4.5} pcbY={-1} pcbStyle={{silkscreenTextVisibility:"hidden"}} />
  <silkscreentext text="SWD" pcbX={-4.5} pcbY={4.7} fontSize={0.8} />
  <silkscreentext text="1:CLK 2:GND 3:DIO" pcbX={-4.5} pcbY={3.5} fontSize={0.55} />
  <silkscreentext text="POWER" pcbX={4.5} pcbY={4.7} fontSize={0.8} />
  <silkscreentext text="1:VOUT 2:GND" pcbX={4.5} pcbY={3.5} fontSize={0.55} />
</board>
