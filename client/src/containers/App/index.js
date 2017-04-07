import React, { Component } from 'react';

import SearchInput from '../SearchInput';

class App extends Component {
  render() {
    return (
      <div className="App">
        <SearchInput/>
        <div className="App-header">
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
