import React from 'react';

const File = ( { id, source, name, createdAt, lastModified } ) => (
  <div className="file">
    <ul>
      <li>{source}</li>
      <li>{name}</li>
      <li>{createdAt}</li>
      <li>{lastModified}</li>
    </ul>
  </div>
);

export default File;