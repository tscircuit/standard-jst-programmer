import type { BoardProps } from "@tscircuit/props"
import { StandardJstSwdUpward, StandardJstPowerUpward, StandardJstSwdResetUpward } from "../connectors"
export default (props: BoardProps = {}) => <board {...props} width={20} height={23}>
  <StandardJstSwdUpward name="J1" pcbX={-4.5} pcbY={4} pcbStyle={{silkscreenTextVisibility:"hidden"}} />
  <StandardJstPowerUpward name="J2" pcbX={4.5} pcbY={4} pcbStyle={{silkscreenTextVisibility:"hidden"}} />
  <silkscreentext text="SWD" pcbX={-4.5} pcbY={9.7} fontSize={0.8} />
  <silkscreentext text="1:CLK 2:GND 3:DIO" pcbX={-4.5} pcbY={8.5} fontSize={0.55} />
  <silkscreentext text="POWER" pcbX={4.5} pcbY={9.7} fontSize={0.8} />
  <silkscreentext text="1:VOUT 2:GND" pcbX={4.5} pcbY={8.5} fontSize={0.55} />
  <StandardJstSwdResetUpward name="J3" pcbX={0} pcbY={-6} pcbStyle={{silkscreenTextVisibility:"hidden"}} />
  <silkscreentext text="SWD+NRST" pcbX={0} pcbY={-1.2} fontSize={0.8} />
  <silkscreentext text="1:VOUT 2:DIO 3:GND 4:CLK 5:NRST" pcbX={0} pcbY={-2.5} fontSize={0.65} />
</board>
