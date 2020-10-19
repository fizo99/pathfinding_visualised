import React from "react";
import "./styles/visualiser.css";
import "./styles/mobile/media-queries.css";
import Footer from "./Footer";
import Menu from "./Menu";
import Grid from "./Grid";
import DFSmaze from "../algorithms/DFSmaze";

let numRow = 25;
let numCol = 51;

const delay = (ms) => {
  return new Promise((res) => setTimeout(res, ms));
};

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
      //isDrawingWalls: false,
      isMouseClicked: false,
      isChangingStart: false,
      isChangingEnd: false,
      animationSpeed: 14,
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
      g: 0,
      f: 0,
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

  genMaze = async () => {
    if (this.state.isAnimationInProccess) return;
    const { startCellCoords, endCellCoords } = this.state;
    const grid = this.makeGrid();
    DFSmaze(startCellCoords, endCellCoords, numRow, numCol, grid);
    this.setState({ grid: grid });
    // const walls = [];
    // for (let i = 0; i < numRow; i++) {
    //   for (let j = 0; j < numCol - 1; j++) {
    //     if (grid[i][j].isWall) walls.push(grid[i][j]);
    //   }
    // }
    // const finalGrid = grid;
    // for (let i = 0; i < numRow; i++) {
    //   finalGrid[i].pop();
    // }
    // numCol--;
    // const result = this.animateMaze(walls);
    // result
    //   .then(async (ms) => {
    //     await delay(ms);
    //   })
    //   .then(() => {
    //     this.setState({ grid: finalGrid });
    //   });
  };

  solve = async (algorithm) => {
    if (this.state.isAnimationInProccess) return;
    const { grid, startCellCoords, endCellCoords } = this.state;
    for (let i = 0; i < numCol; i++) {
      for (let j = 0; j < numRow; j++) {
        grid[j][i].isVisited = false;
        grid[j][i].f = 0;
        grid[j][i].g = 0;
        grid[j][i].h = 0;
        grid[j][i].isPath = false;
      }
    }
    await this.setState({
      grid: grid,
      isAnimationInProccess: true,
    });
    const startCell = grid[startCellCoords.row][startCellCoords.col];
    const endCell = grid[endCellCoords.row][endCellCoords.col];

    const visitedCellsInOrder = algorithm(grid, startCell, endCell);

    const result = this.animateVisited(visitedCellsInOrder);
    result
      .then(async (data) => {
        await delay(data[1]);
        return data[0];
      })
      .then((grid) => {
        const newGrid = this.animatePath(grid);
        this.setState({ grid: newGrid, isAnimationInProccess: false });
      });
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
  handleAnimationSpeed = (e) => {
    if (this.state.isAnimationInProccess) return;
    const value = e.target.value;
    if (value === "Fast") this.setState({ animationSpeed: 9 });
    else if (value === "Average") this.setState({ animationSpeed: 14 });
    else if (value === "Slow") this.setState({ animationSpeed: 25 });
  };
  changeStartHandler = () => {
    if (this.state.isAnimationInProccess) return;
    this.setState({
      isChangingStart: true,
      isChangingEnd: false,
      isDrawingWalls: false,
    });
  };
  changeEndHandler = () => {
    if (this.state.isAnimationInProccess) return;
    this.setState({
      isChangingEnd: true,
      isChangingStart: false,
      isDrawingWalls: false,
    });
  };
  changeEndCell = (e) => {
    if (this.state.isAnimationInProccess) return;
    const cellCoords = e.target.id.split("-");
    if (cellCoords.length < 2) return;

    const { endCellCoords, grid } = this.state;
    grid[endCellCoords.row][endCellCoords.col].isFinish = false;
    grid[cellCoords[0]][cellCoords[1]].isFinish = true;
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
    grid[cellCoords[0]][cellCoords[1]].isStart = true;
    this.setState({
      grid: grid,
      startCellCoords: {
        row: parseInt(cellCoords[0]),
        col: parseInt(cellCoords[1]),
      },
    });
  };

  //window sizing/resizing for responsive grid
  sizing = async () => {
    if (this.state.isAnimationInProccess) return;
    const width = window.innerWidth;

    if (width <= 576) numCol = 15;
    else if (width > 576 && width <= 1024) numCol = 25;
    else if (width > 1024 && width < 1200) numCol = 30;
    else numCol = 50;

    await this.setState({
      startCellCoords: { row: 12, col: Math.ceil(numCol / 3) },
      endCellCoords: { row: 12, col: Math.ceil(numCol / 3) * 2 },
    });

    const grid = this.makeGrid();
    this.setState({
      grid: grid,
    });
  };
  reSizing = async () => {
    if (this.state.isAnimationInProccess) return;
    const width = window.innerWidth;

    if (width <= 576) numCol = 15;
    else if (width > 576 && width <= 1024) numCol = 25;
    else if (width > 1024 && width < 1200) numCol = 30;
    else numCol = 50;

    await this.setState({
      startCellCoords: {
        row: 12,
        col: Math.ceil(numCol / 3),
      },
      endCellCoords: {
        row: 12,
        col: Math.ceil(numCol / 3) * 2,
      },
    });

    const grid = this.makeGrid();

    this.setState({
      grid: grid,
    });
  };

  componentDidMount() {
    window.onload = this.sizing;
    window.addEventListener("resize", this.reSizing);
  }

  render() {
    const grid = this.state.grid;
    const buttonActions = {
      genMaze: this.genMaze,
      solveFunction: this.solve,
      resetGrid: this.resetGrid,
      drawingWallsHandler: this.drawingWallsHandler,
      changeStartHandler: this.changeStartHandler,
      changeEndHandler: this.changeEndHandler,
      changeSpeedHandler: this.handleAnimationSpeed,
    };
    const gridProperties = {
      isDrawingWalls: this.state.isDrawingWalls,
      isMouseClicked: this.state.isMouseClicked,
      isChangingStart: this.state.isChangingStart,
      isChangingEnd: this.state.isChangingEnd,
    };
    const gridActions = {
      handlePress: this.handlePress,
      handleMouseDown: this.handleMouseDown,
      handleMouseUp: this.handleMouseUp,
      changeEndCell: this.changeEndCell,
      changeStartCell: this.changeStartCell,
    };
    return (
      <main>
        <Menu actions={buttonActions} />
        <Grid grid={grid} actions={gridActions} properties={gridProperties} />
        <Footer />
      </main>
    );
  }
}

