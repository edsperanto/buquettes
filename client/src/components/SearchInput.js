import React from 'react';

const SearchInput = ({ handleChange }) => {
  return (
    <input
      className="search-input"
      type="text"
      placeholder="Search my files"
      onChange={handleChange}
    >
    </input>
  )
}

export default SearchInput;
