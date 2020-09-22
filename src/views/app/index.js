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

const SourceProduct = React.lazy(() =>
  import(/* webpackChunkName: "product" */ './source-product')
);

const SourceProductSets = React.lazy(() =>
  import(/* webpackChunkName: "source-product-set" */ './source-product-set')
);

const SourceProductSet = React.lazy(() =>
  import(/* webpackChunkName: "source-product-set" */ './source-product-set/SourceProductSets')
);

const SourceCategorySet = React.lazy(() =>
  import(/* webpackChunkName: "source-product-set" */ './source-category-set')
);

const SourceCategorySets = React.lazy(() =>
  import(/* webpackChunkName: "source-product-set" */ './source-category-set/SourceCategorySets')
);

const UboxCategories = React.lazy(() =>
  import(/* webpackChunkName: "source-product-set" */ './ubox-category/EditUboxCategories')
);

const EditUboxCategories = React.lazy(() =>
  import(/* webpackChunkName: "source-product-set" */ './ubox-category/EditUboxCategories')
);

const EditUboxProducts = React.lazy(() =>
  import(/* webpackChunkName: "source-product-set" */ './ubox-product/EditUboxProducts')
);

const UboxProducts = React.lazy(() =>
  import(/* webpackChunkName: "source-product-set-123" */ './ubox-product/UboxProducts')
);

class App extends Component {
  render() {
    const { match } = this.props;
    // const userDetails = JSON.parse(localStorage.getItem("user_details"));
    // const role = userDetails.roles && userDetails.roles[0];
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
                path={`${match.url}/source-products`}
                render={props => <SourceProduct {...props} />}
              />
              <Route
                path={`${match.url}/source-product-sets/:id`}
                render={props => <SourceProductSet {...props} />}
              />
              <Route
                path={`${match.url}/source-product-sets`}
                render={props => <SourceProductSets {...props} />}
              />
              <Route
                path={`${match.url}/source-category-sets/:id`}
                render={props => <SourceCategorySets {...props} />}
              />
              <Route
                path={`${match.url}/source-category-sets`}
                render={props => <SourceCategorySet {...props} />}
              />
              <Route
                path={`${match.url}/ubox-categories/edit/:id`}
                render={props => <EditUboxCategories {...props} />}
              />
              <Route
                path={`${match.url}/ubox-categories/add`}
                render={props => <EditUboxCategories {...props} />}
              />
              <Route
                path={`${match.url}/ubox-categories`}
                render={props => <UboxCategories {...props} />}
              />
              <Route
                path={`${match.url}/ubox-products/edit/:id`}
                render={props => <EditUboxProducts {...props} />}
              />
              <Route
                path={`${match.url}/ubox-products/edit`}
                render={props => <EditUboxProducts {...props} />}
              />
              <Route
                path={`${match.url}/ubox-products/add`}
                render={props => <EditUboxProducts {...props} />}
              />
              <Route
                path={`${match.url}/ubox-products/:search`}
                render={props => <UboxProducts {...props} />}
              />
              <Route
                path={`${match.url}/ubox-products`}
                render={props => <UboxProducts {...props} />}
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
