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
  register: `${apiPath}/users/register`,
  details: `${apiPath}/users/info`,
}

/** Category */
export const categories = 'categories';
export const CATEGORIES = {
  all: `${apiPath}/${categories}`,
  filter: `${apiPath}/${categories}/filter`,
  set: `${apiPath}/sets/${categories}`,
  addToSet: `${apiPath}/sets/${categories}/listAdd`,
  removeFromSet: `${apiPath}/sets/${categories}/listDelete`,
  allEdit: `${apiPath}/categoryEdits`,
}

/** Product */
export const products = 'products';
export const PRODUCTS = {
  all: `${apiPath}/${products}`,
  filter: `${apiPath}/${products}/filter`,
  set: `${apiPath}/sets/${products}`,
  addToSet: `${apiPath}/sets/${products}/listAdd`,
  removeFromSet: `${apiPath}/sets/${products}/listDelete`,
}