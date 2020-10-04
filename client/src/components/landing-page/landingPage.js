import React, { Component } from "react";
import { Card, Form, Container, Button, Col, Row } from "react-bootstrap";

class LandingPage extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col sm={8}>
            <TopLeftText />
          </Col>
          <Col sm={4}>
            <DummySignUpForm />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <BottomLeftText />
          </Col>
          <Col sm={4}>
            <BottomCenterText />
          </Col>
          <Col sm={4}>
            <BottomRightText />
          </Col>
        </Row>
      </Container>
    );
  }
}

class DummySignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Get Started!</Card.Title>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

class TopLeftText extends Component {
  render() {
    return (
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>ePortfolio</Card.Title>
          <Card.Text>
            ePortfolio offers a convienient and simple way to show off your
            work. Perfect for artists, students and professionals.
          </Card.Text>
          <a
            href="mailto:stage50lockdown@gmail.com"
            target="_blank"
            class="btn btn-primary"
          >
            Email Us
          </a>
        </Card.Body>
      </Card>
    );
  }
}

class BottomRightText extends Component {
  render() {
    return (
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>Share your work with friends and colleagues</Card.Title>
          <Card.Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

class BottomCenterText extends Component {
  render() {
    return (
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>
            Keep your projects private until they are ready to share
          </Card.Title>
          <Card.Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

class BottomLeftText extends Component {
  render() {
    return (
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>Show off to potential employers</Card.Title>
          <Card.Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default LandingPage;
