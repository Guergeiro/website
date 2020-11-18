import { Drash } from "https://deno.land/x/drash/mod.ts"

const decoder = new TextDecoder()
const encoder = new TextEncoder()

class DrashResource extends Drash.Http.Resource {
  static paths = ["/(staging/)?drash(/v[0-9.]+[0-9.]+[0-9])?"]

  public GET() {
    const uri = this.request.url_path;
    const hostname = this.server.hostname
    const isStaging = uri.indexOf("staging") > -1;
    const version = uri.indexOf("v") > -1 ? "v" + uri.split("v")[1] : ""
    const environment = hostname === "localhost" ? "development" : isStaging ? "staging" : "production"
    console.log(uri, hostname, isStaging, environment, version)
    let content = decoder.decode(Deno.readFileSync("index.html"));
    content = content
        .replace("{{ environment }}", environment)
        .replace("{{ title }}", "Drash Land - Drash")
        .replace("{{ module }}", "drash")
        .replace("{{ version }}", version);
    this.response.body = content;
    return this.response
  }
}

class LandingResource extends Drash.Http.Resource {
  static paths = ["/(staging)?"]

  public GET () {
    const uri = this.request.url_path;
    const hostname = this.server.hostname
    const isStaging = uri.indexOf("staging") > -1;
    const environment = hostname === "localhost" ? "development" : isStaging ? "staging" : "production"
    let content = decoder.decode(Deno.readFileSync("index.html"));
    content = content
        .replace("{{ environment }}", environment)
        .replace("{{ title }}", "Drash Land")
        .replace("{{ module }}", "landing")
        .replace("{{ version }}", ""); // IF  we were using versions, do .replace(..., ".VERSION")
    this.response.body = content;
    return this.response
  }
}

// TODO :: Missing a catch all resource

const server = new Drash.Http.Server({
  resources: [
      LandingResource,
      DrashResource
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