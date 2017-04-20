import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { ServiceCard } from '../../components/ServiceCard';

class ServicesContainer extends Component {

  render() {
    return (
      <div className="services-container">
        <ServiceCard
          source="github"
          logopath="assets/github.svg"
          onClick={this.onClick}
        />
        <ServiceCard
          source="google-drive"
          logopath="assets/google-drive.svg"
          onClick={this.onClick}
        />
        <Link to="/">Skip this step</Link>
      </div>
    );
  }
}

function mapStateToProps(state) {

}

function mapDispatchToProps(dispatch) {
  return {

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServicesContainer);
