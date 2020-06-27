import React from 'react';
import './visualiser.css';
import Cell from './cell'

const numRow = 20;
const numCol = 50;
let pathFound = false;

let startRow = 10
let startCol = 10
let endRow = 10
let endCol = 40



class Visualiser extends React.Component {
    constructor() {
        super();
        this.state = {
          grid: [],
        };
    }

    generateMaze = () => {
        const grid = generateMaze();
        this.setState({
            grid:grid,
        })
        pathFound = false;
    }

    findPath = () => {
        const {grid} = this.state;
        if(pathFound){
            return
        }
        const startCell = grid[startRow][startCol];
        const endCell = grid[endRow][endCol]

        const visitedCellsInOrder = dijkstra(grid,startCell,endCell);
        this.animateDijkstra(visitedCellsInOrder)
        pathFound = true;
    }

    //DIJKSTRA ANIMATIONS
    animateDijkstra = (visitedCellsInOrder) => {
        const {grid} = this.state;

        for(let i = 0; i < visitedCellsInOrder.length; i++){
            if (i === visitedCellsInOrder.length-1) {
                setTimeout(() => {
                  this.animatePath();
                }, 10 * i);
                return;
            }
            const row = visitedCellsInOrder[i].row;
            const col = visitedCellsInOrder[i].col;
            if((row === startRow && col === startCol) || (row === endRow && col === endCol))
                continue
            setTimeout(() => {
                grid[row][col].isVisited = true;
                document.getElementById(`${row}-${col}`).className = 'cell visited'
            },10*i)
        }

    }
    animatePath = () => {
        const {grid} = this.state;
        const lastCell = grid[endRow][endCol];
        let temp = lastCell

        //shortest path
        const path = [];
        while(temp !== null){
            path.push(temp);
            temp = temp.previousCell
        }

        for(let i = 0; i < path.length; i++){
            let row = path[i].row;
            let col = path[i].col;
            if ((row === startRow && col === startCol) || (row === endRow && col === endCol))
                continue;
            setTimeout(() => {
                grid[row][col].isPath = true;
                document.getElementById(`${row}-${col}`).className = "cell path";
            }, 10 * i);
        }
    }

    componentDidMount() {
        const grid = makeGrid()
        this.setState({
            grid: grid
        })
    }


