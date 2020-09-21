
export const validateName = (value) => {
    let error;
    if (!value) {
        error = `Please enter this field`;
    } else if (value.length < 4) {
        error = "Value must be longer than 4 characters";
    }
    return error;
}

export const validatePassword = (value) => {
    let error;
    if (!value) {
        error = "Please enter your password";
    } else if (value.length < 5) {
        error = "Value must be longer than 5 characters";
    }
    return error;
}

export const validateEmailNoRequired = (value) => {
    let error;
    if (value) {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            error = "Invalid email address";
        }
    }
    return error;
}

export const validateEmail = (value) => {
    let error;
    if (!value) {
        error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = "Invalid email address";
    }
    return error;
}

export const validateNumber = (value) => {
    let error;
    if (!value) {
        error = "Please enter number";
    } else if (typeof value !== 'number') {
        error = "Please enter number";
    } else if (value.length < 4) {
        error = "Value must be longer than 4 characters";
    }
    return error;
}

export const validatePhone = (value) => {
    var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    let error;
    if (!value) {
        error = "Please enter your phone number!";
    } else if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(value))
        error = "Your phone number format is incorrect!";
    return error;
}

