import React from "react";
import "./App.css";
import "./components/styles/mobile/media-queries.css";

import { delay } from "./utils";

//wrappers
import Interactions from "./components/wrappers/Interactions";
import AlgorithmsButtons from "./components/wrappers/AlgorithmsButtons";
import Menu from "./components/wrappers/Menu";
import Clickable from "./components/wrappers/Clickable";
//components
import Grid from "./components/Grid";
import Legend from "./components/Legend";
import Footer from "./components/Footer";
import Button from "./components/Button";
import SelectField from "./components/SelectField";
//algorithms
import { dijkstra } from "./algorithms/dijkstra";
import { astar } from "./algorithms/astar";
import DFSmaze from "./algorithms/DFSmaze";

//number of rows and columns of start grid
let numRow = 25;
let numCol = 51;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      startCellCoords: {
        row: 12,
        col: 8,
      },
      endCellCoords: {
        row: 12,
        col: 14,
      },
      isDrawingWalls: false,
      isMouseClicked: false,
      isChangingStart: false,
      isChangingEnd: false,
      animationSpeed: 3,
      isAnimationInProccess: false,
    };
    this.tempGrid = null;
  }

  makeCell = (row, col) => {
    const { startCellCoords, endCellCoords } = this.state;
    return {
      row: row,
      col: col,
      isStart: row === startCellCoords.row && col === startCellCoords.col,
      isFinish: row === endCellCoords.row && col === endCellCoords.col,
      isWall: false,
      previousCell: null,
      distance: Infinity,
      isVisited: false,
      isPath: false,
      f: 0,
      g: 0,
      h: 0,
    };
  };
  makeGrid = () => {
    const grid = [];
    if (numCol % 2 === 0) numCol++;
    for (let i = 0; i < numRow; i++) {
      const curCol = [];
      for (let j = 0; j < numCol; j++) {
        curCol.push(this.makeCell(i, j));
      }
      grid.push(curCol);
    }
    return grid;
  };

  resetGrid = () => {
    if (this.state.isAnimationInProccess) return;
    this.setState({
      grid: this.makeGrid(),
      isDrawingWalls: false,
      isMouseClicked: false,
      isChangingStart: false,
      isChangingEnd: false,
    });
  };

  genMaze = () => {
    if (this.state.isAnimationInProccess) return;

    const { startCellCoords, endCellCoords } = this.state;
    const grid = this.makeGrid();

    DFSmaze(startCellCoords, endCellCoords, numRow, numCol, grid);
    this.setState({ grid: grid });
  };

  solve = (algorithm) => {
    if (this.state.isAnimationInProccess) return;
    const { grid, startCellCoords, endCellCoords } = this.state;
    for (let i = 0; i < numCol; i++) {
      for (let j = 0; j < numRow; j++) {
        grid[j][i].isVisited = false;
        grid[j][i].distance = Infinity;
        grid[j][i].previousCell = null;
        grid[j][i].f = 0;
        grid[j][i].g = 0;
        grid[j][i].h = 0;
        grid[j][i].isPath = false;
      }
    }
    this.setState(
      {
        grid: grid,
        isAnimationInProccess: true,
      },
      () => {
        const startCell = grid[startCellCoords.row][startCellCoords.col];
        const endCell = grid[endCellCoords.row][endCellCoords.col];

        const visitedCellsInOrder = algorithm(grid, startCell, endCell);
        this.animateVisited(visitedCellsInOrder).then((data) => {
          const grid = data[0];
          delay(data[1]).then(() => {
            const newGrid = this.animatePath(grid);
            this.setState({ grid: newGrid, isAnimationInProccess: false });
          });
        });
      }
    );
  };

  //ANIMATIONS
  animateVisited = (visitedCellsInOrder) => {
    const { grid, endCellCoords, startCellCoords, animationSpeed } = this.state;
    return new Promise(function (resolve, reject) {
      for (let i = 1; i < visitedCellsInOrder.length; i++) {
        const row = visitedCellsInOrder[i].row;
        const col = visitedCellsInOrder[i].col;
        if (
          (row === startCellCoords.row && col === startCellCoords.col) ||
          (row === endCellCoords.row && col === endCellCoords.col)
        )
          continue;
        setTimeout(() => {
          grid[row][col].isVisited = true;
          document.getElementById(`${row}-${col}`).className = "cell visited";
        }, i * animationSpeed);
      }
      resolve([grid, visitedCellsInOrder.length * animationSpeed]); // immediately give the result: 123
    });
  };
  animatePath = (grid) => {
    const { endCellCoords, startCellCoords, animationSpeed } = this.state;
    const lastCell = grid[endCellCoords.row][endCellCoords.col];
    let temp = lastCell;

    //shortest path
    const path = [];
    while (temp !== null) {
      path.push(temp);
      temp = temp.previousCell;
    }

    for (let i = 0; i < path.length - 1; i++) {
      let row = path[i].row;
      let col = path[i].col;
      if (
        (row === startCellCoords.row && col === startCellCoords.col) ||
        (row === endCellCoords.row && col === endCellCoords.col)
      )
        continue;
      setTimeout(() => {
        grid[row][col].isPath = true;
        document.getElementById(`${row}-${col}`).className = "cell path";
      }, i * animationSpeed);
    }
    return grid;
  };

  // INTERACTIONS HANDLERS
  animationSpeedHandler = (e) => {
    if (this.state.isAnimationInProccess) return;
    const value = e.target.value;
    if (value === "Fast") this.setState({ animationSpeed: 3 });
    else if (value === "Average") this.setState({ animationSpeed: 12 });
    else if (value === "Slow") this.setState({ animationSpeed: 25 });
  };
  changeStartBtnHandler = () => {
    if (this.state.isAnimationInProccess) return;
    this.setState({
      isChangingStart: true,
      isChangingEnd: false,
      isDrawingWalls: false,
    });
  };
  changeEndBtnHandler = () => {
    if (this.state.isAnimationInProccess) return;
    this.setState({
      isChangingEnd: true,
      isChangingStart: false,
      isDrawingWalls: false,
    });
  };
  drawingWallsBtnHandler = () => {
    if (this.state.isAnimationInProccess) return;
    this.setState({
      isChangingEnd: false,
      isChangingStart: false,
      isDrawingWalls: true,
    });
  };
  mouseDownHandler = () => {
    this.tempGrid = this.state.grid;
    this.setState({
      isMouseClicked: true,
    });
  };
  mouseUpHandler = () => {
    this.setState({
      isMouseClicked: false,
      grid: this.tempGrid,
    });
  };

  changeEndCell = (e) => {
    if (this.state.isAnimationInProccess) return;
    const cellCoords = e.target.id.split("-");
    if (cellCoords.length < 2) return;

    const { endCellCoords, grid } = this.state;
    grid[endCellCoords.row][endCellCoords.col].isFinish = false;
    grid[parseInt(cellCoords[0])][parseInt(cellCoords[1])].isFinish = true;
    this.setState({
      grid: grid,
      endCellCoords: {
        row: parseInt(cellCoords[0]),
        col: parseInt(cellCoords[1]),
      },
    });
  };
  changeStartCell = (e) => {
    if (this.state.isAnimationInProccess) return;
    const cellCoords = e.target.id.split("-");
    if (cellCoords.length < 2) return;

    const { startCellCoords, grid } = this.state;
    grid[startCellCoords.row][startCellCoords.col].isStart = false;
    grid[parseInt(cellCoords[0])][parseInt(cellCoords[1])].isStart = true;
    this.setState({
      grid: grid,
      startCellCoords: {
        row: parseInt(cellCoords[0]),
        col: parseInt(cellCoords[1]),
      },
    });
  };

  drawWalls = (e) => {
    if (this.state.isAnimationInProccess) return;
    const { startCellCoords, endCellCoords } = this.state;
    const cellCoords = e.target.id.split("-");
    if (cellCoords.length < 2) return;
    if (
      (parseInt(cellCoords[0]) === startCellCoords.row &&
        parseInt(cellCoords[1]) === startCellCoords.col) ||
      (parseInt(cellCoords[0]) === endCellCoords.row &&
        parseInt(cellCoords[1]) === endCellCoords.col)
    )
      return;
    console.log(cellCoords);
    document.getElementById(
      "" + cellCoords[0] + "-" + cellCoords[1]
    ).className = "cell wall";
    this.tempGrid[cellCoords[0]][cellCoords[1]].isWall = true;
  };
  //window sizing/resizing for responsive grid
  sizing = () => {
    if (this.state.isAnimationInProccess) return;
    const width = window.innerWidth;

    if (width <= 576) numCol = 15;
    else if (width > 576 && width <= 1024) numCol = 25;
    else if (width > 1024 && width < 1200) numCol = 30;
    else numCol = 50;

    this.setState(
      {
        startCellCoords: { row: 12, col: Math.ceil(numCol / 3) },
        endCellCoords: { row: 12, col: Math.ceil(numCol / 3) * 2 },
      },
      () => {
        const grid = this.makeGrid();
        this.setState({
          grid: grid,
        });
      }
    );
  };
  reSizing = () => {
    if (this.state.isAnimationInProccess) return;
    const width = window.innerWidth;

    if (width <= 576) numCol = 15;
    else if (width > 576 && width <= 1024) numCol = 25;
    else if (width > 1024 && width < 1200) numCol = 30;
    else numCol = 50;

    this.setState(
      {
        startCellCoords: {
          row: 12,
          col: Math.ceil(numCol / 3),
        },
        endCellCoords: {
          row: 12,
          col: Math.ceil(numCol / 3) * 2,
        },
      },
      () => {
        const grid = this.makeGrid();
        this.setState({
          grid: grid,
        });
      }
    );
  };

  componentDidMount() {
    window.onload = this.sizing;
    window.addEventListener("resize", this.reSizing);
  }

  componentDidUpdate = () => {};

  render() {
    const {
      grid,
      isDrawingWalls,
      isChangingEnd,
      isChangingStart,
      isMouseClicked,
    } = this.state;
    return (
      <main>
        <Menu>
          <Legend />
          <Clickable>
            <AlgorithmsButtons>
              <Button
                text={"Dijkstra"}
                handleClick={() => this.solve(dijkstra)}
              />
              <Button text={"A*"} handleClick={() => this.solve(astar)} />
              <Button
                text={"Generate Maze"}
                handleClick={() => this.genMaze()}
              />
            </AlgorithmsButtons>
            <Interactions>
              <SelectField
                id={"animationSpeed"}
                options={["Fast", "Average", "Slow"]}
                defaultValue={"Speed"}
                handleAnimationSpeed={this.animationSpeedHandler}
              />
              <Button
                className="btn-reset"
                text={"Reset"}
                handleClick={this.resetGrid}
              />
              <Button
                className="btn-wall"
                text={"Add walls"}
                handleClick={this.drawingWallsBtnHandler}
              />
              <Button
                className="btn-start"
                text={"Change Start"}
                handleClick={this.changeStartBtnHandler}
              />
              <Button
                className="btn-finish"
                text={"Change End"}
                handleClick={this.changeEndBtnHandler}
              />
            </Interactions>
          </Clickable>
        </Menu>
        <Grid
          options={{
            isDrawingWalls: isDrawingWalls,
            isMouseClicked: isMouseClicked,
            isChangingStart: isChangingStart,
            isChangingEnd: isChangingEnd,
          }}
          mouseEvents={{
            changeStart: this.changeStartCell,
            changeEnd: this.changeEndCell,
            mouseDown: this.mouseDownHandler,
            mouseUp: this.mouseUpHandler,
            mouseDrag: this.drawWalls,
          }}
          grid={grid}
        />
        <Footer />
      </main>
    );
  }
}

export default App;

/*  bin
animateMaze = (walls) => {
    const { grid, endCellCoords, startCellCoords, animationSpeed } = this.state;
    return new Promise(function (resolve, reject) {
      for (let i = 0; i < walls.length; i++) {
        const row = walls[i].row;
        const col = walls[i].col;
        if (
          (row === startCellCoords.row && col === startCellCoords.col) ||
          (row === endCellCoords.row && col === endCellCoords.col)
        )
          continue;
        setTimeout(() => {
          grid[row][col].isWall = true;
          document.getElementById(`${row}-${col}`).className = "cell wall";
        }, i * animationSpeed);
      }
      resolve(walls.length * animationSpeed); // immediately give the result: 123
    });
  };

*/
