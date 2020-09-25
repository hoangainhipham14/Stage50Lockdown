import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import { Modal, Button } from "react-bootstrap";

class Dashboard extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;

    return (
      <Modal.Dialog>
        <Modal.Header closeButton>
          <Modal.Title>Hello, {user.firstName}!</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>This is your ePortfolio Dashboard.</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.onLogoutClick}>Logout</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);