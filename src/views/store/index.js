import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import StoreLayout from '../../layout/StoreLayout';

const HomePage = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './homepage')
);

const ProductList = React.lazy(() =>
  import(/* webpackChunkName: "product-set-123" */ '../store/product/ProductList')
);

const ProductDetail = React.lazy(() =>
  import(/* webpackChunkName: "product-set-123" */ '../store/product/ProductDetail')
);

const OrderList = React.lazy(() =>
  import(/* webpackChunkName: "product-set-123" */ '../store/order/OrderList')
);

const CartList = React.lazy(() =>
  import(/* webpackChunkName: "product-set-123" */ '../store/cart/CartList')
);

const OrderDetail = React.lazy(() =>
  import(/* webpackChunkName: "product-set-123" */ '../store/order/OrderDetail')
);

const Filter = React.lazy(() =>
  import(/* webpackChunkName: "product-set-123" */ '../store/filter/Filter')
);

const User = ({ match }) => {
  return (
    <StoreLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Route
            exact
            path={`${match.url}/search`}
            render={props => <Filter {...props} />}
          />
          <Route
            path={`${match.url}/products/detail/:id`}
            render={props => <ProductDetail {...props} />}
          />
          <Route
            exact
            path={`${match.url}/products`}
            render={props => <ProductList {...props} />}
          />
          <Route
            path={`${match.url}/orders/detail/:id`}
            render={props => <OrderDetail {...props} />}
          />
          <Route
            exact
            path={`${match.url}/orders`}
            render={props => <OrderList {...props} />}
          />
          <Route
            exact
            path={`${match.url}/cart`}
            render={props => <CartList {...props} />}
          />
          <Route
            path={`${match.url}/`}
            render={props => <HomePage {...props} />}
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </StoreLayout>
  );
};

export default User;
