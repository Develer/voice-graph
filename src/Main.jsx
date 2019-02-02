import React, { Component } from 'react';

import axios from 'axios';

import Header from './Header';
import Footer from './Footer';
import Recognizer from './Recognizer';
import Forced from './Forced';


export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      graph: { nodes: [], links: [] },
      intervalId: null,
    }

    this.fetchText = this.fetchText.bind(this);
    this.refreshGraph = this.refreshGraph.bind(this)
  }

  componentDidMount() {
     var intervalId = setInterval(this.refreshGraph, 3000);
     this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
     clearInterval(this.state.intervalId);
  }

  async refreshGraph() {
    const url = `http://${
      process.env.REACT_APP_API_SERVER_HOST
    }:${
      process.env.REACT_APP_API_SERVER_PORT
    }`;
    const data = (await axios.get(url)).data;

    let graph = { nodes: [], links: [] };

    process_data(data, null);

    function process_data(d, parent) {
      graph.nodes.push({ id: d.id, text: d.text });
      if (parent !== null) {
        graph.links.push({ "source": d.id, "target": parent });
      }
      if (d.nodes !== null && d.nodes.length > 0) {
        d.nodes.forEach(node => { process_data(node, d.id) });
      }
    }

    this.setState({ graph });
  }

  fetchText(text) {
    this.setState({text});
  }

  render() {
    return (
      <div className="container">
        <Header />
        <Recognizer fetchText={this.fetchText} />
        <Forced graph={this.state.graph}/>
        <Footer />
      </div>
    )
  }
}
