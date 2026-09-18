import type { BoardProps } from "@tscircuit/props"
import { StandardJstSwdSide } from "../connectors"
export default (props: BoardProps = {}) => <board {...props} width={14} height={11}>
  <StandardJstSwdSide name="J1" />
</board>
