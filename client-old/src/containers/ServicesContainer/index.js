import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ServiceCardContainer  from '../ServiceCardContainer';
import './index.css'

class ServicesContainer extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="services-container">
        <ServiceCardContainer
          source="github"
          logopath="assets/github.svg"
          authpath="http://api.stratospeer.com/oauth2/github/authorize"
        />
        <ServiceCardContainer
          source="box"
          logopath="assets/box.svg"
          authpath="http://api.stratospeer.com/oauth2/box/new"
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
