import api from "./api";

export default class UserApi {
  signUp(email, password, name, nationality) {
    return api.post("/user/sign-up", {email: email, password: password, name: name, nationality : nationality});
  }
}
