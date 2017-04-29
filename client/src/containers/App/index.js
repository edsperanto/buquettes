import React, { Component } from 'react';
import { connect } from 'react-redux';

import { electronApp } from 'electron';
import electron_data from 'electron-data';

import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';

import HeaderContainer from '../HeaderContainer';
import HomeContainer from '../HomeContainer';
import LoginContainer from '../LoginContainer';
import ProfileContainer from '../ProfileContainer';
import SignUpContainer from '../SignUpContainer';
import SearchContainer from '../SearchContainer';
import FoldersContainer from '../FoldersContainer';

import { updateView } from '../../actions';

import './index.css';


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

class App extends Component {
  //electron data for local storage


componentWillMount() {
  
  electron_data.config(
    {
      filename: 'service_data',
      path: '/home/steven/Desktop/TestFolder',  //path to be determined later

    }
  );
  electron_data.getOptions()
    .then(options => {
      console.log("what are my options? ", options);
    });

  electron_data.set('github', files)
    .then(data => {
      console.log('files: ', files);
    });
  electron_data.save()
    .then(msg => {
      msg = 'you have saved the file to path whatevs.';
      console.log(msg);
    });
  electron_data.get('github')
    .then(data => {
      console.log('got the data? ', data); //retrieves 'files'
    });
}




  render() {
    console.log('nav level view', this.props.currentView);
    return (
      <div className="App">
				<Router>
					<div className='route-container'>
						<HeaderContainer
              hidden={this.props.currentView === '/search' ? true : false}
            />
						<Route exact path="/" component={HomeContainer} />
						<Route path="/login" component={LoginContainer} />
						<Route path="/profile" component={ProfileContainer} />
            <Route path="/signup" component={SignUpContainer} />
            <Route path="/search" component={SearchContainer} />
						<Route path="/box/folders" component={FoldersContainer} />
					</div>
				</Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
	return {
    currentUser: state.users.currentUser,
    currentView: state.views.currentView
	}
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateView: view => dispatch(updateView(view))
  }
}

export default connect(
	mapStateToProps,
  mapDispatchToProps
)(App);
