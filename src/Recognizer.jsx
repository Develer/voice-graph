import React, { Component } from 'react';

import { shuffle } from 'd3-array';

var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");


export default class Recognizer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recognition: null,
      recognizing: false,
      transcript: '',
    }

    this.startButton = this.startButton.bind(this);
    this.recognitionOnStart = this.recognitionOnStart.bind(this);
    this.recognitionOnError = this.recognitionOnError.bind(this);
    this.recognitionOnEnd = this.recognitionOnEnd.bind(this);
    this.recognitionOnResult = this.recognitionOnResult.bind(this);

    this.testButton = this.testButton.bind(this);
  }

  componentDidMount() {
    let recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = this.recognitionOnStart;
    recognition.onerror = this.recognitionOnError;
    recognition.onend = this.recognitionOnEnd;
    recognition.onresult = this.recognitionOnResult;
    recognition.lang = 'en-US';

    this.setState({ recognition });
  }

  recognitionOnStart() {
    console.log('recognitionOnStart');
    this.setState({ recognizing: true });
  };

  recognitionOnError(event) {
    console.log('recognitionOnError');
    // if (event.error == 'no-speech') {
    //   start_img.src = 'mic.gif';
    //   showInfo('info_no_speech');
    //   ignore_onend = true;
    // }
    // if (event.error == 'audio-capture') {
    //   start_img.src = 'mic.gif';
    //   showInfo('info_no_microphone');
    //   ignore_onend = true;
    // }
    // if (event.error == 'not-allowed') {
    //   if (event.timeStamp - start_timestamp < 100) {
    //     showInfo('info_blocked');
    //   } else {
    //     showInfo('info_denied');
    //   }
    //   ignore_onend = true;
    // }
  };

  recognitionOnEnd() {
    this.setState({ recognizing: false });
  };

  recognitionOnResult(event) {
    let final_transcript = '';
    // let interim_transcript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        // interim_transcript += event.results[i][0].transcript;
      }
    }

    console.log(final_transcript);

    let transcript = this.state.transcript + final_transcript;

    this.setState({ transcript });
  };

  startButton(event) {
    if (this.state.recognizing) {
      this.state.recognition.stop();
      return;
    }
    this.state.recognition.start();
  }

  testButton(event) {
    let text = shuffle(alphabet)
      .slice(0, Math.floor(Math.random() * 26))
      .sort();
    this.props.fetchText(text);
  }

  onTranscriptChange = (event) => this.setState({ transcript: event.target.value });

  render () {
    return (
      <div className="row">
        <div className="py-4 col-12 text-center">
          <button type="button" className={`btn ${this.state.recognizing ? 'btn-danger' : 'btn-primary'}`} onClick={this.startButton}>
            <i className={`fa fa-microphone ${this.state.recognizing ? 'faa-pulse animated' : ''}`}></i>
          </button>
          <button type="button" className="btn btn-primary" onClick={this.testButton}>Test</button>
        </div>
        <div className="py-4 col-12 text-center">
          <div className="form-group">
            <textarea className="form-control" rows="5"
              value={this.state.transcript}
              onChange={this.onTranscriptChange.bind(this)} />
          </div>
        </div>
      </div>
    )
  }
}
