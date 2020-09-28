import React from "react";
import Legend from "./Legend";
import Button from "./Button";
import "./styles/menu.css";

const TopBar = (props) => {
  return (
    <section className="menu">
      <Legend />
      <section className="clickable">
        <section className="algorithmsButtons">
          <Button text={"Dijkstra"} handleClick={props.actions["dijkstra"]} />
          <Button text={"A*"} handleClick={props.actions["astar"]} />
        </section>
        <section className="interactions">
          <select
            id="animationSpeed"
            onChange={props.actions["changeSpeed"]}
            defaultValue={"Speed"}
          >
            <option hidden disabled value="Speed">
              Speed
            </option>
            <option value="fast">Fast</option>
            <option value="average">Average</option>
            <option value="slow">Slow</option>
          </select>
          <Button
            className="btn-reset"
            text={"Reset"}
            handleClick={props.actions["resetGrid"]}
          />
          <Button
            className="btn-wall"
            text={"Add walls"}
            handleClick={props.actions["drawingWalls"]}
          />
          <Button
            className="btn-start"
            text={"Change Start"}
            handleClick={props.actions["changeStart"]}
          />
          <Button
            className="btn-finish"
            text={"Change End"}
            handleClick={props.actions["changeEnd"]}
          />
        </section>
      </section>
    </section>
  );
};

export default TopBar;
