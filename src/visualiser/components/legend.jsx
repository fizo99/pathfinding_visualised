import React from "react";

export default class Legend extends React.Component {
  render() {
    return (
      <section className="legend">
        <div className="legendCell pathLegend">
          <span>Path</span>
        </div>

        <div className="legendCell wallLegend">
          <span>Wall</span>
        </div>

        <div className="legendCell visitedLegend">
          <span>Visited</span>
        </div>

        <div className="legendCell startLegend">
          <span>Start</span>
        </div>

        <div className="legendCell finishLegend">
          <span>Finish</span>
        </div>
      </section>
    );
  }
}
