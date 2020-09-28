import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import StoreLayout from '../../layout/StoreLayout';

const Calculator = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './Calculator')
);
const Constants = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './Constants')
);
const Cal = ({ match }) => {
  return (
    <StoreLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Route
            path={`${match.url}/constants`}
            render={props => <Constants {...props} />}
          />
          <Route
            path={`${match.url}/`}
            render={props => <Calculator {...props} />}
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </StoreLayout>
  );
};

export default Cal;
