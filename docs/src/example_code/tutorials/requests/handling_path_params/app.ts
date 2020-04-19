import { Drash } from "https://deno.land/x/drash/mod.ts";

import UsersResource from "./users_resource.ts";

const server = new Drash.Http.Server({
  response_output: "text/plain",
  resources: [UsersResource],
});

server.run({
  hostname: "localhost",
  port: 1447
});
