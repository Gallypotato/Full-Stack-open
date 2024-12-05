import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

const Togglable = forwardRef((props, ref) => {
  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
  };

  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div style={{ position: "relative" }}>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility} color="primary" size="small" variant="contained">{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible} className="togglableContent">
        <Button onClick={toggleVisibility} color="secondary" size="small" variant="contained">
          {props.closeLabel || "cancel"}
        </Button>
        {props.children}
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};
Togglable.displayName = "Togglable";
export default Togglable;
