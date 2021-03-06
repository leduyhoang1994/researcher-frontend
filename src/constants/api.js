export const domain = `${process.env.REACT_APP_API_BASE_PATH}`;
export const baseDomain = `${process.env.REACT_APP_API_BASE_PATH}`;
export const apiVersion = 'v1';
export const apiPath = `${domain}/${apiVersion}`;

/** Address*/
export const address = 'address';
export const address_type = 'address-type';
export const ADDRESS = {
  all: `${apiPath}/${address}`,
  type: `${apiPath}/${address_type}`,
}

/** Address Order*/
export const address_orders = 'address-orders';
export const ADDRESS_ORDER = {
  all: `${apiPath}/${address_orders}`,
}

/** Roles*/
export const roles = 'roles';
export const ROLES = {
  all: `${apiPath}/${roles}`,
}

/** User */
export const users = 'users';
export const auth_users = 'auth-users';
export const USERS = {
  all: `${apiPath}/${auth_users}`,
  one: `${apiPath}/${auth_users}`,
  classManagers: `${apiPath}/class-manager`,
  logout: `${apiPath}/${auth_users}/logout`,
  login: `${apiPath}/${auth_users}/login`,
  register: `${apiPath}/${auth_users}/register`,
}

/** Auth User*/
export const USER = {
  all: `${apiPath}/${users}`,
  roles: `${apiPath}/${users}/roles`,
  details: `${apiPath}/${users}/info`,
}

/** Auth Seller*/
export const sellers = 'auth-sellers';
export const SELLERS = {
  logout: `${apiPath}/${sellers}/logout`,
  login: `${apiPath}/${sellers}/login`,
  register: `${apiPath}/${sellers}/register`,
}

/** Auth Seller*/
export const seller = 'seller';
export const SELLER = {
  all: `${apiPath}/${seller}`,
  details: `${apiPath}/${seller}/info`,
  admin: `${apiPath}/${seller}/admin`,
  type: `${apiPath}/${seller}/admin/account-type`,
}

/** Source Category */
export const source_categories = 'source-categories';
export const SOURCE_CATEGORIES = {
  all: `${apiPath}/${source_categories}`,
  filter: `${apiPath}/${source_categories}/filter`,
  site: `${apiPath}/${source_categories}/site`,
}

/** Ubox Category */
export const uboxCategories = 'ubox-categories';
export const UBOX_CATEGORIES = {
  all: `${apiPath}/${uboxCategories}`,
  level: `${apiPath}/${source_categories}/level`,
}

/** Ubox Category Attributes*/
export const uboxCategoryAttributes = 'ubox-category-attributes';
export const UBOX_CATEGORY_ATTRIBUTES = {
  all: `${apiPath}/${uboxCategoryAttributes}`,
  detail: `${apiPath}/${uboxCategoryAttributes}/ubox-category`,
}

/** Ubox Category Seller View*/
export const category_seller = 'ubox-category-seller-view';
export const CATEGORY_SELLER = {
  all: `${apiPath}/${category_seller}`,
}

/** Source Product */
export const source_products = 'source-products';
export const SOURCE_PRODUCTS = {
  all: `${apiPath}/${source_products}`,
  bulk: `${apiPath}/${source_products}/bulk`,
}

/** Ubox Product */
export const ubox_products = 'ubox-products';
export const UBOX_PRODUCTS = {
  all: `${apiPath}/${ubox_products}`,
  filter: `${apiPath}/${ubox_products}/filter`,
  media: `${apiPath}/${ubox_products}/media`,
  publish: `${apiPath}/${ubox_products}/publish`,
  source: `${apiPath}/${ubox_products}/source`,
  search: `${apiPath}/${ubox_products}/search`,
  info: `${apiPath}/${ubox_products}/source-info`,
}

/** Source Product Seller View*/
export const product_seller = 'ubox-product-seller-view';
export const PRODUCT_SELLER = {
  all: `${apiPath}/${product_seller}`,
  filter: `${apiPath}/${product_seller}/filter`,
}

/** Ubox Product Options*/
export const ubox_product_options = 'ubox-product-options';
export const PRODUCT_OPTIONS = {
  all: `${apiPath}/${ubox_product_options}`,
}

/** Options */
export const options = 'options';
export const OPTIONS = {
  create: `${apiPath}/${options}`,
  all: `${apiPath}/${options}/attribute`,
};

/** Attributes */
export const attributes = 'attributes';
export const ATTRIBUTES = {
  all: `${apiPath}/${attributes}`,
}

/** Order */
export const order = 'seller-orders';
export const ORDERS = {
  all: `${apiPath}/${order}`,
  getBySeller: `${apiPath}/${order}/view-list`,
  details: `${apiPath}/${order}/view-detail`,
  calculator: `${apiPath}/${order}/calculator/lastmile`,
}

/** SET */
export const sets = 'sets';
export const PRODUCT_SETS = {
  all: `${apiPath}/${sets}/${source_products}`,
  add: `${apiPath}/${sets}/${source_products}/list-add`,
  delete: `${apiPath}/${sets}/${source_products}/list-delete`,
}
export const CATEGORY_SETS = {
  all: `${apiPath}/${sets}/${source_categories}`,
  add: `${apiPath}/${sets}/${source_categories}/list-add`,
  delete: `${apiPath}/${sets}/${source_categories}/list-delete`,
}

/** CONSTANTS */
export const constants = 'constants';
export const CONSTANTS = {
  all: `${apiPath}/${constants}`,
  type: `${apiPath}/${constants}/type`,
}

/** TRANSPORTATION */
export const transportation = 'transportations';
export const TRANSPORTATION = {
  all: `${apiPath}/${transportation}`,
}

/** Group Order */
export const group_orders = 'group-orders';
export const GROUP_ORDERS = {
  all: `${apiPath}/${group_orders}`,
}

/** Group Order */
export const account = 'account-type';
export const ACCOUNTS = {
  all: `${apiPath}/${account}`,
}

/** Crawl */
//1688
export const CRAWL_1688 = `${SOURCE_PRODUCTS.all}/crawl-1688`;