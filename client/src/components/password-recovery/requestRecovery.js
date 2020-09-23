import React, { Component } from "react";
//import { requestRecovery } from "../../actions/passwordReset";
import {Form, Button } from "react-bootstrap";

class RequestPasswordReset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: ""
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
            email: this.state.email
        };

        this.props.requestRecovery(userData);
    }

    render() {
        return (
            <div className="container" style={{maxwidth: "30rem", margin: "0 auto"}}>
                <h2 align="center">Forgot your password?</h2>
                <p align="center">Enter your email address here to request a recovery link</p>

                <Form onSubmit={this.onSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</ Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            onChange={this.onChange}
                        />
                    </ Form.Group>

                    <Button variant="primary" type="submit">
                        Send Recovery Email
                    </Button>
                </ Form>
            </div>
        );
    }
}

//test
export default RequestPasswordReset;