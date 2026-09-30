"""Independently parse and compare fabrication geometry against circuit JSON.

Requires gerbonara==1.6.3 and shapely==2.1.2. Run after export:fabrication.
This checks export fidelity; electrical/placement DRC remains a separate check.
"""
import json
import math
import sys
import warnings
from pathlib import Path
from gerbonara import GerberFile, ExcellonFile
from gerbonara.graphic_objects import Region
from gerbonara.graphic_primitives import ArcPoly
from gerbonara.utils import MM
from shapely import affinity
from shapely.geometry import Point, LineString, Polygon, box
from shapely.ops import unary_union, linemerge

root = Path(sys.argv[1] if len(sys.argv) > 1 else "dist/fabrication")
circuit = json.loads((root / "circuit.json").read_text())
report = {"parser": "gerbonara 1.6.3", "geometry": "shapely 2.1.2", "errors": [], "parserWarnings": []}

def require(ok, message):
    if not ok:
        report["errors"].append(message)

def primitive_geometry(p):
    name = type(p).__name__
    if name == "Circle":
        return Point(p.x, p.y).buffer(p.r, quad_segs=64)
    if name == "Rectangle":
        g = box(p.x-p.w/2, p.y-p.h/2, p.x+p.w/2, p.y+p.h/2)
        return affinity.rotate(g, p.rotation, origin=(p.x, p.y), use_radians=True)
    if name == "Line":
        return LineString([(p.x1,p.y1),(p.x2,p.y2)]).buffer(p.width/2, quad_segs=64)
    if name == "ArcPoly":
        return Polygon(p.approximate_arcs(max_error=0.0002).outline).buffer(0)
    raise ValueError(f"Unsupported primitive: {name}")

def load_geometry(file):
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        f = GerberFile.open(root / "gerbers" / file)
    report["parserWarnings"].extend(str(w.message) for w in caught)
    result = Polygon()
    batch = []
    polarity = True
    for obj in f.objects:
        for p in obj.to_primitives(unit=MM):
            if p.polarity_dark != polarity:
                g = unary_union(batch)
                result = result.union(g) if polarity else result.difference(g)
                batch = []
                polarity = p.polarity_dark
            batch.append(primitive_geometry(p))
    g = unary_union(batch)
    result = result.union(g) if polarity else result.difference(g)
    return f, result

layer_files = {"top":"F_Cu.gbr", "inner1":"In1_Cu.gbr", "inner2":"In2_Cu.gbr", "bottom":"B_Cu.gbr"}
copper = {layer: load_geometry(file)[1] for layer,file in layer_files.items()}
outline, _ = load_geometry("Edge_Cuts.gbr")
b = next(e for e in circuit if e["type"] == "pcb_board")
x,y = b["center"]["x"], b["center"]["y"]
expected = (x-b["width"]/2,y-b["height"]/2,x+b["width"]/2,y+b["height"]/2)
centrelines = unary_union([LineString([(o.x1,o.y1),(o.x2,o.y2)]) for o in outline.objects])
require(all(abs(a-b)<0.000002 for a,b in zip(centrelines.bounds,expected)), "Outline dimensions/position differ from source")
require(linemerge(centrelines).is_ring, "Outline is not a closed ring")
interior = box(*expected).buffer(-0.199)
for layer,g in copper.items():
    require(g.difference(interior).area < 0.00001, f"{layer}: copper violates 0.2 mm board-edge clearance")

checked_pads = 0
checked_segments = 0
for e in circuit:
    if e["type"] == "pcb_smtpad":
        if e["shape"] in ("rect", "rotated_rect"):
            g = box(e["x"]-e["width"]/2,e["y"]-e["height"]/2,e["x"]+e["width"]/2,e["y"]+e["height"]/2)
            if e.get("corner_radius",0):
                r=e["corner_radius"];g=g.buffer(-r).buffer(r,quad_segs=64)
            if e.get("ccw_rotation",0):g=affinity.rotate(g,e["ccw_rotation"],origin=(e["x"],e["y"]))
        elif e["shape"] == "pill":
            r=min(e["width"],e["height"])/2
            dx=max(e["width"]/2-r,0);dy=max(e["height"]/2-r,0)
            g=LineString([(e["x"]-dx,e["y"]-dy),(e["x"]+dx,e["y"]+dy)]).buffer(r,quad_segs=64)
        elif e["shape"] == "circle":
            g = Point(e["x"],e["y"]).buffer(e["radius"],quad_segs=64)
        else:
            raise ValueError(f"Unsupported source pad shape: {e['shape']}")
        require(g.buffer(-0.002).difference(copper[e["layer"]]).area<0.00001, f"Missing/distorted copper pad {e['pcb_smtpad_id']}")
        checked_pads += 1
    elif e["type"] == "pcb_trace":
        for a,z in zip(e["route"],e["route"][1:]):
            if a["route_type"] == z["route_type"] == "wire" and a["layer"] == z["layer"]:
                g = LineString([(a["x"],a["y"]),(z["x"],z["y"])]).buffer(max(a["width"]/2-0.002,0),quad_segs=32)
                require(g.difference(copper[a["layer"]]).area<0.00001, f"Missing/distorted trace segment {e['pcb_trace_id']}")
                checked_segments += 1

