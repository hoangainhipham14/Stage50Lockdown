import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

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

  onSignUp = (event) => {
    event.preventDefault();
    this.setState({
      error: "",
    });
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
      <div className="container">
        <Form onSubmit={this.onSignUp}>
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First name"
              onChange={this.onChange}
              value={this.state.firstName}
            />
          </Form.Group>

          <Form.Group controlId="lastName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Last name"
              onChange={this.onChange}
              value={this.state.lastName}
            />
          </Form.Group>

          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              onChange={this.onChange}
              value={this.state.username}
            />
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={this.onChange}
              value={this.state.email}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={this.onChange}
              value={this.state.password}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Sign Up
          </Button>

          <div style={{ color: "red", marginTop: "0.5rem" }}>
            {this.state.error ? <p>{this.state.error}</p> : null}
          </div>
        </Form>
      </div>
    )
  }
}

export default Signup;