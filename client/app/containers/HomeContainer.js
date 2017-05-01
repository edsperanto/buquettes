import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateView } from '../actions';

//lodash
const _flattenDeep = require('lodash.flattendeep');

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.serviceArray = [];
  }

  getServiceStates = function getServiceState(user) {
  return new Promise( (resolve, reject ) => {
    function reqListener(){
      let data = JSON.parse(this.responseText);
      console.log('XHR JSON: ', data);
      resolve(data);
    }
    const oReq = new XMLHttpRequest();
    oReq.addEventListener('load', reqListener); 
    oReq.open('GET', 'https://www.stratospeer.com/api/oauth2/all', true);
    oReq.send(user);
  });
};

getServiceData = function getServiceData(service) {
  return new Promise( (resolve, reject ) => {
    function reqListener(){
      let data = this.responseText;
      console.log('what type? ', typeof data)
      console.log('files? ', data);
      resolve(data);
    }
    const oReq = new XMLHttpRequest();
    oReq.addEventListener('load', reqListener); 
    oReq.open('GET', 'https://www.stratospeer.com/api/oauth2/${service}/search', true);
    oReq.send(this.props.currentUser);
  });

  checkServiceStates = () => {
    this.getServiceStates(this.props.currentUser).then(obj=> {
      console.log('makin sure this is JSON: ', obj);
      return Promise.all(Object.keys(obj).filter(key => {
        return obj[key] === true
      })
      .map(service => {
        return getServiceData(service)
      })
      .then(allResults => {
        console.log('allresults: ', allResults)
        _flattenDeep(allResults);
      })
    })
  }




  componentWillMount() {    
    // webFrame.registerURLSchemeAsBypassingCSP("'unsafe-inline'");
    this.getServiceStates(this.props.currentUser)
    this.props.onUpdateView(this.props.location.pathname)
  }

  componentDidMount() {
    this.checkServiceStates()
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
