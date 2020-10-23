import React from "react";
import Cell from "./Cell";

const Grid = (props) => {
  const { mouseEvents, options } = props;
  return (
    <section
      className="grid"
      id="grid"
      onMouseDown={options.isDrawingWalls ? mouseEvents.mouseDown : null}
      onMouseUp={options.isDrawingWalls ? mouseEvents.mouseUp : null}
      onMouseMove={
        options.isDrawingWalls && options.isMouseClicked
          ? mouseEvents.mouseDrag
          : null
      }
    >
      {props.grid.map((row, rowId) => {
        return (
          <div key={rowId} className="row">
            {row.map((cell, cellId) => {
              const {
                row,
                col,
                isStart,
                isFinish,
                isWall,
                isVisited,
                isPath,
              } = cell;
              return (
                <Cell
                  key={cellId}
                  row={row}
                  col={col}
                  isStart={isStart}
                  isFinish={isFinish}
                  isWall={isWall}
                  isVisited={isVisited}
                  isPath={isPath}
                  clickHandler={
                    options.isChangingStart
                      ? mouseEvents.changeStart
                      : options.isChangingEnd
                      ? mouseEvents.changeEnd
                      : null
                  }
                ></Cell>
              );
            })}
          </div>
        );
      })}
    </section>
  );
};

export default Grid;
