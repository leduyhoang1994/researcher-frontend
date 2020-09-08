import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import StoreLayout from '../../layout/StoreLayout';

const HomePage = React.lazy(() =>
  import(/* webpackChunkName: "user-register" */ './homepage')
);

const User = ({ match }) => {
  return (
    <StoreLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
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
