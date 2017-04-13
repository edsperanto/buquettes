import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getFiles } from '../../actions';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    console.log(this.props);
    return (
      <div className="search-box">
        <h1>SEARCH</h1>
        <input type="text"></input>
        <input type="submit"></input>
      </div>

    )
  }
}

const mapStateToProps = (state) => {
    return {
      files: state.files
    }
  };

const mapDispatchToProps = (dispatch) => {
  return {
    getFiles: (files) => {
      dispatch(getFiles(files));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer);