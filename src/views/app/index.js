import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Research = React.lazy(() =>
  import(/* webpackChunkName: "research" */ './research')
);

const Filter = React.lazy(() =>
  import(/* webpackChunkName: "research" */ './filter')
);

const Product = React.lazy(() =>
  import(/* webpackChunkName: "product" */ './product')
);

const ProductSets = React.lazy(() =>
  import(/* webpackChunkName: "product-set" */ './product-set')
);

const ProductSet = React.lazy(() =>
  import(/* webpackChunkName: "product-set" */ './product-set/ProductSet')
);

const CateSets = React.lazy(() =>
  import(/* webpackChunkName: "product-set" */ './cate-set')
);

const CateSet = React.lazy(() =>
  import(/* webpackChunkName: "product-set" */ './cate-set/CateSet')
);

const Category = React.lazy(() =>
  import(/* webpackChunkName: "product-set" */ './categoryEdit/Category')
);

const EditCategory = React.lazy(() =>
  import(/* webpackChunkName: "product-set" */ './categoryEdit/EditCategory')
);

class App extends Component {
  render() {
    const { match } = this.props;
    const userDetails = JSON.parse(localStorage.getItem("user_details"));
    const role = userDetails.roles && userDetails.roles[0];
    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/research`} />
              <Route
                path={`${match.url}/research`}
                render={props => <Research {...props} />}
              />
              <Route
                path={`${match.url}/filters`}
                render={props => <Filter {...props} />}
              />
              <Route
                path={`${match.url}/products`}
                render={props => <Product {...props} />}
              />
              <Route
                path={`${match.url}/product-sets/:id`}
                render={props => <ProductSet {...props} />}
              />
              <Route
                path={`${match.url}/product-sets`}
                render={props => <ProductSets {...props} />}
              />
              <Route
                path={`${match.url}/cate-sets/:id`}
                render={props => <CateSet {...props} />}
              />
              <Route
                path={`${match.url}/cate-sets`}
                render={props => <CateSets {...props} />}
              />
              <Route
                path={`${match.url}/list-cate`}
                render={props => <Category {...props} />}
              />
              <Route
                path={`${match.url}/edit-cate/:id`}
                render={props => <EditCategory {...props} />}
              />
              <Route
                path={`${match.url}/add-cate`}
                render={props => <EditCategory {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
