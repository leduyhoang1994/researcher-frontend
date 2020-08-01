import {
	TOGGLE_ALERT
} from '../actions';

const INIT_STATE = {
	data: "test"
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case TOGGLE_ALERT:
			return { ...state, data: action.payload };

		default: return { ...state };
	}
}