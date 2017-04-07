import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
         <h1> Hello Electron </h1>
          <li> modifications can be made in the src/app.js file located in the client folder</li>
        </p>
      </div>
    );
  }
}

export default App;
