import layout from "./programmer-routes.json"

/** Reviewed route geometry. Reject changed placement/connectivity instead of stretching copper. */
export async function lockedProgrammerRoutes(input: any) {
  // Panel display placement translates the entire board. Preserve local copper geometry.
  const savedPoints = layout.connections.flatMap(c => c.key.split(";").map(p => p.split(",").slice(0,2).map(Number)))
  const livePoints = input.connections.flatMap((c: any) => c.pointsToConnect)
  const dx = +(Math.min(...livePoints.map((p: any) => p.x)) - Math.min(...savedPoints.map(p => p[0]!))).toFixed(4)
  const dy = +(Math.min(...livePoints.map((p: any) => p.y)) - Math.min(...savedPoints.map(p => p[1]!))).toFixed(4)
  const byKey = new Map<string, any>()
  for (const saved of layout.connections) {
    const points = saved.key.split(";").map(p => {const [x,y,layer] = p.split(","); return {x:Number(x),y:Number(y),layer}})
    const matches = input.connections.filter((live: any) => live.pointsToConnect.length === points.length && points.every(p =>
      live.pointsToConnect.some((q: any) => q.layer === p.layer && Math.hypot(q.x-dx-p.x,q.y-dy-p.y) < 0.0001)))
    if (matches.length !== 1) throw new Error("Programmer placement/connectivity changed; regenerate and validate its saved routes")
    byKey.set(saved.key, matches[0])
  }
  if (input.connections.length !== layout.connections.length) throw new Error("Programmer connection count changed")
  const translate = (p: any) => ({...p, x:p.x+dx, y:p.y+dy})
  const traces = layout.connections.flatMap((saved, ci) => {
    const live = byKey.get(saved.key) as any
    return saved.routes.map((route, ri) => ({
      type: "pcb_trace", pcb_trace_id: `locked_${live.name}_${ci}_${ri}`,
      connection_name: live.name,
      connectsTo: [live.source_trace_id, ...live.pointsToConnect.map((p: any) => p.pointId)].filter(Boolean),
      route: route.map((p: any) => p.route_type === "through_pad" ? {...p, start:translate(p.start), end:translate(p.end)} : translate(p)),
    }))
  })
  const listeners: Record<string, (event: any) => void> = {}
  return {
    on(event: string, callback: (event: any) => void) { listeners[event] = callback },
    start() { listeners.complete?.({ traces }) },
    stop() {},
  }
}
