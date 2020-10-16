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
    accessToken: "",
  };

  componentClicked = (data) => {
    console.log("clicked\n", data);
  };

  responseFacebook = (response) => {
    console.log(response);
    this.setState({
      isLoggedIn: true,
      userID: response.userID,
      name: response.name,
      email: response.email,
      picture: response.picture.data.url,
      accessToken: response.accessToken,
    });
  };

  render() {
    let fbContent;

    if (this.state.isLoggedIn) {
      fbContent = (
        <div
          style={{
            width: "400px",
            margin: "auto",
            background: "#f4f4f4",
            padding: "20px",
          }}
        >
          <img src={this.state.picture} alt={this.state.name} />
          <h2>Welcome {this.state.name}</h2>
          Email: {this.state.email}
          <br />
          User Short-Lived Access Token: {this.state.accessToken}
          <br />
          UserID: {this.state.userID}
          <br />
        </div>
      );
    } else {
      fbContent = (
        <FacebookLogin
          appId="820137652056192"
          autoLoad={true}
          fields="name,email,picture"
          scope="public_profile"
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
