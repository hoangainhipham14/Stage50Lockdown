// import axios from "axios";
import React, { Component } from "react";
import { Carousel, Image } from "react-bootstrap";
import "./custom.css";

class DisplayCarousel extends Component {
  state = {
    projectId: "",
  };

  render() {
    const projectCards = this.props.projects.map((project) => (
      <Carousel.Item>
        <Image src={`/api/project/img/${project._id}`} />
      </Carousel.Item>
    ));

    return <Carousel>{projectCards}</Carousel>;
  }
}

export default DisplayCarousel;
