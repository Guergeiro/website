import Drash from "../../deno-drash/mod.ts";

export default class AppResource extends Drash.Http.Resource {
  static paths = ["*"];

  public GET() {
    return this.response;
  }
}
