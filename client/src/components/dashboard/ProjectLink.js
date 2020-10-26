import React, { Component } from "react";
import axios from "axios";
import { Form, Card, Badge, Col, Button, Row } from "react-bootstrap";

// Just Change The Component it inherits to something that also passes down the project
// id as a parameter
class ProjectLink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      requiredTime: 30,
      generatedLink: "",
      isPermanent: false,
    };
    console.log(this.state);
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  // Very similar to onSubmit
  togglePermanentLink = (e) => {
    e.preventDefault();
    console.log("Prior::" + this.state.isPermanent);

    if (this.state.isPermanent === true) {
      this.setState({ isPermanent: false });
    }
    if (this.state.isPermanent === false) {
      this.setState({ isPermanent: true });
    }
    console.log(this.state.isPermanent);
  };

  // Send a request to the database to switch the itemIsPublic bool
  onSubmit = (e) => {
    e.preventDefault();
    //console.log("Will this be the ID: " + this.props.projectID);
    const projectID = this.props.projectId;

    // Prefill the default time if nothing has been inputed
    console.log(
      "Button Clicked with id: " +
        projectID +
        "And time " +
        this.state.requiredTime
    );
    axios
      .post(`/api/project/generateLink/`, {
        projectID: projectID,
        requiredTime: this.state.requiredTime,
        isPermanent: this.state.isPermanent,
      })
      .then((response) => {
        if (response.error) {
          console.log("failure");
          console.log(response.error);
        } else {
          console.log(response);
          // Assign the link to the state
          this.setState({ generatedLink: response.data });
        }
      });
  };

  render() {
    return (
      // <Container>
      <Card style={{ width: "40rem" }}>
        <Card.Header>
          Generate Share Link (Works even if the project is private)
        </Card.Header>
        <Form onSubmit={this.onSubmit}>
          <Form.Row>
            <Col sm={4}>
              <Form.Group controlId="requiredTime">
                <Form.Label>
                  <Badge variant="secondary">Link LifeSpan (Mins)</Badge>
                </Form.Label>
                <Form.Control
                  type="text"
                  defaultValue="30"
                  onChange={this.onChange}
                />
              </Form.Group>
            </Col>
            <Col sm={8}>
              <Form.Group controlId="resultingLink">
                <Form.Label>
                  <Badge variant="primary">Generated Link</Badge>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="A link will appear here..."
                  onChange={this.onChange}
                  value={this.state.generatedLink}
                />
              </Form.Group>
            </Col>
          </Form.Row>
          <Row>
            <Col sm={4}>
              <Button variant="primary" type="submit">
                Generate Link
              </Button>
            </Col>

            <Col sm={4}>
              <Form.Group controlId="switchForPermLink">
                <Form.Check
                  type="switch"
                  id="switchForPermLink"
                  label="Make Link Permanent"
                  onChange={this.togglePermanentLink}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Card>
      // </Container>
    );
  }
}

export default ProjectLink;
