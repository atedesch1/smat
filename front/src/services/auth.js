import api from "./api";

export default class Auth {
  signIn(email, password) {
    return api.post("/sign-in", { email, password });
  }
}
