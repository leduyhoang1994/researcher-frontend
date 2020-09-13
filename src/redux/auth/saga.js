
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth } from '../../helpers/Firebase';
import Api from '../../helpers/Api';
import { USER, SELLER } from '../../constants/api';
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
    LOGIN_SELLER,
    REGISTER_SELLER,
    LOGOUT_SELLER,
} from '../actions';

import {
    loginUserSuccess,
    loginUserError,
    registerUserSuccess,
    registerUserError,
    loginSellerSuccess,
    loginSellerError,
    registerSellerSuccess,
    registerSellerError,
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

function* loginWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload;
    try {
        const loginUser = yield call(loginWithEmailPasswordAsync, email, password);

        if (loginUser.success) {
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

const loginWithEmailPasswordAsync = async (email, password) =>
    await Api.callAsync('post', USER.login, {
        email: email,
        password: password
    }).then(data => {
        return data.data;
    }).catch(error => error);
// await auth.signInWithEmailAndPassword(email, password)
//     .then(authUser => authUser)
//     .catch(error => error);

export function* watchLoginSeller() {
    yield takeEvery(LOGIN_SELLER, loginSellerWithEmailPassword);
}

function* loginSellerWithEmailPassword({ payload }) {
    const { userName, password } = payload.user;
    const { history } = payload;
    try {
        const loginSeller = yield call(loginSellerWithEmailPasswordAsync, userName, password);

        if (loginSeller.success) {
            localStorage.setItem('user_token', loginSeller.result.accessToken);
            const userDetails = yield call(getSellerDetails, loginSeller.result.accessToken);
            localStorage.setItem('user_details', JSON.stringify(userDetails));
            yield put(loginSellerSuccess(loginSeller.result, userDetails));
            window.open('/store', '_self');
        } else {
            yield put(loginSellerError(loginSeller.message));
        }
    } catch (error) {
        yield put(loginSellerError(error));

    }
}

const loginSellerWithEmailPasswordAsync = async (userName, password) =>
    await Api.callAsync('post', SELLER.login, {
        username: userName,
        password: password
    }).then(data => {
        return data.data;
    }).catch(error => error);


const getUserDetails = async (token) =>
    await Api.callAsync('get', USER.details, {
        token: token
    }, {
        headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    }).then(data => {
        return data.data;
    }).catch(error => error);

const getSellerDetails = async (token) =>
    await Api.callAsync('get', SELLER.details, {
        token: token
    }, {
        headers: {
            Authorization: 'Bearer ' + token //the token is a variable which holds the token
        }
    }).then(data => {
        return data.data;
    }).catch(error => error);


export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}
const registerWithEmailPasswordAsync = async (firstName, lastName, email, password, confirmPassword) =>
    await Api.callAsync('post', USER.register, {
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

// FOR SELLER
export function* watchRegisterSeller() {
    yield takeEvery(REGISTER_SELLER, registerSellerWithEmailPassword);
}

function* registerSellerWithEmailPassword({ payload }) {
    const { firstName, lastName, userName, phone, email, password, confirmPassword, selectedCity, selectedDistrict, selectedCommune, address } = payload.user;
    const { history } = payload;
    try {
        const registerSeller = yield call(registerSellerWithEmailPasswordAsync, firstName, lastName, userName, phone, email, password, confirmPassword, selectedCity, selectedDistrict, selectedCommune, address);
        if (registerSeller.success) {
            // localStorage.setItem('user_details', JSON.stringify(registerSeller.result));
            yield put(registerSellerSuccess(registerSeller));
            window.open('/seller/login', '_self');
        } else {
            yield put(registerSellerError(registerSeller));
        }
    } catch (error) {
        yield put(registerSellerError(error));
    }
}

const registerSellerWithEmailPasswordAsync = async (firstName, lastName, userName, phone, email, password, confirmPassword, selectedCity, selectedDistrict, selectedCommune, address) =>
    await Api.callAsync('post', SELLER.register, {
        firstName: firstName,
        lastName: lastName,
        username: userName,
        phoneNumber: phone,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        city: selectedCity,
        district: selectedDistrict,
        town: selectedCommune,
        address: address
    }).then(data => {
        return data.data;
    }).catch(error => error.response.data);

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
    // await auth.signOut().then(authUser => authUser).catch(error => error);
    await ApiController.callAsync("POST", USER.logout, null);
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

export function* watchLogoutSeller() {
    yield takeEvery(LOGOUT_USER, logoutSeller);
}

const logoutSellerAsync = async (history) => {
    // await auth.signOut().then(authUser => authUser).catch(error => error);
    await ApiController.callAsync("POST", SELLER.logout, null);
    history.push('/')
}

function* logoutSeller({ payload }) {
    const { history } = payload
    try {
        yield call(logoutSellerAsync, history);
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
        fork(watchLoginSeller),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchRegisterSeller),
        fork(watchLogoutSeller),
        fork(watchForgotPassword),
        fork(watchResetPassword),
    ]);
}