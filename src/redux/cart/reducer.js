
import {defaultLocale,localeOptions} from '../../constants/defaultValues'

import {
    CHANGE_COUNT
} from '../actions';

const INIT_STATE = {
	total: 0,
};

export default (state = INIT_STATE, action) => {
	switch (action.type) {
		case CHANGE_COUNT:
		return { ...state, count:action.payload};

		default: return { ...state };
	}
}