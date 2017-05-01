import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import './index.css';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducers from './reducers';

const electron_data = require('electron-data');

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

//   let things = function getAPIData(files) {
//   return new Promise( (resolve, reject ) => {
//     function reqListener(){
//       let data = this.responseText;
//       console.log('XHR data: ', data);
//       resolve(data);
//     }

//     const oReq = new XMLHttpRequest();
//     oReq.addEventListener('load', reqListener); 
//     oReq.open('GET', 'http://www.stratospeer.com/api/oauth2/github/search', true);
//     oReq.send(files);
//   });
// };



  let store = createStore(
    reducers
  );

electron_data.config(
  {
    filename: 'service-data',
    path: '/Users/edward/Desktop/TestFolder',
    prettysave: true
  });
electron_data.getOptions()
  .then( options => {
    console.log('my options: ', options);
  })
electron_data.set('github', things())
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
        <App  />
      </Provider>,
      document.getElementById('root')
    );
  // })



