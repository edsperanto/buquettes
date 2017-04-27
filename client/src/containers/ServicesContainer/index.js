import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ServiceCard } from '../../components/ServiceCard';
import './index.css'

class ServicesContainer extends Component {

  handleClick = event => {
    console.log('authpath', this.authpath);
    // redirect to authpath
  }

  render() {
    return (
      <div className="services-container">
        <ServiceCard
          source="github"
          logopath="assets/github.svg"
          authpath="http://localhost:9000/oauth2/github/authorize"
          onClick={this.handleClick}
        />
        <ServiceCard
          source="box"
          logopath="assets/box.svg"
          authpath="http://localhost:9000/oauth2/box/new"
          onClick={this.handleClick}
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
