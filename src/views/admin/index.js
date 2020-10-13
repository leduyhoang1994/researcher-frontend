import React, { Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import AppLayout from '../../layout/AppLayout';

const Admin = React.lazy(() =>
  import(/* webpackChunkName: "admin" */ './Admin')
);
const UserLists = React.lazy(() =>
  import(/* webpackChunkName: "list-user" */ './UserLists')
);

const User = ({ match }) => {
  return (
    <AppLayout>
      <Suspense fallback={<div className="loading" />}>
        <Switch>
          <Redirect exact from={`${match.url}/`} to={`/user/login`} />
          <Route
            path={`${match.url}/users`}
            render={props => <UserLists {...props} />}
          />
          <Route
            path={`${match.url}/:id`}
            render={props => <Admin {...props} />}
          />
          <Route
            path={`${match.url}`}
            render={props => <Admin {...props} />}
          />
          <Redirect to="/error" />
        </Switch>
      </Suspense>
    </AppLayout>
  );
};

export default User;
