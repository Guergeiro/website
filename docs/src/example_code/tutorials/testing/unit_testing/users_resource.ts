import Drash from "https://deno.land/x/drash/mod.ts";

export default class UsersResource extends Drash.Http.Resource {

  static paths = [
    "/users/:id"
  ];

  // Simulate a database with user records
  protected database = {
    1388873: {
      id: 1388873,
      name: "Seller",
    },
    1983765: {
      id: 1983765,
      name: "Buyer",
    },
  };

  public GET() {
    this.response.body = this.getUser(this.request.getPathParam("id"));
    return this.response;
  }

  protected getUser(id) {
    if (this.database[id]) {
      return this.database[id];
    }

    throw new Drash.Exceptions.HttpException(404, `User #${id} not found.`);
  }
}
