import React from "react";
import "./styles/button.css";

const Button = (props) => {
  return (
    <button onClick={props.handleClick} className={props.className}>
      <strong>{props.text}</strong>
    </button>
  );
};

export default Button;
