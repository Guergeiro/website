import { Drash } from "https://deno.land/x/drash/mod.ts"

const decoder = new TextDecoder()
const encoder = new TextEncoder()

class ModuleResource extends Drash.Http.Resource {
  static paths = ["/:module/:version?"]

  public GET() {
    const uri = this.request.url_path;
    const environment = this.getEnvironment();
    let content = decoder.decode(Deno.readFileSync("index.html"));
    content = content
        .replace("{{ environment }}", environment)
        .replace("{{ title }}", "Drash Land - Drash")
        .replace("{{ module }}", this.request.getPathParam("module") || "")
        .replace("{{ version }}", this.request.getPathParam("version") || "")
        .replace("{{ drash }}", JSON.stringify({
          environment: this.getEnvironment()
        }));
    this.response.body = content;
    return this.response
  }

  protected getEnvironment() {
      const uri = this.request.url_path;
      const isDrashIo = this.request.headers.get("x-forwarded-host");
      const isStaging = uri.includes("/staging");
      if (isDrashIo) {
        if (isStaging) {
          return "staging";
        }
        return "production";
      }

      return "development";
  }
}

class LandingResource extends Drash.Http.Resource {
  static paths = ["/(staging)?"]

  public GET () {
    const uri = this.request.url_path;
    const environment = this.getEnvironment();
    let content = decoder.decode(Deno.readFileSync("index.html"));
    content = content
        .replace("{{ environment }}", environment)
        .replace("{{ title }}", "Drash Land")
        .replace("{{ module }}", "landing")
        .replace("{{ version }}", "") // IF  we were using versions, do .replace(..., ".VERSION")
        .replace("{{ drash }}", JSON.stringify({
          environment: this.getEnvironment()
        }));
    this.response.body = content;
    return this.response
  }

  protected getEnvironment() {
      const uri = this.request.url_path;
      const isDrashIo = this.request.headers.get("x-forwarded-host");
      const isStaging = uri.includes("/staging");
      if (isDrashIo) {
        if (isStaging) {
          return "staging";
        }
        return "production";
      }

      return "development";
  }
}

// TODO :: Missing a catch all resource

const server = new Drash.Http.Server({
  resources: [
      LandingResource,
      ModuleResource
  ],
  response_output: "text/html",
  static_paths: [
      "/assets"
  ],
  directory: "."
})

await server.run({
  hostname: "localhost",
  port: 1445
})

console.log(`Running server on http://${server.hostname}:${server.port}`)
