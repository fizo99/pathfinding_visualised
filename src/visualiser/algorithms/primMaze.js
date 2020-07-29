const generateMaze = () => {
  const grid = makeGrid();
  for (let i = 0; i < numRow; i++) {
    for (let j = 0; j < numCol; j++) {
      grid[i][j].isWall = true;
      grid[i][j].isVisited = false;
      grid[i][j].isPath = false;
    }
  }

  const startCell = grid[startRow][startCol];

  const trace = [];
  trace.push(startCell);

  const walls = getFrontiers(startCell, grid);

  while (walls.length > 0) {
    const randWallId = randomInt(0, walls.length - 1);
    const randWall = walls.splice(randWallId, 1)[0];

    const neighbors = getFrontiers(randWall, grid).filter((neighbor) =>
      trace.includes(neighbor)
    );
    if (neighbors.length > 0) {
      const randNeighbor = neighbors[randomInt(0, neighbors.length - 1)];
      const chosenCell = getCellBetween(randNeighbor, randWall, grid);
      trace.push(chosenCell);
      trace.push(randWall);
      chosenCell.isWall = false;
      randWall.isWall = false;
    }
    const newFrontiers = getFrontiers(randWall, grid).filter(
      (wall) => wall.isWall
    );
    for (let i = 0; i < newFrontiers.length; i++) {
      if (!walls.includes(newFrontiers[i])) {
        walls.push(newFrontiers[i]);
      }
    }
  }

  for (let i = 0; i < trace.length; i++) {
    const row = trace[i].row;
    const col = trace[i].col;
    if (row === startRow && col === startCol) {
      document.getElementById(`${row}-${col}`).className = "cell start";
      continue;
    }

    if (row === endRow && col === endCol) {
      document.getElementById(`${row}-${col}`).className = "cell finish";
      continue;
    }
    grid[row][col].isWall = false;
    document.getElementById(`${row}-${col}`).className = "cell";
  }

  for (let i = 0; i < numCol; i++) {
    grid[0][i].isWall = true;
    const row = grid[0][i].row;
    const col = grid[0][i].col;
    document.getElementById(`${row}-${col}`).className = "cell wall";
  }
  for (let i = 0; i < numRow; i++) {
    grid[i][0].isWall = true;
    const row = grid[i][0].row;
    const col = grid[i][0].col;
    document.getElementById(`${row}-${col}`).className = "cell wall";
  }
  return grid;
};

const getCellBetween = (cellOne, cellTwo, grid) => {
  const rowOne = cellOne.row;
  const colOne = cellOne.col;
  const rowTwo = cellTwo.row;
  const colTwo = cellTwo.col;
  if (rowOne === rowTwo) return grid[rowOne][max(colOne, colTwo) - 1];
  else if (colOne === colTwo) return grid[max(rowOne, rowTwo) - 1][colOne];
};

function max(a, b) {
  if (a >= b) return a;
  else return b;
}

const getFrontiers = (cell, grid) => {
  const frontiers = [];
  const col = cell.col;
  const row = cell.row;

  if (col - 2 >= 0) frontiers.push(grid[row][col - 2]); //left
  if (col + 2 < numCol) frontiers.push(grid[row][col + 2]); //right
  if (row + 2 < numRow) frontiers.push(grid[row + 2][col]); //top
  if (row - 2 >= 0) frontiers.push(grid[row - 2][col]); //bottom

  return frontiers;
};

function randomInt(min, max) {
  return min + Math.floor((max - min) * Math.random());
}
