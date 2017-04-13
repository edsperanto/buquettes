import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getFiles } from '../../actions';
import SearchInput from '../../components/SearchInput';
import SearchButton from '../../components/SearchButton';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ''
    }
  }

  handleChange = ( event ) => {
    this.setState(
    {
      query: event.target.value
    }
    )
    console.log(this.state);
  }



  sendData = ( event ) => {
    console.log('hello');
  }

  render(){
    return (
      <div className="search-container">
        <SearchInput
          handleChange={this.handleChange}
        />
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