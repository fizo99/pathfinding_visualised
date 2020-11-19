import React from 'react'
import './App.css';
import Grid from "./Grid"
import {dijkstra} from "./dijkstra"
import {STARTX,START,ENDX,END, ROWS,COLS, VISITED} from "./const"

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      grid: [],
      visited: [],
      animate: false,
      algorithm: null
    }
    this.frame = this.frame.bind(this)
  }

  findPath = () => {
    this.setState({animate:true})
  }
  changeAlgo = () => {
    this.setState({algorithm: dijkstra})
    console.log('change')
  }

  // componentDidUpdate() {
  //   if(this.state.animate){
  //     this.start()
  //   }
  // }
  componentDidUpdate(){
    if(this.state.animate) this.start()
  }

  start() {
    const grid = new Array(COLS*ROWS)//[COLS*ROWS];
    grid[STARTX] = START
    grid[ENDX] = END

    const visited = this.state.algorithm(grid)
    //console.log(visited)
    grid[STARTX] = START
    grid[ENDX] = END

    this.setState({
      grid: grid,
      visited: visited,
      animate: false,
    }, () => {
      this.frame();
    })
  }

  frame() {
    const {grid,visited} = this.state;
    if(visited.length === 0) return;
    const nextVisited = visited.shift();
    grid[nextVisited] = VISITED

    this.setState({
      grid
    }, () => {
      setTimeout(this.frame, 1)
    })
  }

  render() {
    return (
      <div className="App">
      <select onChange = {this.changeAlgo} id="algo">
        <option>dijkstra</option>
        <option>astar</option>
      </select>
        <button onClick={this.findPath}></button>
        <Grid grid={this.state.grid}/>
      </div>
    );
  }
}

export default App;
