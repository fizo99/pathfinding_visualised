// http://www.migapro.com/depth-first-search/

export default function DFSmaze(
  startCellCoords,
  endCellCoords,
  numRow,
  numCol,
  grid
) {
  for (let i = 0; i < numRow; i++) {
    for (let j = 0; j < numCol; j++) {
      if (
        (i === startCellCoords.row && j === startCellCoords.col) ||
        (i === endCellCoords.row && j === endCellCoords.col)
      )
        continue;
      grid[i][j].isWall = true;
      grid[i][j].isVisited = false;
      grid[i][j].isPath = false;
    }
  }

  let c = randomInt(0, numCol - 1);
  while (c % 2 === 0) c = randomInt(0, numCol - 1);

  let r = randomInt(0, numRow - 1);
  while (r % 2 === 0) r = randomInt(0, numRow - 1);

  const order = [];
  grid[r][c].isWall = false;
  order.push(grid[r][c]);

  recursion(r, c, grid, order, numRow, numCol);
  return order;
}

const recursion = (r, c, grid, order, numRow, numCol) => {
  const randDirs = generateRandomDirections();
  // Examine each direction
  for (let i = 0; i < randDirs.length; i++) {
    // eslint-disable-next-line default-case
    switch (randDirs[i]) {
      case 1: // Up
        //　Whether 2 cells up is out or not
        if (r - 2 <= 0) continue;
        if (grid[r - 2][c].isWall) {
          grid[r - 2][c].isWall = false;
          grid[r - 1][c].isWall = false;
          order.push(grid[r - 2][c]);
          order.push(grid[r - 1][c]);
          recursion(r - 2, c, grid, order, numRow, numCol);
        }
        break;
      case 2: // Right
        // Whether 2 cells to the right is out or not
        if (c + 2 >= numCol - 1) continue;
        if (grid[r][c + 2].isWall) {
          grid[r][c + 2].isWall = false;
          grid[r][c + 1].isWall = false;
          order.push(grid[r][c + 2]);
          order.push(grid[r][c + 1]);
          recursion(r, c + 2, grid, order, numRow, numCol);
        }
        break;
      case 3: // Down
        // Whether 2 cells down is out or not
        if (r + 2 >= numRow - 1) continue;
        if (grid[r + 2][c].isWall) {
          grid[r + 2][c].isWall = false;
          grid[r + 1][c].isWall = false;
          order.push(grid[r + 2][c]);
          order.push(grid[r + 1][c]);
          recursion(r + 2, c, grid, order, numRow, numCol);
        }
        break;
      case 4: // Left
        // Whether 2 cells to the left is out or not
        if (c - 2 <= 0) continue;
        if (grid[r][c - 2].isWall) {
          grid[r][c - 2].isWall = false;
          grid[r][c - 1].isWall = false;
          order.push(grid[r][c - 2]);
          order.push(grid[r][c - 1]);
          recursion(r, c - 2, grid, order, numRow, numCol);
        }
        break;
    }
  }
};

const generateRandomDirections = () => {
  const dirs = [];
  for (let i = 0; i < 4; i++) dirs.push(i + 1);
  return shuffle(dirs);
};

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
