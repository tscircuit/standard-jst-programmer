import type { BoardProps } from "@tscircuit/props"
import { StandardJstSwdUpward } from "../connectors"
export default (props: BoardProps = {}) => <board {...props} width={14} height={10}>
  <StandardJstSwdUpward name="J1" />
</board>
