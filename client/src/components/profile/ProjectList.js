import React, { Component } from "react";
import { ListGroup, Button, Card, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

class ProjectList extends Component {
  render() {
    const projectCards = this.props.projects.map((project) => (
      <Link to={`/projects/${project._id}`}>
      <ListGroup.Item key={project._id}>        
        <Card.Text style={{ textAlign: "right", fontSize: 13 }}>
          {project.created}
        </Card.Text>
        <Card.Title>{project.title}</Card.Title>
        <Card.Text>{project.about}</Card.Text>
        <Link to={`/projects/privacy/${project._id}`}>
          <Button>Change Privacy Settings</Button>
        </Link>
      </ListGroup.Item>
      </Link>
    ));

    // if projects exist
    if (this.props.projectExists) {
      // if numbers of projects are smaller than 4, display list of them fully
      if (this.props.projects.length < 4) {
        return (
          <Col className="col-sm d-flex">
            <Card style={{ width: "45rem" }}>
              <Card.Header>Projects</Card.Header>
              <ListGroup className="list-group-flush">{projectCards}</ListGroup>
            </Card>
          </Col>
        );
      } else {
        // display scrollable projects
        return (
          <Col className="col-sm d-flex">
            <Card style={{ width: "45rem" }}>
              <Card.Header>Projects</Card.Header>
              <Container style={{ overflowY: "scroll", maxHeight: 300 }}>
                <ListGroup className="list-group-flush">
                  {projectCards}
                </ListGroup>
              </Container>
            </Card>
          </Col>
        );
      }
    } else {
      // display no project
      return (
        <Col className="col-sm d-flex">
          <Card style={{ width: "45rem" }}>
            <Card.Header>Projects</Card.Header>
            <Card.Body>
              <Card.Title>No project</Card.Title>
            </Card.Body>
          </Card>
        </Col>
      );
    }
  }
}

export default ProjectList;
