import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateView } from '../actions';
import { isLoggedIn } from '../helpers/isLoggedIn';

// const {webFrame} = require('electron');
const open = require("open");


class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }



  serviceStates = function getServiceState(user) {
		return new Promise( (resolve, reject ) => {
			function reqListener(){
				let data = this.responseText;
				console.log('XHR data: ', data);
				resolve(data);
			}

			const oReq = new XMLHttpRequest();
			oReq.addEventListener('load', reqListener); 
			oReq.open('GET', 'https://www.stratospeer.com/api/oauth2/all', true);
			oReq.send(user);
		});
	};

  componentWillMount() {    
    // webFrame.registerURLSchemeAsBypassingCSP("'unsafe-inline'");
		isLoggedIn(this.props.currentUser, this.props);
		this.serviceStates(this.props.currentUser)
    this.props.onUpdateView(this.props.location.pathname)
  }

  render() {
    return (
      <div className="home-container">
        "You haven\'t added any files yet"
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
)(HomeContainer);