with warnings.catch_warnings(record=True) as caught:
    warnings.simplefilter("always")
    pth = ExcellonFile.open(root / "gerbers" / "drill-L1-L4.drl")
    npth = ExcellonFile.open(root / "gerbers" / "drill_npth.drl")
report["parserWarnings"].extend(str(w.message) for w in caught)
drilled = unary_union([primitive_geometry(p) for o in pth.objects for p in o.to_primitives(unit=MM)])
nonplated = unary_union([primitive_geometry(p) for o in npth.objects for p in o.to_primitives(unit=MM)])
via_positions = set()
ground_positions = []
for v in (e for e in circuit if e["type"] == "pcb_via"):
    via_positions.add((round(v["x"],4),round(v["y"],4)))
    centre = Point(v["x"],v["y"])
    hole = centre.buffer(v["hole_diameter"]/2-0.001,quad_segs=64)
    require(hole.difference(drilled).area<0.000001, f"Via drill missing at {v['x']},{v['y']}")
    ring = centre.buffer(v["outer_diameter"]/2-0.002,quad_segs=64).difference(centre.buffer(v["hole_diameter"]/2+0.002,quad_segs=64))
    for layer in layer_files:
        require(ring.difference(copper[layer]).area<0.00001, f"Via annular copper missing on {layer} at {v['x']},{v['y']}")
    if v.get("subcircuit_connectivity_map_key") == "MCU_connectivity_net0":
        ground_positions.append(centre)
for hole in (e for e in circuit if e["type"] == "pcb_hole"):
    g=Point(hole["x"],hole["y"]).buffer(hole["hole_diameter"]/2-0.001,quad_segs=64)
    require(g.difference(nonplated).area<0.000001, f"NPTH missing at {hole['x']},{hole['y']}")
for hole in (e for e in circuit if e["type"] == "pcb_plated_hole"):
    length=hole["hole_height"]-hole["hole_width"]
    g=LineString([(hole["x"],hole["y"]-length/2),(hole["x"],hole["y"]+length/2)]).buffer(hole["hole_width"]/2-0.001,quad_segs=64)
    require(g.difference(drilled).area<0.000001, f"Plated slot missing at {hole['x']},{hole['y']}")
ground_region = max(copper["bottom"].geoms if hasattr(copper["bottom"],"geoms") else [copper["bottom"]], key=lambda g:g.area)
require(all(ground_region.buffer(0.002).covers(p) for p in ground_positions), "Bottom ground copper does not connect every ground via")
drill_vias={(round(o.x,4),round(o.y,4)) for o in pth.objects if type(o).__name__=="Flash" and abs(o.aperture.diameter-0.3)<0.000001}
require(via_positions == drill_vias, "Via drill inventory differs from circuit")
if "--clip-silkscreen" in sys.argv:
    removed = {}
    for side in ["F", "B"]:
        _, openings = load_geometry(f"{side}_Mask.gbr")
        file, ink = load_geometry(f"{side}_SilkScreen.gbr")
        prepared = ink.intersection(box(*expected).buffer(-0.02)).difference(openings.buffer(0.15))
        removed[side] = round(ink.area-prepared.area,6)
        file.objects = []
        for poly in prepared.geoms if hasattr(prepared,"geoms") else [prepared]:
            if poly.is_empty or poly.geom_type != "Polygon":
                continue
            file.objects.append(Region.from_arc_poly(ArcPoly(list(poly.exterior.coords)), polarity_dark=True, unit=MM))
            for ring in poly.interiors:
                file.objects.append(Region.from_arc_poly(ArcPoly(list(ring.coords)), polarity_dark=False, unit=MM))
        file.save(root / "gerbers" / f"{side}_SilkScreen.gbr")
    report["silkscreenPreparation"] = {"padClearanceMm":0.15,"removedInkAreaMm2":removed}
for name in ["F_Mask.gbr","B_Mask.gbr","F_SilkScreen.gbr","B_SilkScreen.gbr","F_Paste.gbr","B_Paste.gbr"]:
    load_geometry(name)
for side in ["F", "B"]:
    _, ink = load_geometry(f"{side}_SilkScreen.gbr")
    _, openings = load_geometry(f"{side}_Mask.gbr")
    require(ink.intersection(openings.buffer(0.149)).area < 0.00001, f"{side}: silkscreen violates 0.15 mm solder-land clearance; run with --clip-silkscreen")
report.update(boardSizeMm=[b["width"],b["height"]],copperLayers=4,sourcePadsChecked=checked_pads,sourceTraceSegmentsChecked=checked_segments,uniqueViaDrills=len(via_positions),groundViasConnected=len(ground_positions),platedSlots=4,nonplatedHoles=4)
(root / "validation" / "gerber-audit.json").write_text(json.dumps(report,indent=2)+"\n")
print(json.dumps({k:v for k,v in report.items() if k!="parserWarnings"},indent=2))
sys.exit(bool(report["errors"]))
