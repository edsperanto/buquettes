import React, { Component } from 'react';

class ServiceCardContainer extends Component {
  handleClick = event => {
    window.location.assign(this.props.authpath);
  }

  render(){
    return(
      <div
        className="service-card"
        authpath={this.props.authpath}
        onClick={this.handleClick}>
        <div className="logo">
          <img src={this.props.logopath} alt={this.props.source}/>
        </div>
        <h2>{this.props.source}</h2>
      </div>
    )
  }
}

export default ServiceCardContainer;