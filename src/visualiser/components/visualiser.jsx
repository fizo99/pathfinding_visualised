import React from "react";
import "./styles/visualiser.scss";
import Cell from "./cell";
import Legend from "./legend";
import { dijkstra } from "../algorithms/dijkstra";
import { astar } from "../algorithms/astar";

let numRow = 20;
let numCol = 50;

class Visualiser extends React.Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      visitedCells: [],
      startCellCoords: {
        row: 10,
        col: 8,
      },
      endCellCoords: {
        row: 10,
        col: 14,
      },
      clickOption: "",
      drawingWalls: false,
      mouseClicked: false,
      changingStart: false,
      changingEnd: false,
      animationSpeed: 14,
      animationInProccess: false,
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
    if (this.state.animationInProccess) return;
    // const { grid } = this.state;
    // for (let i = 0; i < numCol; i++) {
    //   for (let j = 0; j < numRow; j++) {
    //     grid[j][i].isVisited = false;
    //     grid[j][i].isPath = false;
    //     grid[j][i].isWall = false;
    //   }
    // }
    this.setState({
      grid: this.makeGrid(),
      drawingWalls: false,
      mouseClicked: false,
      changingStart: false,
      changingEnd: false,
    });
  };

  //ALGORITHMS
  aStarSolve = async () => {
    if (this.state.animationInProccess) return;
    const { startCellCoords, endCellCoords, grid } = this.state;
    const startCell = grid[startCellCoords.row][startCellCoords.col];
    const endCell = grid[endCellCoords.row][endCellCoords.col];

    for (let i = 0; i < numCol; i++) {
      for (let j = 0; j < numRow; j++) {
        grid[j][i].isVisited = false;
        grid[j][i].isPath = false;
      }
    }
    await this.setState({
      grid: grid,
      animationInProccess: true,
    });

    const visitedCellsInOrder = astar(grid, startCell, endCell);

    const result = this.animate(visitedCellsInOrder);
    result
      .then(async (data) => {
        await this.delay(data[1]);
        return data[0];
      })
      .then((grid) => {
        const newGrid = this.animatePath(grid);
        this.setState({ grid: newGrid, animationInProccess: false });
      });
  };

  dijkstraSolve = async () => {
    if (this.state.animationInProccess) return;
    const { grid, startCellCoords, endCellCoords } = this.state;
    for (let i = 0; i < numCol; i++) {
      for (let j = 0; j < numRow; j++) {
        grid[j][i].isVisited = false;
        grid[j][i].isPath = false;
      }
    }
    await this.setState({
      grid: grid,
      animationInProccess: true,
    });
    const startCell = grid[startCellCoords.row][startCellCoords.col];
    const endCell = grid[endCellCoords.row][endCellCoords.col];

    const visitedCellsInOrder = dijkstra(grid, startCell, endCell);

    const result = this.animate(visitedCellsInOrder);
    result
      .then(async (data) => {
        await this.delay(data[1]);
        return data[0];
      })
      .then((grid) => {
        const newGrid = this.animatePath(grid);
        this.setState({ grid: newGrid, animationInProccess: false });
      });
  };

  //ANIMATIONS
  animate = (visitedCellsInOrder) => {
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
    const { endCellCoords, startCellCoords } = this.state;
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
      grid[row][col].isPath = true;
      document.getElementById(`${row}-${col}`).className = "cell path";
    }
    return grid;
  };
  delay = (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  };

  // INTERACTIONS HANDLERS
  handleAnimationSpeed = (e) => {
    if (this.state.animationInProccess) return;
    switch (e.target.value) {
      case "fast":
        this.setState({ animationSpeed: 7 });
        break;
      case "average":
        this.setState({ animationSpeed: 14 });
        break;
      case "slow":
        this.setState({ animationSpeed: 25 });
        break;
      default:
        break;
    }
  };
  //START / END BUTTON HANDLERS
  changeStartHandler = () => {
    if (this.state.animationInProccess) return;
    this.setState({
      changingStart: true,
      changingEnd: false,
      drawingWalls: false,
    });
  };
  changeEndHandler = () => {
    if (this.state.animationInProccess) return;
    this.setState({
      changingEnd: true,
      changingStart: false,
      drawingWalls: false,
    });
  };
  //DRAW WALLS BUTTON HANDLER
  drawingWalls = () => {
    if (this.state.animationInProccess) return;
    this.setState({
      drawingWalls: true,
      changingStart: false,
      changingEnd: false,
    });
  };

  //CHANGING START/END CELLS
  changeEndCell = (e) => {
    if (this.state.animationInProccess) return;
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
    if (this.state.animationInProccess) return;
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

  //DRAG ON GRID / DRAWING WALLS
  handlePress = (e) => {
    if (this.state.animationInProccess) return;
    const coords = e.target.id.split("-");
    if (coords.length < 2) return;
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
  };
  handleMouseDown = () => {
    if (this.state.animationInProccess) return;
    this.tempGrid = this.state.grid;
    this.setState({
      mouseClicked: true,
    });
  };
  handleMouseUp = () => {
    if (this.state.animationInProccess) return;
    this.setState({
      mouseClicked: false,
      grid: this.tempGrid,
    });
  };

  //window sizing/resizing for responsive layout
  sizing = async () => {
    if (this.state.animationInProccess) return;
    const width = window.innerWidth;
    if (width <= 576) {
      numCol = 15;
    } else if (width > 576 && width <= 1024) {
      numCol = 25;
    } else if (width > 1024 && width < 1200) {
      numCol = 30;
    } else {
      numCol = 50;
    }

    await this.setState({
      startCellCoords: {
        row: 10,
        col: parseInt(numCol / 3),
      },
      endCellCoords: {
        row: 10,
        col: parseInt((numCol / 3) * 2),
      },
    });

    const grid = this.makeGrid();
    this.setState({
      grid: grid,
    });
  };
  reSizing = async () => {
    if (this.state.animationInProccess) return;
    const width = window.innerWidth;
    if (width <= 576) {
      numCol = 15;
    } else if (width > 576 && width <= 1024) {
      numCol = 25;
    } else if (width > 1024 && width < 1200) {
      numCol = 30;
    } else {
      numCol = 50;
    }
    await this.setState({
      startCellCoords: {
        row: 10,
        col: parseInt(numCol / 3),
      },
      endCellCoords: {
        row: 10,
        col: parseInt(numCol / 3) * 2,
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
    const { drawingWalls, mouseClicked } = this.state;
    return (
      <main>
        <section className="menu">
          <Legend />
          <section className="clickable">
            <section className="algorithmsButtons">
              <button onClick={this.dijkstraSolve}>
                <span>Dijkstra</span>
              </button>
              <button onClick={this.aStarSolve}>
                <span>A*</span>
              </button>
            </section>
            <section className="interactions">
              <select
                id="animationSpeed"
                onChange={this.handleAnimationSpeed}
                defaultValue={"Speed"}
              >
                <option hidden disabled value="Speed">
                  Speed
                </option>
                <option value="fast">Fast</option>
                <option value="average">Average</option>
                <option value="slow">Slow</option>
              </select>
              <button onClick={this.resetGrid} className="btn-reset">
                <span>Reset</span>
              </button>
              <button onClick={this.drawingWalls} className="btn-wall">
                <span>Add walls</span>
              </button>
              <button onClick={this.changeStartHandler} className="btn-start">
                <span>Change Start</span>
              </button>
              <button onClick={this.changeEndHandler} className="btn-finish">
                <span>Change End</span>
              </button>
            </section>
          </section>
        </section>
        <section
          className="grid"
          id="grid"
          onMouseMove={drawingWalls && mouseClicked ? this.handlePress : null}
          onMouseDown={drawingWalls ? this.handleMouseDown : null}
          onMouseUp={drawingWalls ? this.handleMouseUp : null}
          onClick={chooseFunction(
            this.state,
            this.changeEndCell,
            this.changeStartCell
          )}
        >
          {grid.map((row, rowId) => {
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
                      handleClick={this.handleClick}
                      handleMousePress={this.handleMousePress}
                      handleMouseUp={this.handleMouseUp}
                    ></Cell>
                  );
                })}
              </div>
            );
          })}
        </section>
        <footer>
          <div className="socials">
            <a href="https://github.com/fizo99">
              <i className="fab fa-github-square"></i>
            </a>
            <a href="https://www.linkedin.com/in/krzysztof-huczek-a1bb36175/">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://www.facebook.com/mvpett">
              <i className="fab fa-facebook-square"></i>
            </a>
          </div>
          <h6>© Krzysztof Huczek, 2020</h6>
        </footer>
      </main>
    );
  }
}

