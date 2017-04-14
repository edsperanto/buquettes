import React, { Component } from 'react';

import{ BrowserRouter as Router, Route, link} from 'react-router-dom';
import Login from '../../components/login.js';
import Example from '../../sandLab/basicExample.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Search </h2>
        </div>

        <Login/>

        <Example/>

      </div>
    );
  }
}

export default App;
