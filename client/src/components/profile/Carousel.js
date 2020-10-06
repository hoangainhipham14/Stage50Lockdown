// import axios from "axios";
import React, { Component } from "react";
import { Carousel } from "react-bootstrap";
import "./custom.css";

class DisplayCarousel extends Component {
  render() {
    return (
      <Carousel>
        <Carousel.Item>
          <img src="OpenCV.png" alt="" />
          {/* <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption> */}
        </Carousel.Item>

        <Carousel.Item>
          <img src="Keras.png" alt="" />
          {/* <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption> */}
        </Carousel.Item>

        <Carousel.Item>
          <img src="Black.png" alt="" />
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
