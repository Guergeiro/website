import Drash from "https://deno.land/x/drash/mod.ts";

class HomeResource extends Drash.Http.Resource {
  static paths = ["/"];
  public GET() {
    this.response.body = "Hello World!";
    return this.response;
  }
}

let server = new Drash.Http.Server({
  address: "localhost:1337",
  response_output: "text/html",
  resources: [HomeResource]
});

server.run();
