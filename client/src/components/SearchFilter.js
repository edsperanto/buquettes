import React from 'react';

const SearchFilter = ({ sources, handleCheckbox }) => {
  return (
    <ul className="search-filters">
      {
        sources.map( source => {
          return (
            <li className="search-filter">
              <label>{source}</label>
              <input
                type="checkbox"
                defaultChecked="on"
                name={source}
                onClick={handleCheckbox}
              />
            </li>
          )
        })
      }
    </ul>
  )
}

export default SearchFilter;