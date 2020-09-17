import {
    CHANGE_COUNT
} from '../actions';


export const changeCount = (count) => {
    // localStorage.setItem('currentLanguage', locale);
    return ({
        type: CHANGE_COUNT,
        payload: count
    })
}