export default Visualiser;

function chooseFunction(state, changeEndFunc, changeStartFunc) {
  if (state.changingStart) return changeStartFunc;
  else if (state.changingEnd) return changeEndFunc;
}

////////////// BIN ////////////////////////////

// generateMaze = () => {
//     const grid = generateMaze();
//     for(let i = 0; i < numRow; i++){
//         for(let j = 0; j < numCol; j++){
//             document.getElementById(`${i}-${j}`).innerHTML = "";
//         }
//     }
//     this.setState({
//         grid:grid,
//     })
//     visitedCells = [];
//     pathFound = false;
// }

// showPath = () => {
//     if(pathFound){
//         const {grid} = this.state;
//         const lastCell = grid[endRow][endCol];
//         let temp = lastCell

//         //shortest path
//         const path = [];
//         while(temp !== null){
//             path.push(temp);
//             temp = temp.previousCell
//         }

//         path.shift();
//         path.pop();
//         for(let i = 0; i < path.length; i++){
//             document.getElementById(`${path[i].row}-${path[i].col}`).className = "cell path";
//         }

//     }
// }

// findPath = () => {
//     const {grid} = this.state;

//     const startCell = grid[startRow][startCol];
//     const endCell = grid[endRow][endCol];
//     visitedCells = dijkstra(grid,startCell,endCell);
//     visitedCells.shift();
//     visitedCells.pop();
//     iter = 0;

