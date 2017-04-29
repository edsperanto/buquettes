import {UPDATE_BOX_DATA} from '../actions';

const initialState = {
	data: {
		Box: []
	}
}

function data(state = initialState, action) {
	switch(action.type) {
		case UPDATE_BOX_DATA:
			return Object.assign({}, state, {
				data: Object.assign({}, state.data, {
					Box: [
						...state.data.Box,
						action.entry
					]
				})
			});
		default:
			return state;
	}
}

export default data;
