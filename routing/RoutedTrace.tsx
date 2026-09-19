import { getSchematicSignalLabel } from "../schematic/signal-labels";
import type { TraceProps } from "@tscircuit/props";
import finishingPaths from "./signal-finishing-paths.json";

// The default router runs phase 2 for connections without saved finishing paths.
// Saved connections run once in their explicit phases.
export function RoutedTrace(props: TraceProps) {
  const index = "from" in props && "to" in props
    ? finishingPaths.findIndex(
        (path) => path.from === props.from && path.to === props.to,
      )
    : -1;
  const label = "from" in props && "to" in props
    && typeof props.from === "string" && typeof props.to === "string"
    ? getSchematicSignalLabel(props.from, props.to)
    : undefined;
  return <trace {...props} schDisplayLabel={label ?? props.schDisplayLabel}
    routingPhaseIndex={index < 0 ? 2 : index + 3} />;
}
