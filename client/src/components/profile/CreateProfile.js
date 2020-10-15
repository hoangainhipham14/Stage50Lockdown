import axios from "axios";
import React, { Component } from "react";
import { Container, Form, Button, Col, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class CreateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      aboutUser: "",
      username: this.props.match.params.username,
    };
  }

  componentDidMount() {
    // Get user information stored in database when sign up
    axios
      .get(`/api/user/${this.props.match.params.username}`)
      .then((response) => {
        if (response.error) {
          console.log(response.error);
        } else {
          this.setState({
            aboutUser: response.data.aboutUser,
          });
        }
      });
  }

  onChange = (e) => {
    this.setState({
      aboutUser: e.target.value,
    });
  };

  onSubmit = (e) => {
    // prevent page from reloading
    e.preventDefault();

    // create the formdata object
    // we need to do this because JSON isn't sufficient for image sending
    const formData = new FormData();
    formData.set("aboutUser", this.state.aboutUser);

    // configuration for post request since we aren't just posting json
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(`/api/user/${this.state.username}`, formData, config)
      .then((data) => {
        console.log(data);
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({
            aboutUser: data.aboutUser,
          });
        }
      });
  };

  render() {
    return (
      <Container>
        <Col className="col-sm d-flex">
          <Card style={{ width: "50rem" }}>
            <Card.Header>About Me</Card.Header>
            <Card.Body>
              <Form onSubmit={this.onSubmit}>
                <Form.Group controlId="aboutUser">
                  <Form.Control
                    as="textarea"
                    placeholder={this.state.aboutUser}
                    onChange={this.onChange}
                  />
                </Form.Group>

                <Container className="d-flex justify-content-center">
                  <Button variant="success" type="submit">
                    Update
                  </Button>
                </Container>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Container>
    );
  }
}

CreateProfile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CreateProfile);
