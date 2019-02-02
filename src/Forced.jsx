import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { select } from 'd3-selection';
import { forceSimulation, forceManyBody, forceLink, forceCenter } from 'd3-force';

var width = 600, height = 400;


export default class Forced extends Component {
  constructor(props) {
    super(props);

    this.state = {
      simulation: forceSimulation()
        .force("charge", forceManyBody())
        .force("link", forceLink().id(d => d.id))
        .force("center", forceCenter(width / 2, height / 2)),
    }

    this.updateGraph = this.updateGraph.bind(this);
    this.updateNode = this.updateNode.bind(this);
    this.updateLink = this.updateLink.bind(this);

    this.restart = this.restart.bind(this);
  }

  shouldComponentUpdate(nextProp) {
    this.restart(nextProp.graph);
    return false;
  }

  restart(graph) {
    this.graph = select(ReactDOM.findDOMNode(this.refs.graph));
    this.state.simulation.on('tick', () => {
      this.graph.call(this.updateGraph);
    });

    var nodes = this.graph.selectAll('.node')
      .data(graph.nodes, d => d.id);
    nodes.enter().append('circle')
      .attr('class', 'node')
      .attr("r", 2.5);
    nodes.exit().remove();

    var links = this.graph.selectAll('.link')
      .data(graph.links, d => {
        if (d.source.id && d.target.id) {
          return d.source.id + "-" + d.target.id;
        } else {
          return d.source + "-" + d.target;
        }
      });
    links.exit().remove();
    links.enter().append("line")
      .attr('class', 'link')
      .style('stroke', 'black');

    this.state.simulation.nodes(graph.nodes);
    this.state.simulation.force("link").links(graph.links);
    this.state.simulation.alpha(1).restart();
  }

  updateNode = (selection) => {
    selection.attr("transform", d => `translate(${d.x},${d.y})`);
  }

  updateLink = (selection) => {
    selection
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  }

  updateGraph = (selection) => {
    selection.selectAll('.node')
      .call(this.updateNode);
    selection.selectAll('.link')
      .call(this.updateLink);
  }

  render () {
    return (
      <div className="thumbnail svg-container">
        <svg ref="graph"
          preserveAspectRatio={"xMinYMin meet"}
          viewBox={"0 0 600 400"}
          className="svg-content-responsive">
        </svg>
      </div>
    )
  }
}
