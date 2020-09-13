import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGOUT_USER,
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    RESET_PASSWORD,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_ERROR,
    LOGIN_SELLER,
    LOGIN_SELLER_SUCCESS,
    LOGIN_SELLER_ERROR,
    REGISTER_SELLER,
    REGISTER_SELLER_SUCCESS,
    REGISTER_SELLER_ERROR,
    LOGOUT_SELLER
} from '../actions';

const INIT_STATE = {
    user: localStorage.getItem('user_token'),
    forgotUserMail: '',
    newPassword: '',
    resetPasswordCode: '',
    loading: false,
    error: '',
    userDetails: JSON.parse(localStorage.getItem('user_details')) || {}
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loading: true, error: '' };
        case LOGIN_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload.user, userDetails: action.payload.userDetails, error: '' };
        case LOGIN_USER_ERROR:
            return { ...state, loading: false, user: '', error: action.payload.message };
        case FORGOT_PASSWORD:
            return { ...state, loading: true, error: '' };
        case FORGOT_PASSWORD_SUCCESS:
            return { ...state, loading: false, forgotUserMail: action.payload, error: '' };
        case FORGOT_PASSWORD_ERROR:
            return { ...state, loading: false, forgotUserMail: '', error: action.payload.message };
        case RESET_PASSWORD:
            return { ...state, loading: true, error: '' };
        case RESET_PASSWORD_SUCCESS:
            return { ...state, loading: false, newPassword: action.payload, resetPasswordCode: '', error: '' };
        case RESET_PASSWORD_ERROR:
            return { ...state, loading: false, newPassword: '', resetPasswordCode: '', error: action.payload.message };
        case REGISTER_USER:
            return { ...state, loading: true, error: '' };
        case REGISTER_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: '' };
        case REGISTER_USER_ERROR:
            return { ...state, loading: false, user: '', error: action.payload.message };
        case LOGOUT_USER:
            return { ...state, user: null, error: '' };

        case LOGIN_SELLER:
            return { ...state, loading: true, error: '' };
        case LOGIN_SELLER_SUCCESS:
            return { ...state, loading: false, user: action.payload.user, userDetails: action.payload.userDetails, error: '' };
        case LOGIN_SELLER_ERROR:
            return { ...state, loading: false, user: '', error: action.payload.message };
        case REGISTER_SELLER:
            return { ...state, loading: true, error: '' };
        case REGISTER_SELLER_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: '' };
        case REGISTER_SELLER_ERROR:
            return { ...state, loading: false, user: '', error: action.payload.message };
        case LOGOUT_SELLER:
            return { ...state, user: null, error: '' };
        default: return { ...state };
    }
}
