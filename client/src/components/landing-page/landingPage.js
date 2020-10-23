import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Center, HCenter } from "../layout";
import { Card, Form, Container, Button, Col, Row } from "react-bootstrap";

class LandingPage extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col md>
            <TopLeftText />
          </Col>
          <Col md>
            <DummySignUpForm />
          </Col>
        </Row>
        <hr color="#808080" />
        <BottomText />
      </Container>
    );
  }
}

class DummySignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Get Started!</Card.Title>
          <Form>
            <Form.Group controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="tex"
                placeholder="Username"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First name"
                onChange={this.onChange}
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last name"
                onChange={this.onChange}
              />
            </Form.Group>
            <Link
              to={{
                pathname: "/signup",
                state: {
                  email: this.state.email,
                  username: this.state.username,
                  firstName: this.state.firstName,
                  lastName: this.state.lastName,
                },
              }}
            >
              <Button variant="primary">Sign Up</Button>
            </Link>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

class TopLeftText extends Component {
  render() {
    return (
      <Center className="px-2 py-5">
        <HCenter>
          <h1>ePortfolio</h1>
        </HCenter>
        <HCenter style={{ fontSize: "25px" }} className="py-2">
          ePortfolio offers a convenient and simple way to show off your work.
          Perfect for artists, students and professionals.
        </HCenter>
        <HCenter>
          <a
            href="mailto:stage50lockdown@gmail.com"
            target="_blank"
            className="btn btn-primary"
            rel="noopener noreferrer"
          >
            Email Us
          </a>
        </HCenter>
      </Center>
    );
  }
}

class BottomText extends Component {
  render() {
    return (
      <Row>
        <Col md>
          <h5>Share your work with friends and colleagues</h5>
        </Col>
        <Col md>
          <h5>Keep your projects private until they are ready to share</h5>
        </Col>
        <Col md>
          <h5>Show off to potential employers</h5>
        </Col>
      </Row>
    );
  }
}

export default LandingPage;
