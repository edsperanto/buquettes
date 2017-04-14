import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addFile } from '../../actions';


class SearchResultsContainer extends Component {
  constructor(props) {
    super(props);
  }
  render( filterResults ){
    return(
      <div className="search-results">
      Results:
      </div>
      )
  }
}


const mapStateToProps = (state) => {
    return {
      cards: state.cards
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
)(SearchResultsContainer);