export default App;

//bin (maybe will use in future)
/*  handlePress = (e) => {
    if (this.state.isAnimationInProccess) return;
    const coords = e.target.id.split("-");
    if (coords.length !== 2) {
      console.log("out");
      this.handleMouseUp();
      return;
    }
    if (
      (parseInt(coords[0]) === this.state.startCellCoords.row &&
        parseInt(coords[1]) === this.state.startCellCoords.col) ||
      (parseInt(coords[0]) === this.state.endCellCoords.row &&
        parseInt(coords[1]) === this.state.endCellCoords.col)
    )
      return;
    document.getElementById(`${coords[0]}-${coords[1]}`).className =
      "cell wall";
    this.tempGrid[coords[0]][coords[1]].isWall = true;
    this.tempGrid[coords[0]][coords[1]].isVisited = false;
    this.tempGrid[coords[0]][coords[1]].isPath = false;
  };
  handleMouseDown = () => {
    if (this.state.isAnimationInProccess) return;
    this.tempGrid = this.state.grid;
    this.setState({
      isMouseClicked: true,
    });
  };
  handleMouseUp = () => {
    if (this.state.isAnimationInProccess) return;
    this.setState({
      isMouseClicked: false,
      grid: this.tempGrid,
    });
    this.tempGrid = null;
  };
  drawingWallsHandler = () => {
    if (this.state.isAnimationInProccess) return;
    this.setState({
      isDrawingWalls: true,
      isChangingStart: false,
      isChangingEnd: false,
    });
  };
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
          //grid[row][col].isWall = true;
          document.getElementById(`${row}-${col}`).className = "cell wall";
        }, i * animationSpeed);
      }
      resolve(walls.length * animationSpeed); // immediately give the result: 123
    });
  };
*/
