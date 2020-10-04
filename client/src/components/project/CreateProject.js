import axios from "axios";
import React, { Component } from "react";
import { Container, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class CreateProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      about: "",
      body: "",
      image: null,
    };
  }

  /*
   * called whenever a value is changed in the form
   */
  onChange = (e) => {
    // the name of field changed
    const name = e.target.id;
    // the value of the field changed
    var value;
    switch (name) {
      case "image":
        // extract the image
        value = e.target.files[0];
        break;
      default:
        // by default, the value is just the field value
        value = e.target.value;
    }

    this.setState({
      [name]: value,
    });
  };

  onSubmit = (e) => {
    // prevent page from reloading
    e.preventDefault();

    // create the formdata object
    // we need to do this because JSON isn't sufficient for image sending
    const formData = new FormData();
    formData.set("title", this.state.title);
    formData.set("about", this.state.about);
    formData.set("body", this.state.body);
    formData.set("image", this.state.image);

    // configururation for post request since we aren't just posting json
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    // get user id for post request
    const _id = this.props.auth.user._id;

    axios
      .post(`/api/project/create/${_id}`, formData, config)
      .then((response) => {
        console.log("Success!");
        console.log(response.data);
      })
      .catch((err) => {
        console.log("Failure!");
        console.log(err);
      });
  };

  render() {
    return (
      <Container>
        <div style={{ maxWidth: "30rem", margin: "0 auto" }}>
          <div className="text-center">
            <h2>Create New Project</h2>
          </div>

          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" onChange={this.onChange} />
            </Form.Group>

            <Form.Group controlId="about">
              <Form.Label>About</Form.Label>
              <Form.Control as="textarea" rows="5" onChange={this.onChange} />
            </Form.Group>

            <Form.Group controlId="body">
              <Form.Label>Body Text</Form.Label>
              <Form.Control as="textarea" rows="5" onChange={this.onChange} />
            </Form.Group>

            <Form.Group controlId="image">
              <Form.File
                id="image"
                label="Main Image"
                onChange={this.onChange}
              />
            </Form.Group>

            <div className="text-center">
              <Button variant="success" type="submit">
                Create Project
              </Button>
              <Button variant="secondary" type="submit">
                Discard Project
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    );
  }
}

CreateProject.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CreateProject);
