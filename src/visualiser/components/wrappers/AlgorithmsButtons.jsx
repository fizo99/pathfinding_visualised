import React from "react";
import "../styles/algorithmsButtons.css";

const AlgorithmsButtons = (props) => {
  return <section className="algorithmsButtons">{props.children}</section>;
};

export default AlgorithmsButtons;
