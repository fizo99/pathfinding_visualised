import {ROWS,COLS,STARTX,ENDX,WALL,START, END, VISITED} from "./const"

export const dijkstra = (grid) => {
  const visitedCellsInOrder = [];
  const unVisitedCells = copyGrid(grid);
  const distances = getCells(unVisitedCells)
  distances[STARTX].distance = 0;
  //const unVisitedCells = getCells(newGrid);

  while (unVisitedCells.length) {
    distances.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance); // min heap better option
    const closestCell = distances.shift(); //return first element in array (smallest distance)
    if (closestCell.distance === Infinity) return visitedCellsInOrder;
    closestCell.visited = true;
    visitedCellsInOrder.push(closestCell.id);
    if (closestCell.value === END ) {
      return visitedCellsInOrder
      // let lastCell = visitedCellsInOrder[visitedCellsInOrder.length - 1];
      // const path = [];
      // while (lastCell.previousCell != null) {
      //   path.push(lastCell);
      //   lastCell = lastCell.previousCell;
      // }
      
    }
    updateUnvisitedNeighbors(closestCell, unVisitedCells);
  }
};

const updateUnvisitedNeighbors = (cell, grid) => {
  const unvisitedNeighbors = getNeighbors(cell.id, grid, 4)
  //const unvisitedNeighbors = getNeighbors(cell.id, grid, 4)
  //console.log(unvisitedNeighbors)
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = cell.distance + 1;
    neighbor.previous = cell.id;
  }
};

//do przerobienia
const getNeighbors = (id, grid, mode) => {
    const size = ROWS * COLS

    const neighbors = []

    if (id - COLS >= 0)
        neighbors.push(grid[id - COLS])  
    if (id % COLS != 0)
        neighbors.push(grid[id - 1])  

    if ((id + 1) % COLS != 0)
        neighbors.push(grid[id + 1])  

    if (id + COLS < size)
        neighbors.push(grid[id + COLS])  

    console.log([id-COLS,id-1,id+1,id+COLS],id,neighbors)

    // if (mode === 8):
    //     if ((i - w - 1) >= 0) and (i % w != 0)
    //         neighbors.append(i - w - 1) 

    //     if ((i - w + 1) >= 0) and ((i + 1) % w != 0)
    //         neighbors.append(i - w + 1)  

    //     if ((i + w - 1) < size) and (i % w != 0)
    //         neighbors.append(i + w - 1)  

    //     if ((i + w + 1) < size) and ((i + 1) % w != 0)
    //         neighbors.append(i + w + 1) 
    return neighbors.filter(neighbor => !neighbor.visited)
};

const getCells = (grid) => {
  const listOfCells = [];
  for (let i = 0; i < grid.length; i++) {
      if (grid[i].value == WALL) continue;
      listOfCells.push(grid[i]);
  }
  return listOfCells;
};

//deep copy
const copyGrid = (grid) => {
  const newGrid = [];
  for (let i = 0; i < grid.length; i++) {
    //if(grid[i] === WALL) continue;
    newGrid.push({
      id: i,
      value: grid[i],
      previous: null,
      distance: Infinity,
      visited: false,
    })
  }
  return newGrid;
};
