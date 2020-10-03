import React, { Component } from "react";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.match.params.username,
      firstName: "",
      lastName: "",
      email: "",
      userExists: false,
    };

    // Pull user details from backend API
    fetch("/api/" + this.props.match.params.username)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            firstName: json.firstName,
            lastName: json.lastName,
            email: json.email,
            userExists: true,
          });
        }
      });
  }

  render() {
    if (this.state.userExists) {
      return (
        <div>
          <h1>
            This profile belongs to {this.state.firstName} {this.state.lastName}
          </h1>
          <p>Contact: {this.state.email}</p>
        </div>
      );
    } else {
      return (
        <div>
          <h1>
            This profile does not exist: {this.props.match.params.username}
          </h1>
          <a href="/">Go home</a>
        </div>
      );
    }
  }
}

export default Profile;
