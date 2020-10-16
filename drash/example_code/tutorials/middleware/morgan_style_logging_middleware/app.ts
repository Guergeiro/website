import { Drash } from "https://deno.land/x/drash@v1.2.5/mod.ts";

import HomeResource from "./home_resource.ts";
import { MorganStyleLoggingMiddleware } from "./morgan_style_logging_middleware.ts";

const server = new Drash.Http.Server({
  middleware: {
    before_request: [
      MorganStyleLoggingMiddleware
    ],
    after_request: [
      MorganStyleLoggingMiddleware
    ]
  },
  resources: [
    HomeResource
  ],
  response_output: "application/json",
});

server.run({
  hostname: "localhost",
  port: 1447
});

console.log("Server listening: http://localhost:1447");
