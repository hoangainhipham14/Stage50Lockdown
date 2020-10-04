import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Form,
  Container,
  Button,
  Col,
  Row,
  CardDeck,
} from "react-bootstrap";

class LandingPage extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <TopLeftText />
          </Col>
          <Col>
            <DummySignUpForm />
          </Col>
        </Row>
        <hr color="#808080" />
        <Row>
          <BottomText />
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
      <div class="container pt-5">
        <Card border="light" class="pt-300">
          <Card.Body>
            <Card.Title style={{ textAlign: "center" }}>
              <h1>ePortfolio</h1>
            </Card.Title>
            <Card.Text style={{ textAlign: "center" }}>
              <h3>
                ePortfolio offers a convienient and simple way to show off your
                work. Perfect for artists, students and professionals.
              </h3>
            </Card.Text>
            <center>
              <a
                href="mailto:stage50lockdown@gmail.com"
                target="_blank"
                class="btn btn-primary"
                rel="noopener noreferrer"
              >
                Email Us
              </a>
            </center>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

class BottomText extends Component {
  render() {
    return (
      <CardDeck>
        <Card border="light" style={{ width: "20rem" }}>
          <Card.Body>
            <Card.Title>Share your work with friends and colleagues</Card.Title>
            <Card.Text>
              By utilising the best technology there is in bootstrap and
              JavaScript, we have been able to create a program that allows you
              to safely save and show your work off to the wider world.
              Additionally, with its ease of access, you can invite anyone you
              see fit to be able to view your work to come and see what you have
              created in your own time. And if you are wanting to view the work
              of someone it is almost too easy to be able to see a published
              item from your colleague.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card border="light" style={{ width: "20rem", padding: "5px" }}>
          <Card.Body>
            <Card.Title>
              Keep your projects private until they are ready to share
            </Card.Title>
            <Card.Text>
              With privacy being one of the core principles that has driven our
              development, the project items that you create are private until
              you decide otherwise, so there is no worrying about someone coming
              upon your work without your strict approval. Furthermore If you
              decide you don’t want anyone to see your work anymore that is
              entirely fine, just choose to set your work back to private and
              just like that any mistakes you’ve made are only known by yourself
              and the database that is subjectively secure.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card border="light" style={{ width: "20rem" }}>
          <Card.Body>
            <Card.Title>Show off to potential employers</Card.Title>
            <Card.Text>
              With the power of being able to share your work, you can display
              any project that you may to any future employer, including an
              elegant method of displaying images and text on a page that will
              allow you to be able to showcase everything great that you have
              done whilst giving you great mobility and ease of access to be
              able to navigate easily throughout your profile.
            </Card.Text>
          </Card.Body>
        </Card>
      </CardDeck>
    );
  }
}

export default LandingPage;