//     pathFound = true;

// }

// nextStep = () => {
//     //const {visitedCells} = this.state;
//     if(visitedCells.length === 0) return
//     const cell = visitedCells[iter];
//     const el = document.getElementById(`${cell.row}-${cell.col}`)
//     el.className = "cell visited";
//     el.innerHTML = `<b>${cell.distance}</b>`
//     iter++;
// }

// const copyGrid = (grid) => {
//     const newGrid = makeGrid();

//     for(let i = 0; i < numRow; i++){
//         for(let j = 0; j < numCol; j++){
//             newGrid[i][j].row = grid[i][j].row;
//             newGrid[i][j].col = grid[i][j].col;
//             newGrid[i][j].isStart = grid[i][j].isStart;
//             newGrid[i][j].isFinish = grid[i][j].isFinish;
//             newGrid[i][j].isWall = grid[i][j].isWall;
//             newGrid[i][j].previousCell = grid[i][j].previousCell;
//             newGrid[i][j].distance = grid[i][j].distance;
//             newGrid[i][j].isVisited = grid[i][j].isVisited;
//         }
//     }
//     return newGrid
// }

// generateMaze = () => {
//     const grid = generateMaze();
//     this.setState({
//         grid:grid,
//     })
//     pathFound = false;
// }

// handleClick = (e) => {
//   if (this.state.drawingWalls) return;
//   const coords = e.target.id.split("-");
//   const { grid, startCellCoords, endCellCoords } = this.state;

//   grid[startCellCoords.row][startCellCoords.col].isStart = false;
//   grid[coords[0]][coords[1]].isStart = true;

//   this.setState({
//     grid: grid,
//     startCellCoords: {
//       row: coords[0],
//       col: coords[1],
//     },
//   });
// };
