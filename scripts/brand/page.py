"""Generates web/brand.html (brand guidelines) from brand/tokens.css, the icon manifest and the glyphs."""
import json, re, pathlib
R = pathlib.Path(__file__).resolve().parents[2]
css = (R/"brand/tokens.css").read_text()
light = dict(re.findall(r"--([a-z0-9-]+):(#[0-9A-Fa-f]{6})", css.split(":root[data-theme=dark]")[0]))
dark = dict(re.findall(r"--([a-z0-9-]+):(#[0-9A-Fa-f]{6})", css.split(":root[data-theme=dark]")[1].split("}")[0]))
def lum(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)]; c=[x/12.92 if x<=.03928 else ((x+.055)/1.055)**2.4 for x in c]
    return .2126*c[0]+.7152*c[1]+.0722*c[2]
def cr(a,b):
    la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+.05)/(lb+.05)
def grade(r): return "AAA" if r>=7 else "AA" if r>=4.5 else "AA large" if r>=3 else "fail"
icons = json.loads((R/"brand/manifest.json").read_text())["lucide"]
glyphs = sorted(p.stem for p in (R/"brand/glyphs").glob("*.svg"))
GL = {"mandate":"Mandate: the signed bounds","passkey":"Passkey: a human signature","bounds":"Bounds: limits enforced at capture","receipt":"Receipt: portable proof","anchor":"Anchor: timestamped audit head"}
def ramp(name):
    ks=[k for k in light if k.startswith(name+"-")]
    return "".join(f'<div class="sw-cell" style="background:{light[k]};color:{"#0B0D12" if lum(light[k])>.35 else "#FFFFFF"}"><b>{k.split("-")[1]}</b><span>{light[k]}</span></div>' for k in ks)
roles=[("text","bg","Body text"),("text-2","bg","Secondary text"),("text-3","bg","Tertiary text"),("accent","bg","Accent / links"),("accent-fg","accent","Primary button label"),("success","success-bg","VALID"),("danger","danger-bg","INVALID"),("warning","warning-bg","Held / warning")]
def crow(fg,bg,label):
    out=[]
    for name,t in (("Light",light),("Dark",dark)):
        r=cr(t[fg],t[bg]); out.append(f'<td><span class="chip" style="background:{t[bg]};color:{t[fg]}">Aa</span> <span class="mono xs">{r:.1f}:1</span> <span class="badge {"badge-success" if r>=4.5 else "badge-warning"}">{grade(r)}</span></td>')
    return f'<tr><td>{label}<div class="mono xs muted">--{fg} on --{bg}</div></td>{"".join(out)}</tr>'
