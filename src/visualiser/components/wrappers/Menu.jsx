import React from "react";
import "../styles/menu.css";

const Menu = (props) => {
  return <section className="menu">{props.children}</section>;
};

export default Menu;
