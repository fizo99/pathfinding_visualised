import React from "react";
import "./styles/cell.css";

const Cell = (props) => {
  const {
    col,
    row,
    isFinish,
    isStart,
    isWall,
    isPath,
    isVisited,
    clickHandler,
  } = props;

  let cName = "cell";

  if (isVisited) cName = "cell visited";
  if (isPath) cName = "cell path";
  if (isFinish) cName = "cell finish";
  if (isStart) cName = "cell start";
  if (isWall) cName = "cell wall";

  return (
    <div onClick={clickHandler} className={cName} id={`${row}-${col}`}>
      {isStart ? <i className="far fa-play-circle"></i> : null}
      {isFinish ? <i className="far fa-times-circle"></i> : null}
    </div>
  );
};

export default Cell;
