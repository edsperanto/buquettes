import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/app';
import './index.css';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import users from './reducers';

let store = createStore(users);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
  document.getElementById('root')
);
