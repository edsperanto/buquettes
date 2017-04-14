import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';


import reducers from './reducers';
import { App } from './containers/App';
import { Login } from './sandLab/basicExample.js';
import SearchContainer from './containers/SearchContainer';

import './index.css';

let store = createStore(
  reducers
);

ReactDOM.render(

<div className= "App">

  <Provider store={store}>
    <Router>
      <div>
      <ul>
        <li><Link to ='/'> Home</Link></li>
        <li><Link to ='/login'> Login</Link></li>
        <li><Link to ='/search'>Search</Link></li>
      </ul>
          <Route exact path ='/' component={App} />
          <Route path ="/search" component={SearchContainer} />
      </div>
    </Router>
  </Provider>
</div>,
  document.getElementById('root')
);
