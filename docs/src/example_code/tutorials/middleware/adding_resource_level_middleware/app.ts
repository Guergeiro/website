import { Drash } from "https://deno.land/x/drash/mod.ts";

import HomeResource from "./home_resource.ts";
import SecretResource from "./secret_resource.ts";
import VerifyTokenMiddleware from "./verify_token_middleware.ts";

const server = new Drash.Http.Server({
  middleware: {
    resource_level: [
      VerifyTokenMiddleware
    ]
  },
  resources: [
    HomeResource,
    SecretResource
  ],
  response_output: "application/json",
});

server.run({
  hostname: "localhost",
  port: 1447
});
