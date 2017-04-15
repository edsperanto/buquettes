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
    name: "file1",
    createdAt: "April. 22, 2017",
    lastModified: "April 24, 2022"
  },
  {
    id: 2,
    source: "github",
    name: "file2",
    createdAt: "April. 23, 2017",
    lastModified: "April 25, 2022"
  },
  {
    id: 3,
    source: "github",
    name: "fileHow are you",
    createdAt: "April. 24, 2017",
    lastModified: "April 26, 2022"
  },
  {
    id: 4,
    source: "gdrive",
    name: "I'm great how about you.png",
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
    this.props.files.files.filter( file => {
      return file.name == this.state.query;
    });
  }

  sendData = ( event ) => {
    console.log('hello');
  }

  componentWillMount() {
    files.map( file => {
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
    return (
      <div className="search-container">
        <SearchInput
          handleChange={this.handleChange}
        />
        <SearchButton
          sendData={this.sendData}
        />
        <SearchResultsContainer
          query={this.state.query}
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