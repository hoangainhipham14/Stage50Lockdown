import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import { Container } from "react-bootstrap";

export class Facebook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fbIsLoggedIn: false,
      fbUserID: "",
      fbName: "",
      fbEmail: "",
      fbPicture: "",
      fbAccessToken: "",
    };
  }

  componentDidMount() {
    // Get props from landing page and map to state
    try {
      this.setState({
        fbIsLoggedIn: this.props.location.state.fbIsLoggedIn,
        fbUserID: this.props.location.state.fbUserID,
        fbName: this.props.location.state.fbName,
        fbEmail: this.props.location.state.fbEmail,
        fbPicture: this.props.location.state.fbPicture,
        fbAccessToken: this.props.location.state.fbAccessToken,
      });
    } catch (err) {
      console.log("no state passed in");
    }
  }

  componentClicked = () => {
    console.log("clicked");
  };

  handleFailure = () => {
    console.log("failure");
  };

  responseFacebook = (response) => {
    console.log(response);
    this.setState({
      fbIsLoggedIn: true,
      fbUserID: response.userID,
      fbName: response.name,
      fbEmail: response.email,
      fbPicture: response.picture.data.url,
      fbAccessToken: response.accessToken,
    });
  };

  render() {
    let fbContent;

    if (this.state.fbIsLoggedIn) {
      fbContent = (
        <div
          style={{
            width: "400px",
            margin: "auto",
            background: "#f4f4f4",
            padding: "20px",
          }}
        >
          <img src={this.state.fbPicture} alt={this.state.fbName} />
          <h2>Welcome {this.state.fbName}</h2>
          Email: {this.state.fbEmail}
          <br />
          User Short-Lived Access Token: {this.state.fbAccessToken}
          <br />
          UserID: {this.state.fbUserID}
          <br />
        </div>
      );
    } else {
      fbContent = (
        <FacebookLogin
          appId="820137652056192"
          autoLoad={false}
          fields="name,first_name, last_name,email,picture"
          scope="public_profile, email"
          onClick={this.componentClicked}
          callback={this.responseFacebook}
          onFailure={this.handleFailure}
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
