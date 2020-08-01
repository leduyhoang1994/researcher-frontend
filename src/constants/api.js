export const domain = `${process.env.REACT_APP_API_BASE_PATH}/api`;
export const baseDomain = `${process.env.REACT_APP_API_BASE_PATH}`;
export const apiVersion = 'v1';
export const apiPath = `${domain}/${apiVersion}`;

/** User */
export const user = 'users';
export const USERS = {
  all: `${apiPath}/${user}`,
  one: `${apiPath}/${user}`,
  classManagers: `${apiPath}/class-manager`
}

/** Auth */
export const AUTH = {
  logout: `${apiPath}/${user}/logout`,
  login: `${apiPath}/${user}/login`,
  register: `${apiPath}/${user}/register`,
  details: `${apiPath}/${user}/detail`,
}

/** Course */
export const course = 'course';
export const COURSES = {
  all: `${apiPath}/${course}`,
  one: `${apiPath}/${course}`,
}

/** Class Room */
export const classRoom = 'class-room';
export const CLASS_ROOMS = {
  all: `${apiPath}/${classRoom}`,
  one: `${apiPath}/${classRoom}`,
}

/** Training Class */
export const trainingClass = 'training-class';
export const TRAINING_CLASS = {
  all: `${apiPath}/${trainingClass}`,
  one: `${apiPath}/${trainingClass}`,
  expectClass: `${apiPath}/${trainingClass}/create-expect-training-class`
}

/** Class Manager */
export const CLASS_MANAGER = {
  checkIn: `${apiPath}/check-in`,
  checkOut: `${apiPath}/check-out`,
}

/** Student */
export const STUDENTS = {
  info: `${apiPath}/my-info`
}

/** Check In */
export const CHECK_INS = {
  mine: `${apiPath}/check-in-history`,
}