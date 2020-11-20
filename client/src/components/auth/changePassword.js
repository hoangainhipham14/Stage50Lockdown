import React, { Component } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import isEmpty from "is-empty";
import axios from "axios";
import { Center } from "../layout";

class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordNo1: "",
      passwordNo2: "",
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      passwordNo1: this.state.passwordNo1,
      passwordNo2: this.state.passwordNo2,
    };

    axios
      .post("/api/changepassword", userData)
      .then((res) => {
        this.props.history.push("/");
      })
      .catch((err) => {
        this.setState({
          errors: err.response.data,
        });
      });

    // this.props.changePassword(userData, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
      <Center>
        <h2 align="center">Password Change</h2>
        <p align="center">Change Your Password Here:</p>
        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="passwordNo1">
            <Form.Label>Enter Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Password"
              onChange={this.onChange}
            />
          </Form.Group>
          <Form.Group controlId="passwordNo2">
            <Form.Label>Re-Enter Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-Enter Password"
              onChange={this.onChange}
            />
            <Alert variant="danger" show={!isEmpty(errors)}>
              {errors.msg}
            </Alert>
          </Form.Group>
          <Button className="display-btn" variant="primary" type="submit">
            Reset Password
          </Button>
        </Form>
      </Center>
    );
  }
}

//test
export default ChangePassword;
