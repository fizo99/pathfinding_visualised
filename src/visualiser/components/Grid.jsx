import React from "react";
import Cell from "./Cell";

const Grid = (props) => {
  const {
    //handlePress,
    //handleMouseDown,
    //handleMouseUp,
    changeStartCell,
    changeEndCell,
  } = props.actions;
  const {
    isChangingEnd,
    isChangingStart,
    //isDrawingWalls,
    //isMouseClicked,
  } = props.properties;
  return (
    <section
      className="grid"
      id="grid"
      // onMouseMove={isDrawingWalls && isMouseClicked ? handlePress : null}
      // onMouseDown={isDrawingWalls ? handleMouseDown : null}
      // onMouseUp={isDrawingWalls ? handleMouseUp : null}
      // onClick={
      //   isChangingStart ? changeStartCell : isChangingEnd ? changeEndCell : null
      // }
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
                    isChangingStart
                      ? changeStartCell
                      : isChangingEnd
                      ? changeEndCell
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
