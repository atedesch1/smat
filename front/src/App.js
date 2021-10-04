
import {
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";

import ConditionalRoute from "./components/Router/ConditionalRoute";

import SignUp from "./pages/SignUp/index";
import SignIn from "./pages/SignIn/index";
import Home from "./pages/Home/index"

import EventInfoContext, { EventInfoProvider } from "./contexts/EventInfoContext";
import UserContext, { UserProvider } from "./contexts/UserContext";

export default function App() {
  return (
    <>
      <ToastContainer />
      <EventInfoProvider>
        <UserProvider>
          <Router>
            <Switch>
              <ConditionalRoute check={1} path="/sign-up" exact>
                <SignUp />
              </ConditionalRoute>

              <ConditionalRoute check={1} path="/sign-in" exact>
                <SignIn />
              </ConditionalRoute>

              <ConditionalRoute check={1} path="/home">
                <Home />
              </ConditionalRoute>
            </Switch>
          </Router>
        </UserProvider>
      </EventInfoProvider>
    </>
  );
}
