import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import { Container } from "react-bootstrap";

export class Facebook extends Component {
  state = {
    isLoggedIn: false,
    userID: "",
    name: "",
    email: "",
    picture: "",
  };

  componentClicked = () => {
    console.log("clicked");
  };

  responseFacebook = (response) => {
    console.log(response);
  };

  render() {
    let fbContent;

    if (this.state.isLoggedIn) {
      fbContent = null;
    } else {
      fbContent = (
        <FacebookLogin
          appId="820137652056192"
          autoLoad={true}
          fields="name,email,picture"
          onClick={this.componentClicked}
          callback={this.responseFacebook}
        />
      );
    }

    return (
      <Container>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Facebook Login</h1>
          </header>
          <p className="App-intro">Authenicate with Facebook.</p>
          <div>{fbContent}</div>
        </div>
      </Container>
    );
  }
}

export default Facebook;
