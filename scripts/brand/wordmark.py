"""Outlines the AgentGuard wordmark from Inter Variable (OFL) at a fixed weight so the logo never depends on a font."""
import json, sys, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
SRC, WGHT, TEXT, TRACK = "brand/fonts/InterVariable-latin.woff2", 620, "AgentGuard", -0.022
f = TTFont(SRC); f.flavor = None
inst = instantiateVariableFont(f, {"wght": WGHT, **({"opsz": 32} if "opsz" in [a.axisTag for a in f["fvar"].axes] else {})})
import io; buf = io.BytesIO(); inst.save(buf); data = buf.getvalue()
face = hb.Face(data); font = hb.Font(face); upem = face.upem
b = hb.Buffer(); b.add_str(TEXT); b.guess_segment_properties(); hb.shape(font, b, {"kern": True, "liga": True})
gs = inst.getGlyphSet(); order = inst.getGlyphOrder(); cap = inst["OS/2"].sCapHeight
pen = SVGPathPen(gs); x = 0
for info, pos in zip(b.glyph_infos, b.glyph_positions):
    g = order[info.codepoint]
    gs[g].draw(TransformPen(pen, (1, 0, 0, -1, x + pos.x_offset, 0)))
    x += pos.x_advance + TRACK * upem
x -= TRACK * upem
json.dump({"d": pen.getCommands(), "width": x, "cap": cap, "upem": upem, "weight": WGHT}, open("/tmp/wordmark.json", "w"))
print("width", x, "cap", cap)
