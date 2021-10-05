
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import { ToastContainer } from "react-toastify";

import SignUp from "./pages/SignUp/index";
import SignIn from "./pages/SignIn/index";
import Home from "./pages/Home/index"
import UserContext, { UserProvider } from "./contexts/UserContext";

export default function App() {
  return (
    <>
      <UserProvider>
          <ToastContainer />
           <Router>
            <Switch>
              <Route path="/sign-up" exact>
                <SignUp />
              </Route>
              <Route path="/sign-in" exact>
                <SignIn />
              </Route>
              <Route path="/home">
                <Home />
              </Route>
            </Switch>
          </Router>
      </UserProvider>
    </>
  );
}
