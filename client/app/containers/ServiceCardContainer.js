import React, { Component } from 'react';
import {connect} from 'react-redux';

import open from 'open';

class ServiceCardContainer extends Component {
  handleClick = event => {
		if(!this.props.connected[this.props.source])
			open(this.props.authpath + '?id=' + this.props.currentUser.id);
  }
  render(){
    return(
      <div
				className={"service-card" + ((this.props.connected[this.props.source]) ? " green" : "")}
        onClick={this.handleClick}>
					<div className="logo">
						<img src={this.props.logopath} alt={this.props.source}/>
					</div>
					<h2>{this.props.source}</h2>
      </div>
    )
  }
}

function mapStateToProps(state) {
	return {
		currentUser: state.users.currentUser,
		connected: state.data.connected
	}
}

export default connect(
	mapStateToProps,
	null
)(ServiceCardContainer);
