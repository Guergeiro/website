import { Drash } from "./deps.ts";
import { LandingResource } from "./src/resources/landing_resource.ts";
import { ModuleResource } from "./src/resources/module_resource.ts";
import { StagingModuleResource } from "./src/resources/staging_module_resource.ts";
import { Response } from "./src/response.ts";
import { options } from "./drash_website_server_options.ts";

Drash.Http.Response = Response

const server = new Drash.Http.Server({
  resources: [
      LandingResource,
      ModuleResource,
      StagingModuleResource,
  ],
  response_output: "text/html",
  static_paths: [
      "/assets"
  ],
  directory: "."
})

await server.run(options);

console.log(`Running server on http://${server.hostname}:${server.port}`)
