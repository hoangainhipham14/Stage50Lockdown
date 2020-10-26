import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, deleteUser } from "../../actions/authActions";
import { getUsernameId } from "../layout/GetUsername";

import {
  Modal,
  Button,
  OverlayTrigger,
  Popover,
  Container,
} from "react-bootstrap";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.deleteUser = deleteUser;

    this.state = {
      username: "",
    };
  }

  componentDidMount = () => {
    const id = this.props.auth.user._id;
    getUsernameId(id).then((data) => {
      this.setState({
        username: data,
      });
    });
  };

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
    this.props.history.push("/");
  };

  onAccountDeleteClick = (e) => {
    e.preventDefault();
    this.deleteUser(this.props.history);
    this.props.logoutUser();
    this.props.history.push("/");
  };

  render() {
    // Are you sure dialog
    const popover = (
      <Popover id="popover-basic">
        <Popover.Title as="h3">
          Are you sure you want to delete your account?
        </Popover.Title>
        <Popover.Content>
          <p className="center">This action cannot be undone.</p>
          <Button variant="danger" onClick={this.onAccountDeleteClick}>
            Delete Account Forever
          </Button>
        </Popover.Content>
      </Popover>
    );
    return (
      <Container>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>Hello, {this.state.username}!</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>This is your ePortfolio Dashboard.</p>
          </Modal.Body>

          <Modal.Footer>
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={popover}
            >
              <Button variant="danger">Delete Account</Button>
            </OverlayTrigger>
            <Button variant="secondary" onClick={this.onLogoutClick}>
              Sign Out
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Container>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
