import AuthenticatedApi from "./AuthenticatedApi";
import api from "./api";

export default class SignUpApi extends AuthenticatedApi {
  save(body) {
    return api.post("/sign-up", body, {
      headers: {
        ...this.getAuthorizationHeader()
      }
    });
  }

  getPersonalInformations() {
    return api.get("/sign-up", {
      headers: {
        ...this.getAuthorizationHeader()
      }
    });
  }
}
