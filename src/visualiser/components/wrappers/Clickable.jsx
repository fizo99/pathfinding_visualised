import React from "react";
import "../styles/clickable.css";

const Clickable = (props) => {
  return <section className="clickable">{props.children}</section>;
};

export default Clickable;
