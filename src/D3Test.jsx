import React, { Component } from 'react';

import { select } from 'd3-selection';
import { transition } from 'd3-transition';


export default class D3Test extends Component {
  constructor(props) {
    super(props);

    this.state = {
      svg: null,
      g: null,
      // var svg = d3.select("svg"),
      // width = +svg.attr("width"),
      // height = +svg.attr("height"),
      // g = svg.append("g").attr("transform", "translate(32," + (400 / 2) + ")");
    }

    this.update = this.update.bind(this);
  }

  componentDidMount() {
    // const node = this.node;
    let svg = select(this.node);
    let g = svg.append("g").attr("transform", "translate(32," + (400 / 2) + ")");
    this.setState({svg, g});
    console.log('D3Test did mount');
    console.log('===============');
  }

  componentDidUpdate() {
    if (this.props.text.length !== 0) {
      this.update(this.props.text);
    }
    console.log('D3Test did update');
    console.log('===============');
  }

  static getDerivedStateFromProps(props, state) {
    console.log('D3Test getDerivedStateFromProps');
    return null;
  }

  update(data) {
    let t = transition()
        .duration(750);

    // JOIN new data with old elements.
    let text = this.state.g.selectAll("text")
      .data(data, function(d) { return d; });

    // EXIT old elements not present in new data.
    text.exit()
        .attr("class", "exit")
      .transition(t)
        .attr("y", 60)
        .style("fill-opacity", 1e-6)
        .remove();

    // UPDATE old elements present in new data.
    text.attr("class", "update")
        .attr("y", 0)
        .style("fill-opacity", 1)
      .transition(t)
        .attr("x", function(d, i) { return i * 32; });

    // ENTER new elements present in new data.
    text.enter().append("text")
        .attr("class", "enter")
        .attr("dy", ".35em")
        .attr("y", -60)
        .attr("x", function(d, i) { return i * 32; })
        .style("fill-opacity", 1e-6)
        .text(function(d) { return d; })
      .transition(t)
        .attr("y", 0)
        .style("fill-opacity", 1);
  }

  render () {
    console.log('D3Test render');
    return (
      <svg ref={node => this.node = node}
        preserveAspectRatio={"xMinYMin meet"}
        viewBox={"0 0 600 400"}
        className="svg-content-responsive">
      </svg>
    )
  }
}
