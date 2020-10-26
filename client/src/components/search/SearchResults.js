import React, { Component } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { HCenter } from "../layout";

class UserSearchResults extends Component {
  render() {
    // Map each of the results to a list item
    const results = this.props.userresults;
    console.log(results);

    const resultItems = results.map((result) => (
      <Card>
        <Card.Body>
          <Link to={`/profile/${result[1].username}`} key={result._id}>
            <Card.Title>
              {result[1].firstName} {result[1].lastName}
            </Card.Title>
          </Link>
          <Card.Subtitle>{result[1].username}</Card.Subtitle>
        </Card.Body>
      </Card>
    ));

    return resultItems;
  }
}

class ProjectSearchResults extends Component {
  render() {
    // Map each of the results to a list item
    const results = this.props.projectresults;

    // Shorten about section to avoid overflow in search results
    results.forEach((result) => {
      if (result[1].about.length > 70) {
        result[1].about = result[1].about.slice(0, 67) + "...";
      }
    });

    const resultItems = results.map((result) => (
      <Card>
        <Card.Body>
          <Link to={`/projects/${result[1]._id}`} key={result._id}>
            <Card.Title>{result[1].title}</Card.Title>
          </Link>
          <Card.Subtitle>{result[1].about}</Card.Subtitle>
        </Card.Body>
      </Card>
    ));

    return resultItems;
  }
}

class SearchResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchphrase: "",
      lastsearch: "",
      userresults: [],
      projectresults: [],
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

      // Get and set user search results
      axios.post(`/api/usersearch`, query).then((res) => {
        if (res.data.error) {
          console.log("Error searching for users: ", res.data.error);
        } else {
          this.setState({ userresults: res.data.results });
        }
      });

      // Get and set project search results
      axios.post(`/api/projectsearch`, query).then((res) => {
        if (res.data.error) {
          console.log("Error searching for projects: ", res.data.error);
        } else {
          this.setState({ projectresults: res.data.results });
        }
      });
    }
  }

  render() {
    const userresults = Object.entries(this.state.userresults);
    const projectresults = Object.entries(this.state.projectresults);

    return (
      <HCenter>
        <Container>
          <Row>
            <Col>
              <h1>
                Seach results for:{" "}
                <i>{this.props.location.state.searchphrase}</i>
              </h1>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <h3>Users:</h3>
              <hr />
              <UserSearchResults userresults={userresults} />
            </Col>
            <Col>
              <h3>Projects:</h3>
              <hr />
              <ProjectSearchResults projectresults={projectresults} />
            </Col>
          </Row>
        </Container>
      </HCenter>
    );
  }
}

export default SearchResults;
