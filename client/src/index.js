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
import {App} from './containers/App';
import {Login} from './sandLab/basicExample.js';
import './index.css';

let store = createStore(
  reducers
);

ReactDOM.render(

<div className= "App">

  <Router>
    <div>
      <li><Link to ='/'> Home</Link></li>
        <li><Link to ='/Login'> Login</Link></li>
        <Route exact path ='/' component={App}/>
    </div>
  </Router>

  <Provider store={store}>
        <App />
  </Provider>
</div>,
  document.getElementById('root')
);
