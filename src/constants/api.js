export const domain = `${process.env.REACT_APP_API_BASE_PATH}`;
export const baseDomain = `${process.env.REACT_APP_API_BASE_PATH}`;
export const apiVersion = 'v1';
export const apiPath = `${domain}/${apiVersion}`;

/** User */
export const user = 'auth';
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

/** Category */
export const categories = 'categories';
export const CATEGOIES = {
  all: `${apiPath}/${categories}`
}