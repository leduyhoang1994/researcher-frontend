import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import AppLayout from '../../layout/AppLayout';

const Calculator = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './Calculator')
);
const Constants = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './Constants')
);
const Cal = ({ match }) => {
  return (
    <AppLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Route
            path={`${match.url}/edit/:id`}
            render={props => <Calculator {...props} />}
          />
          <Route
            path={`${match.url}/edit`}
            render={props => <Calculator {...props} />}
          />
          <Route
            path={`${match.url}/`}
            render={props => <Constants {...props} />}
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </AppLayout>
  );
};

export default Cal;
