import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp, type App } from "../src/app.ts";

// Vercel Node function: one AgentGuard app per warm instance. Background jobs run from the CRON_SECRET-guarded
// /api/cron/* routes (Supabase pg_cron + pg_net every 15/5 min, Vercel daily cron as a backstop), not timers.
let app: Promise<App> | null = null;

export default async function handler(rq: IncomingMessage, res: ServerResponse): Promise<void> {
  app ??= createApp();
  let a: App;
  try { a = await app; } catch (e) {
    app = null; // retry init on the next request (e.g. transient DB error)
    console.error("[init]", (e as Error).message);
    res.statusCode = 503; res.setHeader("content-type", "application/json"); res.end(JSON.stringify({ error: "service unavailable" }));
    return;
  }
  await a.handler(rq, res);
}
