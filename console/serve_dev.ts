import { run } from "./scripts.ts";

const args = Deno.args.slice();
const parentBranch = args[0]; // e.g., rhum-v1.x

await run(["node", "console/compile_vue_routes.js", parentBranch]);

await run(["pkill", "-f", "app.ts"]);

await run(["deno", "run", "-A", "app.ts"]);
