import React, { Component } from "react";
import { Container, Form, Button } from "react-bootstrap";
import "./style.css";
// import store from "../../store.js";

class CreateProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: new FormData(),
    };
  }

  onChange = (e) => {
    console.log("onChange clicked with e.target.id =", e.target.id);
    const name = e.target.id;
    const value = name === "image" ? e.target.files[0] : e.target.value;
    this.state.formData.set(name, value);
  };

  onSubmit = (e) => {
    e.preventDefault();

    // console.log(store.getState().auth.user.username);
    console.log(this.state.formData);
    // axios.post("/api/createProject", formData, {
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    // });
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
              <Form.Control type="text" onChange={this.onChange} />
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

export default CreateProject;
