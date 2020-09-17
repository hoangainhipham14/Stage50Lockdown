import React, { Component } from "react";
// import { setInStorage } from "../../utils/storage";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: "",
      email: "",
      password: "",
    }
  }

  onChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  onSignIn = () => {
    fetch("users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("Received json response with message", json.message);
        if (json.success) {
          // setInStorage("eportfolio", { token: json.token });
          this.setState({
            // isLoading: false,
            email: "",
            password: "",
            error: "",
            // token: json.token,
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
        <p>Sign In</p>
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
        <button onClick={this.onSignIn}>Sign In</button>
      </div>
    );
  }
}

export default Signin;