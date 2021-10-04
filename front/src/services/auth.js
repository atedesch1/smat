import api from "./api";

export default class Auth {
  signIn(email, password) {
    return api.post("/user/sign-in", { email, password });
  }
}
