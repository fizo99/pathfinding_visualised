import { ROWS, COLS, CELL, START, END, VISITED } from './const';
import "./grid.css"
function Grid({grid}) {
    const cells = [];
    for(let row = 0; row < ROWS; row++){
        for(let col = 0; col < COLS; col++){
            const value = grid[COLS * row + col]
            const className = value === START ? 
            'cell start-cell' : value === END ?
            'cell end-cell' : value === VISITED ?
            'cell visited-cell' : 'cell'
            cells.push(<div className={className}></div>)
        }
    }
  return (
    <div style={{width: COLS * CELL, height: ROWS * CELL }} className="grid">
      {cells}
    </div>
  );
}

export default Grid;
