import React, { Component } from "react";
import { Link } from "react-router-dom";
import FacebookLogin from "react-facebook-login";
import PropTypes from "prop-types";
import { fbSigninUser } from "../../actions/authActions";
import { connect } from "react-redux";
import { Card, Form, Container, Button, Col, Row } from "react-bootstrap";
import { Center, HCenter } from "../layout";

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

// Home page sign up form
// Will redirect to signup page with filled out form
class DummySignUpForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      // Facebook state
      fbIsLoggedIn: false,
      fbUserID: "",
      image: "",
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  componentClicked = () => {
    console.log("clicked");
  };

  handleFailure = () => {
    console.log("failure");
  };

  // Response from facebook recorded
  responseFacebook = (response) => {
    console.log(response);
    this.setState({
      fbIsLoggedIn: true,
      fbUserID: response.userID,
      image: response.picture.data.url,
      email: response.email,
      firstName: response.first_name,
      lastName: response.last_name,
    });
  };

  render() {
    // Renders facebook button
    let fbContent;

    if (this.state.fbIsLoggedIn) {
      fbContent = console.log("Logged in");
    } else {
      fbContent = (
        <FacebookLogin
          // appId of ePortfolio
          appId="820137652056192"
          autoLoad={false}
          fields="name,first_name, last_name,email,picture"
          scope="public_profile, email"
          onClick={this.componentClicked}
          callback={this.responseFacebook}
          onFailure={this.handleFailure}
          cssClass="btnFacebook"
          textButton="Sign up with Facebook"
        />
      );
    }

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
                defaultValue={this.state.email}
              />
            </Form.Group>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="tex"
                placeholder="Username"
                onChange={this.onChange}
                defaultValue={this.state.username}
              />
            </Form.Group>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First name"
                onChange={this.onChange}
                defaultValue={this.state.firstName}
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last name"
                onChange={this.onChange}
                defaultValue={this.state.lastName}
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
                  fbIsLoggedIn: this.state.fbIsLoggedIn,
                  fbUserID: this.state.fbUserID,
                  image: this.state.image,
                },
              }}
            >
              <Button className="display-btn" variant="primary">
                Sign Up
              </Button>
            </Link>
            {fbContent}
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

          <Link to="/privacypolicy"><Button variant="primary">Privacy Policy</Button></Link>
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
          <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
            By utilising the best technology there is in bootstrap and
            JavaScript, we have been able to create a program that allows you to
            safely save and show your work off to the wider world. With its ease
            of access, you can invite anyone you see fit to be able to view your
            work to come and see what you have created in your own time.
          </p>
        </Col>
        <Col md>
          <h5>Keep your projects private until they are ready to share</h5>
          <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
            With privacy being one of the core principles that has driven our
            development, the project items that you create are private until you
            decide otherwise, so there is no worrying about someone coming upon
            your work without your strict approval.
          </p>
        </Col>
        <Col md>
          <h5>Show off to potential employers</h5>
          <p style={{ textAlign: "justify", textJustify: "inter-word" }}>
            With the power of being able to share your work, you can display any
            project that you may to any future employer, including an elegant
            method of displaying images and text on a page that will allow you
            to be able to showcase everything great that you have done whilst
            giving you great mobility and ease of access to be able to navigate
            easily throughout your profile.
          </p>
        </Col>
      </Row>
    );
  }
}

LandingPage.propTypes = {
  fbSigninUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { fbSigninUser })(LandingPage);
