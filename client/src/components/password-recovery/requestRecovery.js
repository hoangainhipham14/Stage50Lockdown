import React, { Component } from "react";
import { requestRecovery } from "../../actions/passwordReset";
import { Form, Button } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import isEmpty from "is-empty";

class RequestPasswordReset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      errors: {},
      passwordReset: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
    if (nextProps.passwordReset) {
      this.setState({
        passwordReset: nextProps.passwordReset,
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
      email: this.state.email,
    };

    this.props.requestRecovery(userData);
  };

  render() {
    const { errors } = this.state;
    // const { passwordReset } = this.state;
    const successmsg = this.props.successmsg.msg;

    return (
      <div
        className="container"
        style={{ maxWidth: "30rem", margin: "0 auto" }}
      >
        <h2 align="center">Forgot your password?</h2>
        <p align="center">
          Enter your email address here to request a recovery link
        </p>

        <Form onSubmit={this.onSubmit}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={this.onChange}
            />
            {/* <div className="error-text">
              {errors.recoveryemail}
              {errors.emailnotfound}
            </div> */}

            <Alert variant="success" show={!isEmpty(successmsg)}>
              {successmsg}
            </Alert>
          </Form.Group>

          <Button variant="primary" type="submit">
            Send Recovery Email
          </Button>
        </Form>
      </div>
    );
  }
}

RequestPasswordReset.propTypes = {
  requestRecovery: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  successmsg: state.passwordReset,
});

//test
export default connect(mapStateToProps, { requestRecovery })(
  RequestPasswordReset
);
