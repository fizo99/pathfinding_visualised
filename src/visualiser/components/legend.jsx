import React from "react";
import "./styles/legend.css";

export default class Legend extends React.Component {
  render() {
    return (
      <>
        <section className="legend">
          <div className="legendCell pathLegend">
            <strong>Path</strong>
          </div>
          <div className="legendCell wallLegend">
            <strong>Wall</strong>
          </div>
          <div className="legendCell currentlyLegend">
            <strong>Current</strong>
          </div>

          <div className="legendCell visitedLegend">
            <strong>Visited</strong>
          </div>

          <div className="legendCell startLegend">
            <strong>Start</strong>
          </div>

          <div className="legendCell finishLegend">
            <strong>Finish</strong>
          </div>
        </section>
      </>
    );
  }
}
