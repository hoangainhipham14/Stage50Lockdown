// import axios from "axios";
import React, { Component } from "react";
import { Carousel, Image, Container } from "react-bootstrap";
import "./custom.css";
import { Link } from "react-router-dom";

class DisplayCarousel extends Component {
  render() {
    // display image of each project, show project title, part of about project text,
    // and link to each project to see more

    const projectCards = this.props.projects.map((project, idx) =>
      this.props.isAuth ? (
        <Carousel.Item key={idx}>
          <Container>
            <Image
              key={idx}
              src={`/api/project/${project._id}/mainImage`}
              alt={project.title}
              style={{ height: 400, width: 400 }}
              className="float-right mt-5"
            />
          </Container>
          <Container>
            <Carousel.Caption className="text-left">
              <h1 style={{ fontSize: 30 }}>{project.title}</h1>
              <h2 style={{ fontSize: 20, width: "50%", height: "80%" }}>
                {project.about.substring(0, 900)}...
                <Link
                  to={`/projects/${project._id}`}
                  style={{ color: "white" }}
                >
                  see more
                </Link>
              </h2>
            </Carousel.Caption>
          </Container>
        </Carousel.Item>
      ) : (
        project.itemIsPublic && (
          <Carousel.Item key={idx}>
            <Container>
              <Image
                key={idx}
                src={`/api/project/${project._id}/mainImage`}
                alt={project.title}
                style={{ height: 400, width: 400 }}
                className="float-right mt-5"
              />
            </Container>
            <Container>
              <Carousel.Caption className="text-left">
                <h1 style={{ fontSize: 30 }}>{project.title}</h1>
                <h2 style={{ fontSize: 20, width: "50%", height: "80%" }}>
                  {project.about.substring(0, 900)}...
                  <Link
                    to={`/projects/${project._id}`}
                    style={{ color: "white" }}
                  >
                    see more
                  </Link>
                </h2>
              </Carousel.Caption>
            </Container>
          </Carousel.Item>
        )
      )
    );

    return <Carousel>{projectCards}</Carousel>;
  }
}

export default DisplayCarousel;
