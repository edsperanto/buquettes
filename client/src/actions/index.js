export const GET_FILES = 'GET_FILES';

export function getFiles(files) {
  return {
    type: GET_FILES,
    files
  }
}