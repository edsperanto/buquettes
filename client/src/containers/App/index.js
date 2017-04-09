import React, { Component } from 'react';

import SearchInput from '../SearchInput';
import Login from '../../components/login.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <SearchInput/>
        <div className="App-header">
          <h2>Search </h2>
        </div>

        <Login/>

      </div>
    );
  }
}

export default App;