    render(){
        const grid = this.state.grid;
        return (
            <main>
                <h1>Dijkstra algorithm visualisation</h1>
                <div className="menu">
                    <button onClick={this.findPath}>Find Path</button>
                    <button onClick={this.generateMaze}>Generate Maze</button>
                    {/* <button onClick={this.reset}>Reset</button> */}
                </div>
                <div className="grid" id="grid">
                    {grid.map((row,rowId) => {
                        return (
                            <div key={rowId} className = "row">
                                {row.map((cell,cellId) => {
                                    const {row,col,isStart,isFinish,isWall,isVisited,isPath} = cell
                                    return (
                                        <Cell
                                            key={cellId}
                                            row={row}
                                            col={col}
                                            isStart={isStart}
                                            isFinish={isFinish}
                                            isWall={isWall}
                                            isVisited = {isVisited}
                                            isPath = {isPath}
                                        ></Cell>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </main>
        );
    }

}




// ********************* //
//      DIJKSTRA         //
// ********************* //

const dijkstra = (grid,startCell,finishCell) => {
    const visitedCellsInOrder = [];
    startCell.distance = 0;
    const unVisitedCells = getCells(grid);
    while(unVisitedCells.length){
        unVisitedCells.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance); // min heap better option
        const closestCell = unVisitedCells.shift();
        if(closestCell.isWall) continue;
        if(closestCell.distance === Infinity) return visitedCellsInOrder
        closestCell.isVisited = true;
        visitedCellsInOrder.push(closestCell);
        if(closestCell === finishCell) return visitedCellsInOrder
        updateUnvisitedNeighbors(closestCell, grid);
    }
}

const updateUnvisitedNeighbors = (cell, grid) => {
    const unvisitedNeighbors = getNeighbors(cell, grid).filter(neighbor => !neighbor.isVisited);
    for (const neighbor of unvisitedNeighbors) {
      neighbor.distance = cell.distance + 1;
      neighbor.previousCell = cell;
    }
}

const getNeighbors = (cell, grid) => {
    const neighbors = [];
    const {col,row} = cell;

    if(col - 1 >= 0)     neighbors.push(grid[row][col-1])     //left
    if(col + 1 < numCol) neighbors.push(grid[row][col+1])     //right
    if(row + 1 < numRow) neighbors.push(grid[row+1][col])     //top
    if(row - 1 >= 0)     neighbors.push(grid[row-1][col])     //bottom

    return neighbors;
}

const getCells = (grid) => {
    const listOfCells = [];
    for(let i = 0; i < numRow; i++){
        for(let j = 0; j < numCol; j++){
            listOfCells.push(grid[i][j]);
        }
    }
    return listOfCells;
}


// ********************* //
//      PRIM MAZE        //
// ********************* //
const generateMaze = () => {
    const grid = makeGrid();
    for(let i = 0; i < numRow; i++){
        for(let j = 0; j < numCol; j++){
            grid[i][j].isWall = true;
            grid[i][j].isVisited = false;
            grid[i][j].isPath = false;
        }
    }

    const startCell = grid[startRow][startCol];

    const trace = [];
    trace.push(startCell)

    const walls = getFrontiers(startCell,grid)

    while(walls.length > 0){
        const randWallId = randomInt(0,walls.length-1);
        const randWall = walls.splice(randWallId,1)[0];

        const neighbors = getFrontiers(randWall,grid).filter(neighbor => trace.includes(neighbor));
        if(neighbors.length > 0){
            const randNeighbor = neighbors[randomInt(0,neighbors.length-1)];
            const chosenCell = getCellBetween(randNeighbor,randWall,grid);
            trace.push(chosenCell);
            trace.push(randWall);
            chosenCell.isWall = false;
            randWall.isWall = false;
        }
        const newFrontiers = getFrontiers(randWall,grid).filter(wall => wall.isWall);
        for(let i = 0; i < newFrontiers.length; i++){
            if(!walls.includes(newFrontiers[i])){
                walls.push(newFrontiers[i])
            }
        }
    }


    for(let i = 0; i < trace.length; i++){
        const row = trace[i].row;
        const col = trace[i].col;
        if (row === startRow && col === startCol){
            document.getElementById(`${row}-${col}`).className = "cell start"
            continue
        }
            
        if(row === endRow && col === endCol){
            document.getElementById(`${row}-${col}`).className = "cell finish"
            continue
        }
        grid[row][col].isWall = false;
        document.getElementById(`${row}-${col}`).className = "cell"
    }

    for(let i = 0; i < numCol; i++){
        grid[0][i].isWall = true;
        const row = grid[0][i].row;
        const col = grid[0][i].col;
        document.getElementById(`${row}-${col}`).className = "cell wall"
    }
    for(let i = 0; i < numRow; i++){
        grid[i][0].isWall = true;
        const row = grid[i][0].row;
        const col = grid[i][0].col;
        document.getElementById(`${row}-${col}`).className = "cell wall"
    }
    return grid;

}

const getCellBetween = (cellOne, cellTwo, grid) => {
    const rowOne = cellOne.row
    const colOne = cellOne.col
    const rowTwo = cellTwo.row
    const colTwo = cellTwo.col
    if(rowOne === rowTwo)
        return grid[rowOne][max(colOne,colTwo)-1]
    else if (colOne === colTwo)
        return grid[max(rowOne,rowTwo)-1][colOne]
}

function max(a,b){
    if(a >= b) return a;
    else return b;
}

const getFrontiers = (cell, grid) => {
    const frontiers = [];
    const col = cell.col;
    const row = cell.row;

    if(col - 2 >= 0) frontiers.push(grid[row][col-2])        //left
    if(col + 2 < numCol) frontiers.push(grid[row][col+2])    //right
    if(row + 2 < numRow) frontiers.push(grid[row+2][col])    //top
    if(row - 2 >= 0) frontiers.push(grid[row-2][col])        //bottom

    return frontiers;

}

function randomInt(min, max) {
	return min + Math.floor((max - min) * Math.random());
}

// GRID //

const makeGrid = () => {
    const grid = [];
    for(let i = 0; i < numRow; i++){
        const curCol = []
        for(let j = 0; j < numCol; j++){
            curCol.push(makeCell(i,j))
        }
        grid.push(curCol)
    }
    return grid;
}

const makeCell = (row,col) => {
    return {
        row: row,
        col: col,
        isStart: row === startRow && col === startCol,
        isFinish: row === endRow && col === endCol,
        isWall: false,
        previousCell: null,
        distance: Infinity,
        isVisited: false,
        isPath: false,
    }
}

const copyGrid = (grid) => {
    const newGrid = makeGrid();

    for(let i = 0; i < numRow; i++){
        for(let j = 0; j < numCol; j++){
            newGrid[i][j].row = grid[i][j].row;
            newGrid[i][j].col = grid[i][j].col;
            newGrid[i][j].isStart = grid[i][j].isStart;
            newGrid[i][j].isFinish = grid[i][j].isFinish;
            newGrid[i][j].isWall = grid[i][j].isWall;
            newGrid[i][j].previousCell = grid[i][j].previousCell;
            newGrid[i][j].distance = grid[i][j].distance;
            newGrid[i][j].isVisited = grid[i][j].isVisited;
        }
    }
    return newGrid
}


export default Visualiser;
