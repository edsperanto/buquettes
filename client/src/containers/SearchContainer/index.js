import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addFile } from '../../actions';
import SearchInput from '../../components/SearchInput';
import SearchButton from '../../components/SearchButton';
import SearchResultsContainer from '../SearchResultsContainer';

let files = [
  {
    id: 1,
    source: "github",
    name: "Hey Caity",
    createdAt: "April. 22, 2017",
    lastModified: "April 24, 2022"
  },
  {
    id: 2,
    source: "git",
    name: "Hey Josh",
    createdAt: "April. 23, 2017",
    lastModified: "April 25, 2022"
  },
  {
    id: 3,
    source: "github",
    name: "How are you",
    createdAt: "April. 24, 2017",
    lastModified: "April 26, 2022"
  },
  {
    id: 4,
    source: "gdrive",
    name: "I'm great how about you",
    createdAt: "April. 25, 2017",
    lastModified: "April 27, 2022"
  }
];

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
  }

  filterResults = ( event ) => {
    this.props.files.map( file => {
      return event.target.value;
    })
    console.log(this.props);
  }

  sendData = ( event ) => {
    console.log('hello');
  }

  componentWillMount() {
    files.map( file => {
      console.log( 'file', file);
      return this.props.addFile(
        file.id,
        file.source,
        file.name,
        file.createdAt,
        file.lastModified
      );
    })
  }

  render(){
    console.log('props', this.props.files);
    return (
      <div className="search-container">
        <SearchInput
          handleChange={this.handleChange}
        />
        <SearchButton
          sendData={this.sendData}
        />
        <SearchResultsContainer
          // show 0 files on default
          // run filter based on searchinput
          filterResults={this.filterResults}
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
    addFile: (id, source, name, createdAt, lastModified) => {
      dispatch(addFile(
        id,
        source,
        name,
        createdAt,
        lastModified
      ));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchContainer);