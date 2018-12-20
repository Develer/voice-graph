import React, { Component } from 'react';

import Header from './Header';
import Footer from './Footer';
import Recognizer from './Recognizer';
import D3Test from './D3Test';


export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }

    this.fetchText = this.fetchText.bind(this);
  }

  fetchText(text) {
    this.setState({text});
  }

  render() {
    return (
      <div className="container">
        <Header />
        <Recognizer fetchText={this.fetchText} />
        <D3Test text={this.state.text} />
        <Footer />
      </div>
    )
  }
}
