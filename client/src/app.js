import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import SimpleReactLightbox from "simple-react-lightbox";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";

import Profile from "./components/profile/profile";
import ResetPassword from "./components/auth/passwordReset";
import Signin from "./components/auth/signin";
import Signup from "./components/auth/signup";
import Navbar from "./components/layout/navbar";
import CreateProject, { EditProject } from "./components/project/CreateProject";
import SingleProject from "./components/project/SingleProject";
import LandingPage from "./components/landing-page/landingPage";
import AccountDetails from "./components/profile/AccountDetails";
import DisplayCarousel from "./components/profile/Carousel";
import RequestPasswordReset from "./components/auth/requestRecovery";
import PrivacyToggleButton from "./components/dashboard/PrivacyToggleButton";
import SearchResults from "./components/search/SearchResults";
import NoMatch from "./components/404/404";
import CreateProfile from "./components/profile/CreateProfile";
import PrivacyPolicy from "./components/landing-page/PrivacyPolicy";
import ChangePassword from "./components/auth/changePassword";
import TermsOfService from "./components/landing-page/TermsOfService";

// check for token to keep user logged in
if (localStorage.token) {
  try {
    // set authentication token to header
    const token = localStorage.token;
    // decode token and get user info and expiry
    const decoded = jwt_decode(token);

    setAuthToken(token);

    // set user
    store.dispatch(setCurrentUser(decoded));
    // check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // log user out
      store.dispatch(logoutUser());

      // redirect to login
      window.location.href = "./";
    }
  } catch (err) {
    console.log("Invalid token");
    setAuthToken(false);
    localStorage.removeItem("token");
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="app">
            <SimpleReactLightbox>
              {" "}
              {/* Don't touch this wrapper, needed for gallery */}
              <Navbar />
              <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/signin" component={Signin} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/profile/:username" component={Profile} />
                <Route exact path="/createProject" component={CreateProject} />
                <Route
                  exact
                  path="/projects/:projectId"
                  component={SingleProject}
                />
                <Route
                  exact
                  path="/projects/:projectId/edit"
                  component={EditProject}
                />
                <Route
                  exact
                  path="/projects/link/:link"
                  component={SingleProject}
                />
                <Route
                  exact
                  path="/createProfile/:username"
                  component={CreateProfile}
                />
                <Route
                  exact
                  path="/user/:username/account"
                  component={AccountDetails}
                />
                <Route
                  path="/forgot-password"
                  component={RequestPasswordReset}
                />
                <Route
                  exact
                  path="/resetPassword/:token"
                  component={ResetPassword}
                />
                <Route
                  exact
                  path="/projects/privacy/:projectId"
                  component={PrivacyToggleButton}
                />
                <Route exact path="/privacypolicy" component={PrivacyPolicy} />
                <Route
                  exact
                  path="/termsofservice"
                  component={TermsOfService}
                />

                <Route exact path="/carousel" component={DisplayCarousel} />

                <Route exact path="/search" component={SearchResults} />
                <Route
                  exact
                  path="/changepassword"
                  component={ChangePassword}
                />

                {/* This must stay at the bottom. Add any new routes above */}
                <Route component={NoMatch} />
              </Switch>
            </SimpleReactLightbox>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
