import { ADD_FILE, UPDATE_FILES } from '../actions';

const initialState = {
  files: []
}

function files(state = initialState, action) {
  switch( action.type ){
    case ADD_FILE:
			return Object.assign({}, state, {
				files: [
					...state.files,
					{
						name: action.name,
						path: action.path,
						repo: action.repo,
						html_url: action.html_url,
						modified_at: action.modified_at,
						type: action.type
					}
				]
			});
			break;
		case UPDATE_FILES:
			return Object.assign({}, state, {
				files: action.files
			});
			break;
    default:
      return state;
  }
}

export default files;
