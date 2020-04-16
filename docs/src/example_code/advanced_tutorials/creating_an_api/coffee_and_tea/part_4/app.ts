import { Drash } from "https://deno.land/x/drash/mod.ts";

import response from "./response.ts";
Drash.Http.Response = response;

import CoffeeResource from "./coffee_resource.ts";
import TeaResource from "./tea_resource.ts";

const server = new Drash.Http.Server({
  address: "localhost:1447",
  response_output: "application/json",
  resources: [
    CoffeeResource,
    TeaResource
  ],
});

server.run();
