import React, { Component } from "react";
import { Container } from "react-bootstrap";

class NoMatch extends Component {
  render() {
    return (
      <Container align="center">
        <h1>404 Error</h1>
        <h3>There doesn't appear to be anything here...</h3>
      </Container>
    );
  }
}

export default NoMatch;
