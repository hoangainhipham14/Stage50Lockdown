import React, { Component } from "react";
import { singleProject } from "./APIProject";
import {
  Card,
  Container,
  Image,
  Row,
  Jumbotron,
  Col,
  ListGroup,
} from "react-bootstrap";
class SingleProject extends Component {
  state = {
    project: "",
    projectId: "",
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
          <ListGroup variant="flush">
            <ListGroup.Item> {project.body}</ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col sm={20}>
                  <Image
                    src={`/api/project/img/${this.state.projectId}`}
                    alt={project.title}
                    rounded
                    thumbnail
                  />
                </Col>
                <Col lg={true}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque malesuada enim enim, non fermentum dui commodo ac.
                  Aenean rhoncus turpis nisl, eu dictum sem molestie id. Morbi
                  volutpat mattis ex vitae molestie. Proin id ante tempus,
                  euismod nunc vel, suscipit diam. Praesent pretium tellus quis
                  augue ultricies, sed congue erat gravida. Nulla tempor mattis
                  eros, vitae pulvinar nunc congue vel. Vestibulum non mi
                  tellus. Donec et mattis libero. Quisque eget urna nulla. Fusce
                  sed rhoncus ante. Quisque sit amet purus magna. Quisque
                  malesuada orci odio, vitae bibendum nulla porttitor ac. Nulla
                  quis iaculis mauris, bibendum placerat quam. Etiam condimentum
                  pellentesque suscipit. Aliquam erat volutpat. Mauris elit
                  nisi, aliquet ac est a, congue vestibulum neque.
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card>

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
