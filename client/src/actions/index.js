export const ADD_FILE = 'ADD_FILE';

export function addFile(id, source, name, createdAt, lastModified) {
  return {
    type: ADD_FILE,
    id,
    source,
    name,
    createdAt,
    lastModified
  };
}