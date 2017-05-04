import React, { Component } from 'react';
import { connect } from 'react-redux';
const _flattenDeep = require('lodash.flattendeep');

import { updateView } from '../actions';

//electron
const app = require('electron').app
const electron_data = require('electron-data');

class HomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.serviceArray = [];
  }

  serviceStates = _ => {
		return new Promise((resolve, reject) => {
			function reqListener() {
				let data = JSON.parse(this.responseText);
				console.log('Connected Services: ', data);
				resolve(data);
			}
			const oReq = new XMLHttpRequest();
			oReq.addEventListener('load', reqListener); 
			oReq.open('GET', 'https://www.stratospeer.com/api/oauth2/all', true);
			oReq.send();
		});
	};

	getSingleServiceData = (service) => {
		return new Promise((resolve, reject) => {
			const oReq = new XMLHttpRequest();
			oReq.addEventListener('load', _ => resolve(oReq.responseText)); 
			oReq.open('GET', `https://www.stratospeer.com/api/oauth2/${service}/search`, true);
			oReq.send();
		});
	}

  allServiceFiles = () => {
    return this.serviceStates().then(obj => {
      return Promise.all(Object.keys(obj).filter(key => {
          return obj[key] === true
        })
        .map(service => {
          return this.getSingleServiceData(service)
        })
      )
      .then(allResults => {
        return _flattenDeep(allResults);
      })
      .catch(err=>{
        console.log('allresults err0r: ', err)
      })
    })
      .catch(err=>{
        console.log('getservicestates err0r: ', err)
    })

  }

  serviceFilesToElectron = () =>{
    this.allServiceFiles().then(files =>{
      electron_data.config(
        {
          filename: 'service_data',
          path: "",
          prettysave: true
        });
      electron_data.getOptions()
        .then( options => {
          console.log('my options: ', options);
        })
      electron_data.set('services', files)
        .then( data => {
          // console.log('my files: ', data)
        });
      electron_data.save()
        .then( error => {
          console.log('error: ', error);
        })
      electron_data.get('services')
        .then( value => {
          console.log('value of files: ', value)
      }) //use to get files and store in redux store
    })
  }

  componentWillMount(){    
    this.serviceStates(this.props.currentUser);
    this.props.onUpdateView(this.props.location.pathname);
  }

  componentDidMount(){
    this.serviceFilesToElectron();
  }

  render() {
    return (
      <div className="home-container">
        {"You haven't added any files yet"}
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
