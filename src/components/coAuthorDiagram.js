import React, { Component } from 'react'
import './CoAuthorDiagram.css'
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
      // this.createCoAuthorDiagram()
   }
   createCoAuthorDiagram() {
     var coAuthorArray = this.props.coAuthorArray
     var searchedAuthor = this.props.searchedAuthor

     coAuthorArray.sort(function(a, b){
       return b.count - a.count
     });

     var treeData = {"name": searchedAuthor, "count": 0};
     treeData["coAuthors"] = coAuthorArray

      // Set the dimensions and margins of the diagram
      var margin = {top: 20, right: 90, bottom: 30, left: 90},
          width = 500,
          height = coAuthorArray.length*25;

      const node = this.svg
      var svg = d3.select(node)
          .attr("width", width)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate("
                + margin.left + "," + margin.top + ")");


      var i = 0,
          duration = 750,
          root;

      // d3.tree creates a new tree layout with default settings
      var treemap = d3.tree().size([height, width]);
      // Assigns parent, children, height, depth
      root = d3.hierarchy(treeData, function(d) {
        return d.coAuthors;
      });

      root.x0 = 0;
      root.y0 = 0;

      update(root);

      function update(source) {
        // Assigns the x and y position for the nodes
        var treeData = treemap(root);
        // Compute the new tree layout.
        var nodes = treeData.descendants(),
        // descendants of all nodes links: without last object
            links = treeData.descendants().slice(1);
        nodes.forEach(function(d){ d.y = d.depth * 180});

        // ****************** Nodes section ***************************

        var node = svg.selectAll('g.node')
            .data(nodes, function(d) {
              return d.id || (d.id = ++i);
            })


            // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function(d) {
              // information about position
              return "translate(" + source.y0 + "," + source.x0 + ")";
            })

        // Add Circles
        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 20)

        function isRootNode(nodeData){
          return nodeData.depth == 0
        }

        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", function(d) {
                if(isRootNode(d)){
                  return -13;
                }
                return 13;
            })
            .attr("text-anchor", function(d) {
                if(isRootNode(d)){
                  return "end";
                }
                return "start";
            })
            .text(function(d) {
              return d.data.name;
            });

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

        // var div = d3.select('circle.node').append("div")
        //   .attr("class", "tooltip")
        //   .style("opacity", 1e-6);

        nodeUpdate.select('circle.node')
          .attr('r', function(d){
            return radiusScale(d.data.count)
            return d.data.count
          })

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
      }
   }
render() {
      return (
        <div className="coAuthorDiagram">
          <svg ref={node => this.svg = node}>
          </svg>
        </div>
      )
   }
}
export default CoAuthorDiagram
