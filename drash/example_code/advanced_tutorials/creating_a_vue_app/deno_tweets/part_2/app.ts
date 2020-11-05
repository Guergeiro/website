import { Drash } from "https://deno.land/x/drash@v1.3.0/mod.ts";

import HomeResource from "./home_resource.ts";

const server = new Drash.Http.Server({
  response_output: "text/html",
  resources: [HomeResource],
  directory: "/path/to/your/project",
  static_paths: ["/public"]
});

server.run({
  hostname: "localhost",
  port: 1447
});
