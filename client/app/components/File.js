import React from 'react';

const File = ( { name, path, repo, html_url, modified_at, type } ) => (
  <div className="file">
    <ul>
      <li>{name}</li>
      <li>{path}</li>
      <li>{repo}</li>
      <li>{html_url}</li>
      <li>{modified_at}</li>
      <li>{type}</li>
    </ul>
  </div>
);

export default File;