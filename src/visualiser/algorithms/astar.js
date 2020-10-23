export const astar = (grid, startCell, finishCell) => {
  const openSet = [];
  const closedSet = [];
  openSet.push(grid[startCell.row][startCell.col]);
  const visitedInOrder = [];

  while (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }

    if (openSet[lowestIndex] === finishCell) {
      //return path(finishCell);
      return visitedInOrder;
    }

    const current = openSet[lowestIndex];
    visitedInOrder.push(current);

    removeFromArray(openSet, current); //spllice(lowestIndex,1) ??
    closedSet.push(current);
    //grid[current.row][current.col].isVisited = true;

    const neighbors = getNeighbors(current, grid);
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (neighbor.isWall) {
        closedSet.push(neighbor);
        continue;
      }
      visitedInOrder.push(neighbor);
      if (!closedSet.includes(neighbor)) {
        //grid[neighbor.row][neighbor.col].g = grid[current.row][current.col].g + 1
        let tempG = grid[current.row][current.col].g + 1;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
        }

        neighbor.h = heuristic(neighbor, finishCell);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previousCell = current;
      }
    }
  }
  return visitedInOrder;
  //return grid;
  // const path = [];
  // let end = finishCell
  // while(end.previousCell !== startCell){
  //     path.push(end)
  //     end = end.previousCell
  // }
  // return path;
};

// const path = (endCell) => {
//     const path = [];
//     while(endCell.previousCell != null){
//         path.push(endCell)
//         endCell = endCell.previousCell;
//     }
//     return path;
// }

const heuristic = (a, b) => {
  if (a.row === b.row) return Math.abs(a.col - b.col);
  if (a.col === b.col) return Math.abs(a.row - b.row);
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  //pythagoras a^2 + b^2 = c^2
  //return Math.sqrt(Math.abs(a.col-b.col)+Math.abs(a.row-b.row))
};

const removeFromArray = (arr, element) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === element) {
      arr.splice(i, 1);
    }
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
