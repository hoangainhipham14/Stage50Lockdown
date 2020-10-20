import React, { Component } from "react";
import { ListGroup, Button, Card, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
// import CreateProfile from "./CreateProfile";

class ProjectList extends Component {
  render() {
    var maxHeight;
    if (this.props.isAuth) {
      maxHeight = 299;
    } else {
      maxHeight = 350;
    }

    const projectCards = this.props.projects.map((project) => (
      <ListGroup.Item key={project._id}>
        <Card.Text style={{ textAlign: "right", fontSize: 13 }}>
          {project.created}
        </Card.Text>
        <Card.Title>{project.title}</Card.Title>
        <Card.Text>{project.about}</Card.Text>
        <Link to={`/projects/privacy/${project._id}`}>
          <Button>Change Privacy Settings</Button>
        </Link>
        <Link to={`/projects/${project._id}`}>
          <Button>More</Button>
        </Link>
      </ListGroup.Item>
    ));

    // if projects exist
    if (this.props.projectExists) {
      // display scrollable projects
      return (
        <Col className="col-sm d-flex">
          <Container>
            <Card style={{ width: "45rem", height: maxHeight }}>
              <Card.Header>Projects</Card.Header>
              <Container style={{ overflowY: "scroll", height: 301 }}>
                <ListGroup className="list-group-flush">
                  {projectCards}
                </ListGroup>
              </Container>
            </Card>
            {this.props.isAuth && (
              <Button href={`/createProfile/${this.props.username}`}>
                Edit Profile
              </Button>
            )}
            {this.props.isAuth && (
              <Button href={`/user/${this.props.username}/account`}>
                Edit Account Details
              </Button>
            )}
          </Container>
        </Col>
      );
      // }
    } else {
      // display no project
      return (
        <Col className="col-sm d-flex">
          <Container>
            <Card style={{ width: "45rem", height: maxHeight }}>
              <Card.Header>Projects</Card.Header>
              <Card.Body>
                <Card.Title>No project</Card.Title>
              </Card.Body>
            </Card>
            {this.props.isAuth && (
              <Button href={`/createProfile/${this.props.username}`}>
                Edit Profile
              </Button>
            )}
            {this.props.isAuth && (
              <Button href={`/user/${this.props.username}/account`}>
                Edit Account Details
              </Button>
            )}
          </Container>
        </Col>
      );
    }
  }
}

export default ProjectList;
