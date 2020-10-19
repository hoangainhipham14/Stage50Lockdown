import React, { Component } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

class UserSearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchphrase: "",
      results: [],
      lastsearch: "",
    };
  }

  componentDidMount() {
    // Force the component to update when first mounted
    // componentDidUpdate() gets called, where logic happens
    this.forceUpdate();
  }

  componentDidUpdate() {
    let query = { searchphrase: this.props.location.state.searchphrase };

    // Only search database if searchphrase has changed
    if (this.props.location.state.searchphrase !== this.state.lastsearch) {
      this.setState({ lastsearch: this.props.location.state.searchphrase });
      axios.post(`/api/usersearch`, query).then((res) => {
        if (res.data.error) {
          console.log("Error searching for users: ", res.data.error);
        } else {
          this.setState({ results: res.data.results });
        }
      });
    }
  }

  render() {
    // Map each of the results to a list item
    const results = this.state.results;

    const resultItems = results.map((result) => (
      <Card>
        <Card.Body>
          <Link to={`/profile/${result.username}`} key={result._id}>
            <Card.Title>
              {result.firstName} {result.lastName}
            </Card.Title>
            <Card.Subtitle>{result.username}</Card.Subtitle>
          </Link>
        </Card.Body>
      </Card>
    ));

    return (
      <Container align="center">
        <Row className="justify-content-md-center">
          <h1 align="center">
            Seach results for: <i>{this.props.location.state.searchphrase}</i>
          </h1>
        </Row>
        <hr />
        <Row className="justify-content-md-center">
          <Col xs={6}>{resultItems}</Col>
        </Row>
      </Container>
    );
  }
}

export default UserSearchResults;
