import {
    CHANGE_COUNT
} from '../actions';

const INIT_STATE = {
	count: 0,
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case CHANGE_COUNT:
		return { ...state, loading: true, count:action.payload};

		default: return { ...state };
	}
}