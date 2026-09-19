import type { TraceProps } from "@tscircuit/props";
import finishingPaths from "./signal-finishing-paths.json";

// The default router runs phase 2. Selected connections also have a later
// explicit finishing phase; phase 2 uses reroute to keep both scheduled.
export function RoutedTrace(props: TraceProps) {
  const index = "from" in props && "to" in props
    ? finishingPaths.findIndex(
        (path) => path.from === props.from && path.to === props.to,
      )
    : -1;
  return <trace {...props} routingPhaseIndex={index < 0 ? 2 : index + 3} />;
}
