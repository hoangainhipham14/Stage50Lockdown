import React, { Component } from "react";
// import { setInStorage } from "../../utils/storage";

import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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

  onSignIn = (event) => {
    event.preventDefault();
    this.setState({
      error: "",
    });
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
      <div className="container" style={{ maxWidth: "30rem", margin: "0 auto" }}>
        <h2 align="center">Sign In</h2>
        <p align="center">Need an account? <Link to="/signup">Sign up</Link></p>

        <Form onSubmit={this.onSignIn}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email" 
              placeholder="Enter email"
              onChange={this.onChange}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={this.onChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Sign In
          </Button>

          <div style={{color: "red", marginTop: "0.5rem"}}>
            {this.state.error ? <p>{this.state.error}</p> : null}
          </div>
        </Form>
        {/* <p>Sign In</p>
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
        <button onClick={this.onSignIn}>Sign In</button> */}
      </div>
    );
  }
}

export default Signin;