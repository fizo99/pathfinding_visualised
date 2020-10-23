export const dijkstra = (grid, startCell, finishCell) => {
  //console.log(startCell);
  const visitedCellsInOrder = [];
  startCell.distance = 0;
  const unVisitedCells = getCells(grid);
  while (unVisitedCells.length) {
    unVisitedCells.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance); // min heap better option
    const closestCell = unVisitedCells.shift();
    if (closestCell.distance === Infinity) return visitedCellsInOrder;
    closestCell.isVisited = true;
    visitedCellsInOrder.push(closestCell);
    if (closestCell === finishCell) return visitedCellsInOrder;
    updateUnvisitedNeighbors(closestCell, grid);
  }
};

const updateUnvisitedNeighbors = (cell, grid) => {
  const unvisitedNeighbors = getNeighbors(cell, grid).filter(
    (neighbor) => !neighbor.isVisited
  );
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = cell.distance + 1;
    neighbor.previousCell = cell;
  }
};

const getNeighbors = (cell, grid) => {
  const numCol = grid[0].length;
  const numRow = grid.length;
  const neighbors = [];
  const { col, row } = cell;

  if (col - 1 >= 0) neighbors.push(grid[row][col - 1]); //left
  if (col + 1 < numCol) neighbors.push(grid[row][col + 1]); //right
  if (row + 1 < numRow) neighbors.push(grid[row + 1][col]); //top
  if (row - 1 >= 0) neighbors.push(grid[row - 1][col]); //bottom

  return neighbors;
};

const getCells = (grid) => {
  const listOfCells = [];
  const numCol = grid[0].length;
  const numRow = grid.length;

  for (let i = 0; i < numRow; i++) {
    for (let j = 0; j < numCol; j++) {
      if (grid[i][j].isWall) continue;
      listOfCells.push(grid[i][j]);
    }
  }
  return listOfCells;
};
