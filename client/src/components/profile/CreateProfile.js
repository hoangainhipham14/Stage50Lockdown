import React, { Component } from "react";

import { Card, Container, Col, Button, Form } from "react-bootstrap";
// import axios from "axios";

class CreateProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      aboutUser: "",
    };
  }

  render() {
    return (
      <Container>
        <Col className="col-sm d-flex">
          <Card style={{ width: "50rem" }}>
            <Card.Header>About Me</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Control as="textarea" rows="3" />
                </Form.Group>
              </Form>
              <Container className="d-flex justify-content-center">
                <Button variant="success">Update</Button>
              </Container>
            </Card.Body>
          </Card>
        </Col>
      </Container>
    );
  }
}

export default CreateProfile;
