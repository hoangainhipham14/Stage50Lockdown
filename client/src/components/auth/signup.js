import React, { Component } from "react";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    }
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  onSignUp = () => {
    fetch("/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          this.setState({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            error: "",
          });
        } else {
          this.setState({
            error: json.message,
          });
        }
      });
  }

  render() {
    return (
      <div>
        {this.state.error ? <p>{this.state.error}</p> : null}
        <p>Sign Up</p>
        <input
          onChange={this.onChange}
          id="firstName"
          type="text"
          placeholder="First Name"
          value={this.state.firstName}
        />
        <br />
        <input
          onChange={this.onChange}
          id="lastName"
          type="text"
          placeholder="Last Name"
          value={this.state.lastName}
        />
        <br />
        <input
          onChange={this.onChange}
          id="username"
          type="text"
          placeholder="Username"
          value={this.state.username}
        />
        <br />
        <input
          onChange={this.onChange}
          id="email"
          type="email"
          placeholder="Email"
          value={this.state.email}
        />
        <br />
        <input
          onChange={this.onChange}
          id="password"
          type="password"
          placeholder="Password"
          value={this.state.password}
        />
        <br />
        <button onClick={this.onSignUp}>Sign Up</button>
      </div>
    )
  }
}

export default Signup;