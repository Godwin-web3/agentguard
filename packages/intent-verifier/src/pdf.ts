/** Tiny dependency-free PDF writer: monospaced text pages (PayPal dispute uploads accept PDF, JPG, GIF, PNG only). */
export function textPdf(lines: string[], title = "AgentGuard Proof-of-Intent"): Buffer {
  const W = 100, PER = 64; const wrapped: string[] = [];
  for (const l of lines) { const s = l.replace(/[^\x20-\x7E]/g, "?"); if (!s.length) wrapped.push(""); for (let i = 0; i < s.length; i += W) wrapped.push(s.slice(i, i + W)); }
  const pages: string[][] = []; for (let i = 0; i < wrapped.length; i += PER) pages.push(wrapped.slice(i, i + PER));
  if (!pages.length) pages.push([""]);
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  const objs: string[] = [];
  objs[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objs[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>";
  objs[4] = `<< /Title (${esc(title)}) /Producer (@agentguard/intent-verifier) >>`;
  const kids: string[] = [];
  pages.forEach((p, i) => {
    const pageNo = 5 + i * 2, contentNo = pageNo + 1; kids.push(`${pageNo} 0 R`);
    const stream = `BT /F1 8 Tf 10 TL 36 770 Td ${p.map(l => `(${esc(l)}) Tj T*`).join(" ")} ET`;
    objs[pageNo] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentNo} 0 R >>`;
    objs[contentNo] = `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`;
  });
  objs[2] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${pages.length} >>`;
  let out = "%PDF-1.4\n"; const offs: number[] = [];
  for (let n = 1; n < objs.length; n++) { offs[n] = Buffer.byteLength(out); out += `${n} 0 obj\n${objs[n]}\nendobj\n`; }
  const xref = Buffer.byteLength(out);
  out += `xref\n0 ${objs.length}\n0000000000 65535 f \n` + offs.slice(1).map(o => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  out += `trailer\n<< /Size ${objs.length} /Root 1 0 R /Info 4 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}