logos=[("agentguard-logo-light","Primary logo, light","light"),("agentguard-logo-dark","Primary logo, dark","dark"),("agentguard-mark-light","Mark, light","light"),("agentguard-mark-dark","Mark, dark","dark"),("agentguard-logo-mono-black","Mono black","light"),("agentguard-logo-mono-white","Mono white","dark")]
def tile(f,label,bg): return f'<figure class="logo-tile {bg}"><div class="logo-stage"><img src="/brand/logo/{f}.svg" alt="{label}" height="{40 if "mark" in f else 36}"></div><figcaption><span>{label}</span><a class="btn btn-ghost btn-sm" href="/brand/logo/{f}.svg" download>SVG</a></figcaption></figure>'
misuse=[("rotate(12deg)","Don't rotate the mark"),("scale(1.4,0.8)","Don't stretch or squash"),("none;filter:hue-rotate(140deg)","Don't recolor the core"),("none;opacity:.35","Don't reduce contrast")]
def mis(t,l): return f'<figure class="misuse"><div class="logo-stage"><img src="/brand/logo/agentguard-mark-light.svg" alt="" width="40" style="transform:{t}"></div><figcaption><svg class="i i-sm bad"><use href="/brand/icons.svg#i-x"/></svg>{l}</figcaption></figure>'
types=[("6xl","Display"),("4xl","Heading 1"),("2xl","Heading 2"),("lg","Lede"),("base","Body"),("sm","UI / table"),("xs","Caption")]
html=f'''<!doctype html>
<html lang="en">
<head>
<!--#include head-->
<title>Brand · AgentGuard</title>
<meta name="description" content="AgentGuard brand guidelines: logo, color, type, icons, glyphs and downloadable assets.">
</head>
<body>
<!--#include nav-->
<main id="main">
<section class="section" style="padding-top:56px"><div class="container stack gap-4" style="max-width:780px;margin-left:max(24px,calc((100% - var(--container))/2))">
  <span class="eyebrow">Brand</span>
  <h1 class="display">Bounds, held.</h1>
  <p class="lede">AgentGuard proves that an agent payment stayed inside limits a person signed. The identity says the same thing: two opposing brackets, the bounds of a mandate, hold a solid core, the payment. Quiet, exact, and checkable.</p>
  <div class="row gap-2"><a class="btn btn-primary" href="/brand/agentguard-brand.zip" download>Download kit (ZIP)</a><a class="btn btn-secondary" href="/brand/tokens.json">tokens.json</a><a class="btn btn-ghost" href="/brand/tokens.css">tokens.css</a></div>
</div></section>

<section class="section bt" id="logo"><div class="container stack gap-8">
  <div class="section-hd"><span class="eyebrow">01 · Logo</span><h2 class="h2">The mark</h2><p class="muted">A 32-unit grid on a 4-unit module. The brackets are 4 units thick; the core is 12 × 12, centred, a 4-unit gap from each bracket, all inside a 2-unit inset. Built from rectangles only, so it stays sharp at 16 px.</p></div>
  <div class="logo-grid">{"".join(tile(*l) for l in logos)}</div>
  <div class="cols-2">
    <figure class="card construct"><img src="/brand/logo/construction.svg" alt="Mark construction on a 32-unit grid" style="width:100%;height:auto;display:block"><figcaption class="card-bd small muted">Construction: 32-unit grid, 4-unit module, 2-unit inset, 4-unit gap.</figcaption></figure>
    <div class="stack gap-4">
      <div class="card"><div class="card-bd stack gap-3"><h3 class="h3">Clear space and size</h3>
        <div class="clear-demo"><img src="/brand/logo/agentguard-logo-light.svg" alt="" height="36"></div>
        <p class="small muted">Keep clear space equal to the core (12 units, ⅜ of the mark's height) on every side. Minimum size: mark 16 px, full logo 96 px wide. Below 24 px use the mark alone.</p></div></div>
      <div class="misuse-grid">{"".join(mis(*m) for m in misuse)}</div>
    </div>
  </div>
</div></section>

<section class="section bt" id="color"><div class="container stack gap-8">
  <div class="section-hd"><span class="eyebrow">02 · Color</span><h2 class="h2">Ink and cobalt</h2><p class="muted">Neutral ink carries almost everything. Cobalt is reserved for the core of the mark, primary actions and links. Status colors mean exactly one thing each: green is VALID, red is INVALID, amber is held for a human. No gradients.</p></div>
  <div class="stack gap-3"><div class="sw-row">{ramp("ink")}</div><div class="sw-row">{ramp("cobalt")}</div></div>
  <div class="card table-wrap"><table class="table"><thead><tr><th scope="col">Role</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead><tbody>{"".join(crow(*r) for r in roles)}</tbody></table></div>
</div></section>

<section class="section bt" id="type"><div class="container stack gap-8">
  <div class="section-hd"><span class="eyebrow">03 · Type</span><h2 class="h2">Inter and JetBrains Mono</h2><p class="muted">Inter for interface and prose, tight tracking at display sizes. JetBrains Mono for anything a machine checks: IDs, hashes, amounts in receipts, verdicts. Both self-hosted (SIL OFL), no third-party font requests.</p></div>
  <div class="card"><div class="card-bd stack gap-4">{"".join(f'<div class="type-row"><span class="mono xs muted">{k} · {l}</span><span style="font-size:var(--text-{k});line-height:var(--leading-{k});{"letter-spacing:var(--tracking-tighter);font-weight:620" if k in ("6xl","4xl","2xl") else ""}">{"Bounds, held." if k=="6xl" else "Verifiable intent for agent payments"}</span></div>' for k,l in types)}
    <div class="type-row"><span class="mono xs muted">mono · Evidence</span><span class="mono">poi_2b2b34d8c4bfa2e098cadba6 · 10.80 USD · <b style="color:var(--success)">VALID</b></span></div></div></div>
  <div class="cols-3">
    <div class="card"><div class="card-bd stack gap-2"><h3 class="h3">Radius</h3><div class="row gap-3">{"".join(f'<div class="rad" style="border-radius:var(--radius-{r})"><span class="mono xs">{r}</span></div>' for r in ("xs","sm","md","lg","xl"))}</div></div></div>
    <div class="card"><div class="card-bd stack gap-2"><h3 class="h3">Elevation</h3><div class="row gap-3">{"".join(f'<div class="rad" style="box-shadow:var(--shadow-{r});border-color:transparent"><span class="mono xs">{r}</span></div>' for r in ("xs","sm","md","lg"))}</div></div></div>
    <div class="card"><div class="card-bd stack gap-2"><h3 class="h3">Spacing</h3><div class="stack gap-1">{"".join(f'<div class="row gap-2"><span class="mono xs muted" style="width:28px">{s}</span><span class="sp" style="width:var(--space-{s})"></span></div>' for s in ("1","2","3","4","6","8","12"))}</div></div></div>
  </div>
</div></section>

<section class="section bt" id="icons"><div class="container stack gap-8">
  <div class="section-hd"><span class="eyebrow">04 · Icons and glyphs</span><h2 class="h2">One stroke, one grid</h2><p class="muted">Interface icons are Lucide (ISC), 24-unit grid, 2 px stroke, round caps, shipped as one SVG sprite. The five product glyphs are drawn on the same grid and stroke so they sit alongside them. Icons label, they never decorate.</p></div>
  <div class="glyph-grid">{"".join(f'<figure class="glyph-card"><img src="/brand/glyphs/{g}.svg" alt="" width="32" height="32" class="glyph-img"><figcaption><b>{g}</b><span class="xs muted">{GL.get(g,"").split(": ")[-1]}</span></figcaption></figure>' for g in glyphs)}</div>
  <div class="icon-grid">{"".join(f'<div class="icon-cell" title="{i}"><svg class="i"><use href="/brand/icons.svg#i-{i}"/></svg><span class="mono">{i}</span></div>' for i in icons)}</div>
</div></section>

<section class="section bt" id="voice"><div class="container stack gap-8">
  <div class="section-hd"><span class="eyebrow">05 · Voice</span><h2 class="h2">Say what is checked</h2></div>
  <div class="cols-2">
    <div class="card"><div class="card-bd stack gap-3"><h3 class="h3"><svg class="i ok-c"><use href="/brand/icons.svg#i-check"/></svg> Do</h3><ul class="checklist"><li>"Captured 10.80 USD on order 8FF97705JB819194D after your passkey approved it."</li><li>"INVALID: amount differs from the signed order."</li><li>"Sandbox" whenever money isn't real.</li></ul></div></div>
    <div class="card"><div class="card-bd stack gap-3"><h3 class="h3"><svg class="i bad"><use href="/brand/icons.svg#i-x"/></svg> Don't</h3><ul class="checklist neg"><li>"Bank-grade, military-grade, unhackable."</li><li>Shields, padlocks-with-checkmarks, glowing gradients, emoji.</li><li>Claim AP2 or PayPal endorsement. AgentGuard is AP2-style and runs on PayPal's public APIs.</li></ul></div></div>
  </div>
</div></section>

<section class="section bt" id="downloads"><div class="container stack gap-6">
  <div class="section-hd"><span class="eyebrow">06 · Downloads</span><h2 class="h2">Assets</h2></div>
  <div class="card table-wrap"><table class="table"><tbody>
    <tr><td>Complete kit (logos, icons, glyphs, tokens, fonts, OG)</td><td class="actions"><a class="btn btn-secondary btn-sm" href="/brand/agentguard-brand.zip" download>ZIP</a></td></tr>
    <tr><td>Design tokens</td><td class="actions"><a class="btn btn-ghost btn-sm" href="/brand/tokens.css">CSS</a><a class="btn btn-ghost btn-sm" href="/brand/tokens.json">JSON</a></td></tr>
    <tr><td>Icon sprite (Lucide subset + product glyphs)</td><td class="actions"><a class="btn btn-ghost btn-sm" href="/brand/icons.svg" download>SVG</a></td></tr>
    <tr><td>App icon and favicons</td><td class="actions"><a class="btn btn-ghost btn-sm" href="/brand/icons/app-icon.svg" download>SVG</a><a class="btn btn-ghost btn-sm" href="/brand/icons/icon-512.png" download>512 PNG</a><a class="btn btn-ghost btn-sm" href="/brand/icons/favicon.svg" download>favicon</a></td></tr>
    <tr><td>Open Graph image 1200 × 630</td><td class="actions"><a class="btn btn-ghost btn-sm" href="/brand/og/og-image.png" download>PNG</a></td></tr>
  </tbody></table></div>
  <img src="/brand/og/og-image.png" alt="AgentGuard Open Graph image" class="card" style="width:100%;max-width:720px;height:auto">
</div></section>
</main>
<!--#include footer-->
<script type="module" src="/assets/site.js"></script>
</body>
</html>
'''
(R/"web/brand.html").write_text(html)
print("wrote web/brand.html")
import zipfile
with zipfile.ZipFile(R/"brand/agentguard-brand.zip","w",zipfile.ZIP_DEFLATED) as z:
    for p in sorted((R/"brand").rglob("*")):
        if p.is_file() and p.suffix != ".zip": z.write(p, "agentguard-brand/"+str(p.relative_to(R/"brand")))
print("wrote brand/agentguard-brand.zip")
