import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ServiceCardContainer  from './ServiceCardContainer';

import { updateView, updateConnected } from '../actions';

class ServicesContainer extends Component {
	
	allConnected = () => {
		return Object.keys(this.props.connected)
			.every(key => this.props.connected[key]);
	}

	checkConnected = () => {
		const oReq = new XMLHttpRequest();
		oReq.addEventListener('load', _ => {
			let data = JSON.parse(oReq.responseText);
			this.props.onUpdateConnected(data);
		});
		oReq.open('GET', `${this.props.url}/oauth2/all`);
		oReq.send();
	}

	componentWillMount() {
		this.props.onUpdateView(this.props.location.pathname);
		this.checkConnected();
		window.myInterval = setInterval(this.checkConnected, 3000);
	}

  render() {
    return (
      <div className="services-container">
        <ServiceCardContainer
          source="github"
          logopath="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/github-icon.svg"
          authpath={`${this.props.url}/oauth2/github/authorize`}
        />
        <ServiceCardContainer
          source="box"
          logopath="https://s3-us-west-2.amazonaws.com/svgporn.com/logos/box.svg"
          authpath={`${this.props.url}/oauth2/box/authorize`}
        />
        <Link to="/search" className="skip-step">
					{this.allConnected() ? "All Done!" : "Skip this step"}
        </Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    url: state.data.url,
    currentUser: state.users.currentUser,
		connected: state.data.connected
  }
}

function mapDispatchToProps(dispatch) {
  return {
		onUpdateView: view => dispatch(updateView(view)),
		onUpdateConnected: obj => dispatch(updateConnected(obj))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServicesContainer);
