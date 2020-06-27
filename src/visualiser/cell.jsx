import React from 'react';
import './cell.css';

export default class Cell extends React.Component {
    
    render()
    {
        const {
            col,
            row,
            isFinish,
            isStart,
            isWall,
            isPath,
            isVisited,
        } = this.props;

        let cName = "cell"
        if(isWall)
            cName += " wall"
        else{
            if(isVisited)
                cName += " visited"
            else{
                if(isPath)
                    cName += " path"
                else{
                    if (isFinish)
                        cName += " finish"
                    else if (isStart)
                        cName += " start"
                }
            }
        }   
            
        return (
            <div
                className = {cName}
                id = {`${row}-${col}`}
            ></div>
        );
    }

}