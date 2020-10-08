/**********************************************/
/* The Project List */
/**********************************************/

import axios from "axios";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, ListGroup, Button } from "react-bootstrap";
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
    //console.log("Sending request with:" + userId);

    //const userid = this.props.auth.user._id;
    // Gather all the projects in a post request with a userID
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
      <Container>
        <ListGroup.Item>
          <Link to={`/projects/${project._id}`} key={project._id}>
            <h5 class="mb-1 text-dark">{project.title}</h5>
            <p class="mb-1 text-dark">{project.about}</p>
            <small class="text-black-50">{project.created}</small>
          </Link>
        </ListGroup.Item>
        <Link to={`/projects/privacy/${project._id}`}>
          <Button>Change Privacy Settings</Button>
        </Link>
      </Container>
    ));

    return (
      <div class="list-group">
        Prototype Project List
        {projectCards}
      </div>
    );
  }
}

ProjectList.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProjectList);
