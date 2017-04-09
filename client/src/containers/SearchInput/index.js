import React, { Component } from 'react';

class SearchInput extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="search-box">
        <input type="text"></input>
        <input type="submit"></input>
      </div>

    )
  }
}

export default SearchInput;