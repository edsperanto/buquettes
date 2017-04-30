import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './index.css';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducers from './reducers';

let files = [
  {
    id: 1,
    source: "github",
    name: "file1",
    createdAt: "April. 22, 2017",
    lastModified: "April 24, 2022"
  },
  {
    id: 2,
    source: "github",
    name: "file2",
    createdAt: "April. 23, 2017",
    lastModified: "April 25, 2022"
  },
  {
    id: 3,
    source: "github",
    name: "fileHow are you",
    createdAt: "April. 24, 2017",
    lastModified: "April 26, 2022"
  },
  {
    id: 4,
    source: "googledrive",
    name: "I'm great how about you.png",
    createdAt: "April. 25, 2017",
    lastModified: "April 27, 2022"
  }
];

const electron_data = require('electron-data')

  let store = createStore(
    reducers
  );

electron_data.config(
  {
    filename: 'service-data',
    path: '/home/steven/Desktop/TestFolder',
    prettysave: true
  });
electron_data.getOptions()
  .then( options => {
    console.log('my options: ', options);
  })
electron_data.set('github', files)
  .then( data => {
    console.log('my files: ', data)
  });
electron_data.save()
  .then( error => {
    console.log('error: ', error);
  })
electron_data.get('github')
  .then( value => {

    ReactDOM.render(
      <Provider store={store}>
        <App data={value} />
      </Provider>,
      document.getElementById('root')
    );
  })



