export const domain = `${process.env.REACT_APP_API_BASE_PATH}`;
export const baseDomain = `${process.env.REACT_APP_API_BASE_PATH}`;
export const apiVersion = 'v1';
export const apiPath = `${domain}/${apiVersion}`;

/** User */
export const user = 'auth-users';
export const USERS = {
  all: `${apiPath}/${user}`,
  one: `${apiPath}/${user}`,
  classManagers: `${apiPath}/class-manager`
}

/** Auth User*/
export const USER = {
  logout: `${apiPath}/${user}/logout`,
  login: `${apiPath}/auth-users/login`,
  register: `${apiPath}/${user}/register`,
  details: `${apiPath}/${user}/info`,
}

/** Auth Seller*/
export const seller = 'auth-sellers';
export const SELLER = {
  logout: `${apiPath}/${seller}/logout`,
  login: `${apiPath}/${seller}/login`,
  register: `${apiPath}/${seller}/register`,
  details: `${apiPath}/${seller}/info`,
}

/** Category */
export const categories = 'categories';
export const CATEGORIES = {
  all: `${apiPath}/${categories}`,
  filter: `${apiPath}/${categories}/filter`,
  set: `${apiPath}/sets/${categories}`,
  addToSet: `${apiPath}/sets/${categories}/list-add`,
  removeFromSet: `${apiPath}/sets/${categories}/list-delete`,
  allEdit: `${apiPath}/category-edits`,
}

/** Product */
export const products = 'products';
export const PRODUCTS = {
  all: `${apiPath}/${products}`,
  filter: `${apiPath}/${products}/filter`,
  set: `${apiPath}/sets/${products}`,
  addToSet: `${apiPath}/sets/${products}/list-add`,
  removeFromSet: `${apiPath}/sets/${products}/list-delete`,
  allEdit: `${apiPath}/product-edits`,
}

export const attributes = 'attributes';
export const ATTRIBUTES = {
  all: `${apiPath}/${attributes}`,
}

export const categoryEdit = 'category-edit-attributes';
export const CATEGORY_EDIT = {
  all: `${apiPath}/${categoryEdit}/category`,
}

export const productEdit = 'product-edits';
export const PRODUCT_EDIT = {
  all: `${apiPath}/${productEdit}`,
  media: `${apiPath}/${productEdit}/media`,
  filter: `${apiPath}/${productEdit}/filter`,
}

export const options = 'options';
export const OPTIONS = {
  create: `${apiPath}/${options}`,
  all: `${apiPath}/${options}/attribute`,
};

/** Order */
export const order = 'orders';
export const ORDERS = {
  all: `${apiPath}/${order}`,
  getBySellerId: `${apiPath}/${order}/view-list`,
  details: `${apiPath}/${order}/view-detail`,
}

export const category_seller = 'category-seller-view';
export const CATEGORY_SELLER = {
  all: `${apiPath}/${category_seller}`,
}