import React from 'react';
import './legend.css';

export default class Legend extends React.Component {
    
    render()
    {  
            
        return (
            <div
                className = "legend"
            >
                <ul>
                    <li>
                        <div className="legendCell path"></div>
                        <h6>Path</h6>
                    </li>
                    <li>
                        <div className="legendCell wall"></div>
                        <h6>Wall</h6>
                    </li>
                    <li>
                        <div className="legendCell visited"></div>
                        <h6>Visited</h6>
                    </li>
                    <li>
                        <div className="legendCell start"></div>
                        <h6>Start</h6>
                    </li>
                    <li>
                        <div className="legendCell finish"></div>
                        <h6>Finish</h6>
                    </li>
                </ul>
            </div>
        );
    }

}