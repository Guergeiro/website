import { Drash } from "../../deps.ts";
import config from "../../conf/app.ts";
const Encoder = new TextEncoder();

let DrashNamespaceMembers = [
  "/src/dictionaries/log_levels.ts",
  "/src/exceptions/http_exception.ts",
  "/src/exceptions/http_middleware_exception.ts",
  "/src/http/middleware.ts",
  "/src/http/resource.ts",
  "/src/http/response.ts",
  "/src/http/server.ts",
  "/src/interfaces/logger_configs.ts",
  "/src/core_loggers/console_logger.ts",
  "/src/core_loggers/file_logger.ts",
  "/src/core_loggers/logger.ts",
  "/src/services/http_service.ts",
  "/src/services/http_request_service.ts",
  "/src/util/object_parser.ts",
  "/src/util/members.ts",
].map(value => {
  return config.deno_drash.directory + value;
});

let compiler = new Drash.Compilers.DocBlocksToJson();
let compiled = compiler.compile(DrashNamespaceMembers);
let apiReferenceData = Encoder.encode(JSON.stringify(compiled, null, 4));
const apiReferenceOutputFile = `${config.server.directory}/public/assets/json/api_reference.json`;
Deno.writeFileSync(apiReferenceOutputFile, apiReferenceData);
