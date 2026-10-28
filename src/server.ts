import { createServer } from "node:http";
import { createApp } from "./app.ts";

// Long-running Node server (local runs, self-hosting): timers drive anchoring and maintenance.
// On Vercel the same handler runs as a function (api/index.ts) and cron routes replace the timers.
const app = await createApp({ background: true });
const PORT = Number(process.env.PORT ?? 8787);
createServer((rq, res) => void app.handler(rq, res)).listen(PORT, () => console.log(`AgentGuard listening on ${PORT}`));
