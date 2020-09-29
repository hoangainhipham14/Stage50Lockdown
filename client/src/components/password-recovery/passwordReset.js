// The goal of this page is to host a page that will accept two passwords and then save them back to the database of the user that requested the change

import React, { Component } from "react";
import { changePassword } from "../../actions/passwordResetActions";
import { Form, Button, Alert } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isEmpty from "is-empty";

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: this.props.match.params.token,
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
      token: this.props.match.params.token,
      passwordNo1: this.state.passwordNo1,
      passwordNo2: this.state.passwordNo2,
    };

    this.props.changePassword(userData, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
      <div
        className="container"
        style={{ maxwidth: "30rem", margin: "0 auto" }}
      >
        <h2 align="center">Password Reset</h2>
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
          <Button variant="primary" type="submit">
            Reset Password
          </Button>
        </Form>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  passwordNo1: state.passwordNo1,
  passwordNo2: state.passwordNo2,
  errors: state.errors,
});
//test
export default connect(mapStateToProps, { changePassword })(ResetPassword);
