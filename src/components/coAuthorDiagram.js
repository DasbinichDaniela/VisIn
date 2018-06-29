import React, { Component } from 'react'
// import './App.css'
// import { scaleLinear } from 'd3-scale'
// import { max } from 'd3-array'
// import { select } from 'd3-selection'

import * as d3 from "d3"

class CoAuthorDiagram extends Component {
   constructor(props){
      super(props)
      this.createCoAuthorDiagram = this.createCoAuthorDiagram.bind(this)
   }
   componentDidMount() {
      this.createCoAuthorDiagram()
   }
   componentDidUpdate() {
      this.createCoAuthorDiagram()
   }
   createCoAuthorDiagram() {
      const node = this.svg
      var svg = d3.select(node);
      // var svg = d3.select("coAuthorSVG");
      svg.selectAll("circle")
          .data([32, 57, 112, 293]) // this.props.publications?
        .enter().append("circle")
          .attr("cy", 60)
          .attr("cx", function(d, i) { return i * 100 + 30; })
          .attr("r", function(d) { return Math.sqrt(d); });
   }
render() {
      return (
        <div>
          <svg ref={node => this.svg = node}
                    width={500} height={500}>
          </svg>
          <div ref={node => this.chart = node}></div>
          <div ref={node => this.xAxis = node}></div>
        </div>
      )
   }
}
export default CoAuthorDiagram
