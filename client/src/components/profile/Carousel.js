// import axios from "axios";
import React, { Component } from "react";
import { Carousel, Image, Container } from "react-bootstrap";
import "./custom.css";
import { Link } from "react-router-dom";

class DisplayCarousel extends Component {
  render() {
    const projectCards = this.props.projects.map((project, idx) => (
      <Carousel.Item>
        <Container>
          <Image
            key={idx}
            src={`/api/project/img/${project._id}`}
            alt={project.title}
            style={{ height: 400, width: 400 }}
            className="float-right mt-5"
          />
        </Container>
        <Container>
          <Carousel.Caption className="text-left">
            <h1 style={{ fontSize: 30 }}>{project.title}</h1>
            <h2 style={{ fontSize: 20, width: "50%", height: "80%" }}>
              {project.about.substring(0, 100)}...
              <Link to={`/projects/${project._id}`} style={{ color: "white" }}>
                see more
              </Link>
            </h2>
          </Carousel.Caption>
        </Container>
      </Carousel.Item>
    ));

    return (
      // <div>
      //   {this.props.projects.length > 0 ? (
      <Carousel>
        {this.props.projects.length > 0 ? (
          projectCards
        ) : (
          <Carousel.Item></Carousel.Item>
        )}
      </Carousel>
      //   ) : (
      //     "No Project"
      //   )}
      // </div>
    );
  }
}

export default DisplayCarousel;
