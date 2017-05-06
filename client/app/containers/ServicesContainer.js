import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ServiceCardContainer  from './ServiceCardContainer';

import { updateView } from '../actions';

class ServicesContainer extends Component {
	componentWillMount() {
		this.props.onUpdateView(this.props.location.pathname);
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
            Skip this step
        </Link>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    url: state.data.url,
    currentUser: state.users.currentUser
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
)(ServicesContainer);
