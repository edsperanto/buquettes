import React from 'react';
import open from 'open';


const File = ( { name, path, repo, html_url, modified_at, type } ) => {
  const handleClick = event => {
    open(html_url);
  }

  return(
    <div className="file" onClick={handleClick}>
      <ul>
        <li>{name}</li>
        <li>{path}</li>
        <li>{repo}</li>
        <li>{modified_at}</li>
        <li>{type}</li>
      </ul>
    </div>
  )
};

export default File;