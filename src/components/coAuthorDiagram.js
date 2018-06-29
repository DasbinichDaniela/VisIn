import React, { Component } from 'react'
import './CoAuthorDiagram.css'
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
   // createCoAuthorDiagram() {
   //   var coAuthorArray = [{"name":"Dirk Burkhardt","count":24},{"name":"Christian Stab","count":11},{"name":"Martin Steiger","count":2}]
   //   debugger;
   //
   //    const node = this.svg
   //    var svg = d3.select(node);
   //    // var svg = d3.select("coAuthorSVG");
   //    svg.selectAll("circle")
   //        .data([32, 57, 112, 293]) // this.props.publications?
   //      .enter().append("circle")
   //        .attr("cy", 60)
   //        .attr("cx", function(d, i) { return i * 100 + 30; })
   //        .attr("r", function(d) { return Math.sqrt(d); });
   // }
   createCoAuthorDiagram() {
     var coAuthorArray = [{"name":"Dirk Burkhardt","count":24},{"name":"Christian Stab","count":11},{"name":"Martin Steiger","count":2}]
     var searchedAuthor = "Kawa Nazemi"

     coAuthorArray.sort(function(a, b){
       return b.count - a.count
     });

     var treeData = {"name": searchedAuthor, "count": 0};
     treeData["coAuthors"] = coAuthorArray

      // Set the dimensions and margins of the diagram
      var margin = {top: 20, right: 90, bottom: 30, left: 90},
          width = 960 - margin.left - margin.right,
          height = coAuthorArray.length*25;
          // height = coAuthorArray.length*25 - margin.top - margin.bottom;
      // append the svg object to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      // debugger;

      const node = this.svg
      var svg = d3.select(node)
          .attr("width", width + margin.right + margin.left)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate("
                + margin.left + "," + margin.top + ")");


      var i = 0,
          duration = 750,
          root;
      // declares a tree layout and assigns the size
      // d3.tree creates a new tree layout with default settings
      var treemap = d3.tree().size([height, width]);
      // Assigns parent, children, height, depth
      root = d3.hierarchy(treeData, function(d) {
        return d.coAuthors;
      });
      // Höhe verschiebt sich sobald ausgewählt
      root.x0 = 0;
      root.y0 = 0;
      // root.x = 0;
      // root.y = 0;

      // Collapse after the second level (after the Children)
      root.children.forEach(collapse);

      update(root);
      // Collapse the node and all it's children
      function collapse(d) {
        if(d.coAuthors) {
          d._coAuthors = d.coAuthors
          d._coAuthors.forEach(collapse)
          d.coAuthors = null
        }
      }
      function update(source) {

        // source = root; name of the main author
        // Assigns the x and y position for the nodes
        var treeData = treemap(root);
        // treemap(root) default tree with root Element
        // Compute the new tree layout.
        var nodes = treeData.descendants(),
        // descendants of all nodes links: wihtout last object
            links = treeData.descendants().slice(1);
        // Normalize for fixed-depth.
        // Wie weit nach rechts zweite/dritte Ebene rückt
        nodes.forEach(function(d){ d.y = d.depth * 180});
        // ****************** Nodes section ***************************
        // Update the nodes... versteh nicht was sich ändern soll
        var node = svg.selectAll('g.node')
            .data(nodes, function(d) {
              return d.id || (d.id = ++i);
            });

        // Enter any new modes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function(d) {
              // get information on position of nodes
              return "translate(" + source.y0 + "," + source.x0 + ")";
          })
          .on('click', click);
        // Add Circle for the nodes - create circles and here change radius
        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 20)
            .style("fill", function(d) {
                return d._coAuthors ? "lightsteelblue" : "steelblue";
            });
        // Add labels for the nodes -> -13 distance to circle
        // searched Author shall be left of Bubble


        function isRootNode(nodeData){
          return nodeData.depth == 0
        }

        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", function(d) {
                if(isRootNode(d)){
                  return -13;
                }
                return d.coAuthors || d._coAuthors ? -13 : 13;
            })
            // if label is at start or end of circle
            .attr("text-anchor", function(d) {
                if(isRootNode(d)){
                  return "end";
                }
                return d.coAuthors || d._coAuthors ? "end" : "start";
            })
            .text(function(d) {
              return d.data.name;
            });
        // UPDATE
        var nodeUpdate = nodeEnter.merge(node);
        // Transition to the proper position for the node
        nodeUpdate.transition()
          .duration(duration)
          .attr("transform", function(d) {
            if(isRootNode(d)){
              d.y = 0;
              d.x = 0;
            }
              return "translate(" + d.y + "," + d.x + ")";
           });
        // Update the node attributes and style
        // Adjust size of Bubbles according to Count of Publications
        var multiplier = 10;
        var countArray = coAuthorArray.map(author => author.count);
        var max = d3.max(countArray);
        var radiusScale = d3.scaleLinear().range([1, multiplier]).domain([0, max])

        nodeUpdate.select('circle.node')
          .attr('r', function(d){ return radiusScale(d.data.count)
            // debugger;
            return d.data.count
          })
          .style("fill", function(d) {
              return d._coAuthors ? "lightsteelblue" : "steelblue";
          })
          .attr('cursor', 'pointer');
        // Remove any exiting nodes - when clicking on the circle to close outgoing lines
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                  return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();
        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
          .attr('r', 1e-6);
        // On exit reduce the opacity of text labels
        nodeExit.select('text')
          .style('fill-opacity', 1e-6);
        // ****************** links section ***************************
        // Update the links...
        var link = svg.selectAll('path.link')
            .data(links, function(d) { return d.id; });
        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function(d){
              var o = {x: source.x0, y: source.y0}
              return diagonal(o, o)
            });
        // UPDATE
        var linkUpdate = linkEnter.merge(link);
        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(duration)
            .attr('d', function(d){
              return diagonal(d, d.parent)
            });
        // Remove any exiting links
        var linkExit = link.exit().transition()
            .duration(duration)
            .attr('d', function(d) {
              var o = {x: source.x, y: source.y}
              return diagonal(o, o)
            })
            .remove();
        // Store the old positions for transition.
        nodes.forEach(function(d){
          d.x0 = d.x;
          d.y0 = d.y;
        });
        // Creates a curved (diagonal) path from parent to the child nodes - depends always from start
        function diagonal(s, d) {
          var path = `M ${s.y} ${s.x}
                  C 105, 0, 35, 0, 0, 0`
          return path
        }
        // Toggle children on click.
        function click(d) {
          if (d.coAuthors) {
              d._coAuthors = d.coAuthors;
              d.coAuthors = null;
            } else {
              d.coAuthors = d._coAuthors;
              d._coAuthors = null;
            }
          update(d);
        }
      }
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
