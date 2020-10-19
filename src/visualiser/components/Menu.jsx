import React from "react";
import Legend from "./Legend";
import Button from "./Button";
import SelectField from "./SelectField";
import { astar } from "../algorithms/astar";
import { dijkstra } from "../algorithms/dijkstra";
import "./styles/menu.css";

const Menu = (props) => {
  const options = ["Fast", "Average", "Slow"];
  const solve = props.actions["solveFunction"];
  return (
    <section className="menu">
      <Legend />
      <section className="clickable">
        <section className="algorithmsButtons">
          <Button text={"Dijkstra"} handleClick={() => solve(dijkstra)} />
          <Button text={"A*"} handleClick={() => solve(astar)} />
          <Button text={"Generate Maze"} handleClick={props.actions.genMaze} />
        </section>
        <section className="interactions">
          <SelectField
            id={"animationSpeed"}
            options={options}
            defaultValue={"Speed"}
            handleAnimationSpeed={props.actions["changeSpeedHandler"]}
          />
          <Button
            className="btn-reset"
            text={"Reset"}
            handleClick={props.actions["resetGrid"]}
          />
          {/* <Button
            className="btn-wall"
            text={"Add walls"}
            handleClick={props.actions["drawingWallsHandler"]}
          /> */}
          <Button
            className="btn-start"
            text={"Change Start"}
            handleClick={props.actions["changeStartHandler"]}
          />
          <Button
            className="btn-finish"
            text={"Change End"}
            handleClick={props.actions["changeEndHandler"]}
          />
        </section>
      </section>
    </section>
  );
};

export default Menu;
