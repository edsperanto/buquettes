import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getFiles } from '../../actions';
import SearchInput from '../../components/SearchInput';
import SearchButton from '../../components/SearchButton';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
  }

  sendData = (event) => {
    console.log('hello');
  }

  render(){
    return (
      <div className="search-container">
        <SearchInput />
        <SearchButton
          sendData={this.sendData}
        />
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