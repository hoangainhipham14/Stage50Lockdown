// The goal of this page is to host a page that will accept two passwords and then save them back to the database of the user that requested the change

import React, { Component } from "react";
//import { requestRecovery } from "../../actions/passwordReset";
import {Form, Button } from "react-bootstrap";

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recoveryToken: this.props.match.params.token,
            passwordNo1: "",
            passwordNo2: ""
        }
    }

    onChange = e => {
        this.setState({
            [e.target.id]: e.target.value,
        });
    }

    onSubmit = e => {
        e.preventDefault();

        const userData = {
            recoveryToken: this.props.match.params.token,
            passwordNo1: this.state.passwordNo1,
            passwordNo2: this.state.passwordNo2
        };

        this.props.changePassword(userData);
    }

    render() {
        return (
        <div className="container" style={{maxwidth: "30rem", margin: "0 auto"}}>
        <h2 align="center">Password Reset</h2>
        <p align="center">Change Your Password Here:</p>
        <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="passwordNo1">
                <Form.Label>Enter Password</ Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    onChange={this.onChange}
                />
            </ Form.Group>
            <Form.Group controlId="passwordNo2">
                <Form.Label>Re-Enter Password</ Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Re-Enter Password"
                    onChange={this.onChange}
                />
            </ Form.Group>
            <Button variant="primary" type="submit">
                Reset Password
            </Button>
        </ Form>
        </div>
        );
    }
};
//test
export default ResetPassword;