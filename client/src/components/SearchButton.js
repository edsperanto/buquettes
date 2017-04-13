import React, { Component } from 'react';

const SearchButton = ({ sendData }) => {
  return (
    <input
      onClick={sendData}
      className="search-button"
      type="submit"
      value="Submit">
    </input>
  )
}

export default SearchButton;