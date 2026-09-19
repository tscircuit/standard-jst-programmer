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
  return <trace {...props} routingPhaseIndex={index < 0 ? 2 : index + 3} />;
}
