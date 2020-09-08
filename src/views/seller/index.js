import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import UserLayout from '../../layout/UserLayout';

const Login = React.lazy(() =>
  import(/* webpackChunkName: "user-login" */ './login')
);

const Register = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './register')
);

const ProductList = React.lazy(() =>
  import(/* webpackChunkName: "product-set-123" */ '../seller/product/ProductList')
);

const OrderList = React.lazy(() =>
  import(/* webpackChunkName: "product-set-123" */ '../seller/order/OrderList')
);

const OrderDetail = React.lazy(() =>
  import(/* webpackChunkName: "product-set-123" */ '../seller/order/OrderDetail')
);

const User = ({ match }) => {
  return (
    <UserLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`${match.url}/products`} />
          {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/login`} /> */}
          <Route
            path={`${match.url}/login`}
            render={props => <Login {...props} />}
          />
          <Route
            path={`${match.url}/register`}
            render={props => <Register {...props} />}
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
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </UserLayout>
  );
};

export default User;
