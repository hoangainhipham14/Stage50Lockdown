// import axios from "axios";
import React, { Component } from "react";
import { Carousel } from "react-bootstrap";
import "./custom.css";

class DisplayCarousel extends Component {
  state = {
    projectId: "",
  };

  componentDidMount = () => {
    const projectId = this.props.match.params.projectId;
    this.setState({
      projectId: projectId,
    });
  };

  render() {
    return (
      <Carousel>
        <Carousel.Item>
          <img src={`/api/project/img/${this.state.projectId}`} />

          {/* <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption> */}
        </Carousel.Item>

        <Carousel.Item>
          <img src={`/api/project/img/${this.state.projectId}`} />
          {/* <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption> */}
        </Carousel.Item>

        <Carousel.Item>
          <img src={`/api/project/img/${this.state.projectId}`} />
          {/* <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption> */}
        </Carousel.Item>
      </Carousel>
    );
  }
}

export default DisplayCarousel;
