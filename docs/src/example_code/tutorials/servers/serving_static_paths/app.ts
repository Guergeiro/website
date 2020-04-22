import { Drash } from "https://deno.land/x/drash/mod.ts";

import HomeResource from "./home_resource.ts";

const server = new Drash.Http.Server({
  directory: "/path/to/your/project",
  resources: [HomeResource],
  response_output: "text/html",
  static_paths: ["/public"]
});

server.run({
  hostname: "localhost",
  port: 1447
});
