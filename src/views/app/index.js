import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

const Research = React.lazy(() =>
  import(/* webpackChunkName: "research" */ './research')
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
