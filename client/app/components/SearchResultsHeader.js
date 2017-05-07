import React from 'react';

const SearchResultsHeader = () => {
  return(
    <div className="search-results-header">
      <ul>
        <li>Name</li>
        <li>Path</li>
        <li>Source</li>
        <li>Last Modified</li>
        <li>Type</li>
      </ul>
    </div>
  );
};

export default SearchResultsHeader;
