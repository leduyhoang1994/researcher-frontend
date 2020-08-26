
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth } from '../../helpers/Firebase';
import Api from '../../helpers/Api';
import { AUTH } from '../../constants/api';
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
} from '../actions';

import {
    loginUserSuccess,
    loginUserError,
    registerUserSuccess,
    registerUserError,
    forgotPasswordSuccess,
    forgotPasswordError,
    resetPasswordSuccess,
    resetPasswordError
} from './actions';
import ApiController from '../../helpers/Api';


export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

// const loginWithEmailPasswordAsync = async (email, password) =>
//     await auth.signInWithEmailAndPassword(email, password)
//         .then(authUser => authUser)
//         .catch(error => error);

const loginWithEmailPasswordAsync = async (email, password) =>
    await Api.callAsync('post', AUTH.login, {
        email: email,
        password: password
    }).then(data => {
        return data.data;
    }).catch(error => error);
// await auth.signInWithEmailAndPassword(email, password)
//     .then(authUser => authUser)
//     .catch(error => error);

const getUserDetails = async (token) =>
    await Api.callAsync('get', AUTH.details, {
        token: token
    }, {
        headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    }).then(data => {
        return data.data;
    }).catch(error => error);

function* loginWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload;
    try {
        const loginUser = yield call(loginWithEmailPasswordAsync, email, password);

        if(loginUser.success) {
            localStorage.setItem('user_token', loginUser.result.accessToken);
            const userDetails = yield call(getUserDetails, loginUser.result.accessToken);
            localStorage.setItem('user_details', JSON.stringify(userDetails));
            yield put(loginUserSuccess(loginUser.result, userDetails));
            window.open('/', '_self');
        } else {
            yield put(loginUserError(loginUser.message));
        }
    } catch (error) {
        yield put(loginUserError(error));

    }
}


export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}
const registerWithEmailPasswordAsync = async (firstName, lastName, email, password, confirmPassword) =>
    await Api.callAsync('post', AUTH.register, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    }).then(data => {
        return data.data;
    }).catch(error => error.response.data);

function* registerWithEmailPassword({ payload }) {
    const { firstName, lastName, email, password, confirmPassword } = payload.user;
    const { history } = payload
    try {
        const registerUser = yield call(registerWithEmailPasswordAsync, firstName, lastName, email, password, confirmPassword);
        if (registerUser.success) {
            // localStorage.setItem('user_details', JSON.stringify(registerUser.result));
            yield put(registerUserSuccess(registerUser));
            window.open('/user/login', '_self');
        } else {
            yield put(registerUserError(registerUser));
        }
    } catch (error) {
        yield put(registerUserError(error));
    }
}



export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
    // await auth.signOut().then(authUser => authUser).catch(error => error);
    await ApiController.callAsync("POST", AUTH.logout, null);
    history.push('/')
}

function* logout({ payload }) {
    const { history } = payload
    try {
        yield call(logoutAsync, history);
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_details');
    } catch (error) {
    }
}

export function* watchForgotPassword() {
    yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {
    return await auth.sendPasswordResetEmail(email)
        .then(user => user)
        .catch(error => error);
}

function* forgotPassword({ payload }) {
    const { email } = payload.forgotUserMail;
    try {
        const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
        if (!forgotPasswordStatus) {
            yield put(forgotPasswordSuccess("success"));
        } else {
            yield put(forgotPasswordError(forgotPasswordStatus.message));
        }
    } catch (error) {
        yield put(forgotPasswordError(error));

    }
}

export function* watchResetPassword() {
    yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
    return await auth.confirmPasswordReset(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
}

function* resetPassword({ payload }) {
    const { newPassword, resetPasswordCode } = payload;
    try {
        const resetPasswordStatus = yield call(resetPasswordAsync, resetPasswordCode, newPassword);
        if (!resetPasswordStatus) {
            yield put(resetPasswordSuccess("success"));
        } else {
            yield put(resetPasswordError(resetPasswordStatus.message));
        }
    } catch (error) {
        yield put(resetPasswordError(error));

    }
}

export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgotPassword),
        fork(watchResetPassword),
    ]);
}