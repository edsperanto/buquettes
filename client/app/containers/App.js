import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import HeaderContainer from './HeaderContainer';
import HomeContainer from './HomeContainer';
import LoginContainer from './LoginContainer';
import ProfileContainer from './ProfileContainer';
import SignUpContainer from './SignUpContainer';
import SearchContainer from './SearchContainer';
import ServicesContainer from './ServicesContainer';
import FoldersContainer from './FoldersContainer';
import { updateView } from '../actions';
import '../index.css';


class App extends Component {

	/*
  componentWillMount(props) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', e => {
      let {success, currentUser } = JSON.parse(xhr.responseText);
      if(success){
        this.props.onUpdateCurr(currentUser);
      }
    })
    xhr.open('GET', 'https://stratospeer.com/api/user/current', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  }
	*/

  render() {
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
            <Route path="/services" component={ServicesContainer} />
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
    currentView: state.views.currentView,
    url: state.data.url
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onUpdateView: view => dispatch(updateView(view)),
		onUpdateCurr: curr => dispatch(updateCurr(curr))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
