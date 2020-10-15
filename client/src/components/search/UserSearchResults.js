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
  }

  componentDidMount() {
    // Get the initial searchphrase
    try {
      this.setState({ searchphrase: this.props.location.state.searchphrase });
    } catch (err) {
      console.log(err);
    }

    let query = { searchphrase: this.state.searchphrase };

    // Query database for results
    axios.post(`/api/usersearch`, query).then((res) => {
      if (res.data.error) {
        console.log("Error searching for users: ", res.data.error);
      } else {
        this.setState({ results: res.data.results });
      }
    });
  }

  componentDidUpdate(prevProps) {
    try {
      this.setState({ searchphrase: this.props.location.state.searchphrase });
    } catch (err) {
      console.log(err);
    }

    // Fetch the new results if the page is redirected to itself This allows
    // us to search for a different person when on the results page
    if (prevProps.location.key !== this.props.location.key) {
      let query = { searchphrase: this.state.searchphrase };

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
