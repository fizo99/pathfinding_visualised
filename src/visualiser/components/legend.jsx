import React from "react";

export default class Legend extends React.Component {
  render() {
    return (
      <section className="legend">
        <div className="legendPosition">
          <div className="legendCell pathLegend"></div>
          <span>Path</span>
        </div>
        <div className="legendPosition">
          <div className="legendCell wallLegend"></div>
          <span>Wall</span>
        </div>
        <div className="legendPosition">
          <div className="legendCell visitedLegend"></div>
          <span>Visited</span>
        </div>
        <div className="legendPosition">
          <div className="legendCell startLegend"></div>
          <span>Start</span>
        </div>
        <div className="legendPosition">
          <div className="legendCell finishLegend"></div>
          <span>Finish</span>
        </div>
      </section>
    );
  }
}
