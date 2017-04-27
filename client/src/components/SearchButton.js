import React from 'react';

const SearchButton = ({ sendData }) => {
  return (
    <input
      onClick={sendData}
      className="search-button"
      type="submit"
    >
    </input>
  )
}

export default SearchButton;
