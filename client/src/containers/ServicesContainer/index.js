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
          authpath=""
          onClick={this.handleClick}
        />
        <ServiceCard
          source="google-drive"
          logopath="assets/google-drive.svg"
          authpath=""
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
