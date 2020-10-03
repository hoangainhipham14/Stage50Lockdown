import React, { Component } from "react";
import { singleProject } from "./APIProject";
import { Redirect } from "react-router-dom";
import { Card, Container, Image, Row, Jumbotron, Col } from "react-bootstrap";
class SingleProject extends Component {
  state = {
    project: "",
    projectId: "",
    redirectToHome: false,
  };

  componentDidMount = () => {
    const projectId = this.props.match.params.projectId;
    singleProject(projectId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          project: data,
          projectId: projectId,
        });
      }
    });
  };

  renderProject = (project) => {
    return (
      <Container>
        <Card bg="Light" border="secondary">
          <Card.Header>{project.title}</Card.Header>
          <Card.Body>
            <Card.Text>{project.body}</Card.Text>
          </Card.Body>
        </Card>
        <Row>
          <Col sm={20}>
            <Image
              src={`/api/project/img/${this.state.projectId}`}
              alt={project.title}
              fluid
              rounded
            />
          </Col>
          <Col lg={true}>
            <Jumbotron>Project Details</Jumbotron>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Image
            src={`/api/project/img/${this.state.projectId}`}
            alt={project.title}
            rounded
          />
        </Row>
        <Row className="justify-content-md-center">
          <Image
            src={`/api/project/img/${this.state.projectId}`}
            alt={project.title}
            rounded
          />
        </Row>
      </Container>
    );
  };

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to={`/`} />;
    }
    const { project } = this.state;
    return (
      <div className="container">
        {!project ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderProject(project)
        )}
      </div>
    );
  }
}

export default SingleProject;
