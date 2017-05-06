import {UPDATE_BOX_DATA, UPDATE_CONNECTED} from '../actions';

const initialState = {
	data: {
		Box: []
	},
	connected: {
		github: false,
		box: false
	},
	url: `https://www.stratospeer.com/api`
};

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
		case UPDATE_CONNECTED:
			return Object.assign({}, state, {
				connected: {
					github: action.github,
					box: action.box
				}
			});
			break;
		default:
			return state;
	}
}

export default data;
