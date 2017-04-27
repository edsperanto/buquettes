import React from 'react';

const SearchInput = ({ handleClick, handleChange }) => {
  return (
    <input
      className="search-input"
      type="text"
      content="hello"
      onChange={handleChange}
    >
    </input>
  )
}

export default SearchInput;
