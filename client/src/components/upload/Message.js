import React, { useState } from "react";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";

const Message = ({ isSubmitted, message }) => {
  const [show, setShow] = useState(true);

  if (show) {
    if (isSubmitted) {
      return (
        <Alert
          variant={"primary"}
          onClose={() => {
            setShow(false);
          }}
          dismissible
        >
          {message}
        </Alert>
      );
    } else {
      return (
        <Alert
          variant={"warning"}
          onClose={() => {
            setShow(false);
          }}
          dismissible
        >
          {message}
        </Alert>
      );
    }
  } else {
    return null;
  }
};

Message.propTypes = {
  message: PropTypes.string.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
};

export default Message;
