import { fanoutTracePath } from "@tscircuit/props";
import powerPaths from "./finishing-paths.json";
import signalPaths from "./signal-finishing-paths.json";

const powerTracePaths = powerPaths.map((path) => fanoutTracePath.parse(path));
const signalTracePaths = signalPaths.map((path) => fanoutTracePath.parse(path));

/**
 * Checked copper paths in programmer-local millimetres (+X right, +Y up).
 * Power/SWCLK are placed first. The default router handles unsaved connections;
 * individual signal phases then apply the checked finishing paths. Each phase
 * binds through RoutedTrace, including when its endpoint is a shared junction.
 */
export function ProgrammerFinishingTraces() {
  return <>
    <autoroutingphase name="power-and-clock" phaseIndex={1} pcbTracePaths={powerTracePaths} />
    {signalTracePaths.map((path, index) => <autoroutingphase
      key={`finish-signal-${index + 1}`}
      name={`finish-signal-${index + 1}`}
      phaseIndex={index + 3}
      reroute
      connections={[]}
      pcbTracePaths={[path]}
    />)}
  </>;
}
