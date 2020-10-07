/**********************************************/
/* The Project List */
/**********************************************/

import axios from "axios";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Card,
  Container,
  Image,
  Row,
  Col,
  ListGroup,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";

class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
    };
  }

  componentDidMount = () => {
    const userId = this.props.auth.user._id;
    console.log("Sending request with:" + userId);

    //const userid = this.props.auth.user._id;
    // Gather all the projects
    axios.post(`/api/project/list`, { userID: userId }).then((response) => {
      if (response.error) {
        console.log("failure");
        console.log(response.error);
      } else {
        console.log("response:");
        this.setState({ projects: response.data });
        //console.log(this.state.projects);
      }
    });
  };

  render() {
    const projectCards = this.state.projects.map((project, idx) => (
      // project.linkRoute = "/projects/" + project._id;
      <Container>
        <Row>
          <Col>
            <Link to={`/projects/${project._id}`}>
              <ListGroup.Item key={idx}>{project.title}</ListGroup.Item>
            </Link>
          </Col>
          <Col>
            <Link to={`/projects/privacy/${project._id}`}>
              <ListGroup.Item key={idx}>Change Privacy Setting</ListGroup.Item>
            </Link>
          </Col>
        </Row>
      </Container>
    ));

    return (
      <Container>
        project list
        {projectCards}
      </Container>
    );
  }
}

/**
 * 
 *    <Button onClick={this.onTogglePrivacyClick(project._id)}>Toggle Privacy Settings
        </Button>
 */
ProjectList.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProjectList);
