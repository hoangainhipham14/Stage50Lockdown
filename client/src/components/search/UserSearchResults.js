import React, { Component } from "react";
import { Container, ListGroup, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

class UserSearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchphrase: "",
      results: [],
    };

    try {
      this.state.searchphrase = this.props.location.state.searchphrase;
    } catch (err) {
      console.log("No searchphrase passed in");
    }
  }

  componentDidMount() {
    const query = { searchphrase: this.state.searchphrase };

    axios.post(`/api/usersearch`, query).then((res) => {
      if (res.data.error) {
        console.log("Error searching for users: ", res.data.error);
      } else {
        this.setState({ results: res.data.results });
        console.log("Here", res.data.results);
      }
    });
  }

  render() {
    // Map each of the results to a list item
    const results = this.state.results;
    const resultItems = results.map((result) => (
      <Link to={`/profile/${result.username}`} key={result._id}>
        <ListGroup.Item>
          <h3>
            {result.firstName} {result.lastName}
          </h3>
          <h4>{result.username}</h4>
        </ListGroup.Item>
      </Link>
    ));

    return (
      // List containing search results
      <Container>
        <h1 align="center">User Search Results: {this.state.searchphrase}</h1>
        <Row className="justify-content-md-center">
          <Col xs={6}>
            <ListGroup>{resultItems}</ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default UserSearchResults;
