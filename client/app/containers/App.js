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

  checkAuth = () => {
    if(!this.props.currentUser.authenticated){
      this.props.history.push('/login');
    }
  }

  componentWillMount(props) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', e => {
      let {success, currentUser } = JSON.parse(xhr.responseText);
      if(success){
        this.props.onUpdateCurr(currentUser);
      }
    })
    xhr.open('GET', `http://stratospeer.com/api/user/current`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
  }

  render() {
  console.log('this props: ', this.props)
    return (
      <div className="App">
        <Router>
          <div className='route-container'>
            <HeaderContainer
              hidden={this.props.currentView === '/search' ? true : false}
            />
            <Route exact path="/" onEnter={this.checkAuth} component={HomeContainer} />
            <Route path="/login" component={LoginContainer} />
            <Route path="/profile" onEnter={this.checkAuth} component={ProfileContainer} />
            <Route path="/signup" component={SignUpContainer} />
            <Route path="/search" onEnter={this.checkAuth} component={SearchContainer} />
            <Route path="/services" onEnter={this.checkAuth} component={ServicesContainer} />
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
    onUpdateView: view => dispatch(updateView(view))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
