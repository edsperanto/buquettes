import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ServiceCardContainer  from './ServiceCardContainer';
import { isLoggedIn } from '../helpers/isLoggedIn';

class ServicesContainer extends Component {

  componentWillMount() {
    isLoggedIn(this.props.currentUser, this.props);
  }

  render() {
    return (
      <div className="services-container">
        <ServiceCardContainer
          source="github"
          logopath="assets/github.svg"
          authpath={`${this.props.url}/oauth2/github/authorize`}
        />
        <ServiceCardContainer
          source="box"
          logopath="assets/box.svg"
          authpath={`${this.props.url}/oauth2/box/new`}
        />
        <Link to="/" className="skip-step">
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

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServicesContainer);
