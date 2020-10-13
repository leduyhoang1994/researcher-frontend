import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import './helpers/Firebase';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import NotificationContainer from './components/common/react-notifications/NotificationContainer';
import { isMultiColorActive, isDemo } from './constants/defaultValues';
import { getDirection } from './helpers/Utils';

Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}

const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './views')
);
const ViewApp = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './views/app')
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/user')
);
const ViewSeller = React.lazy(() =>
  import(/* webpackChunkName: "views-seller" */ './views/seller')
);
const ViewStore = React.lazy(() =>
  import(/* webpackChunkName: "views-store" */ './views/store')
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/error')
);
const ViewCalculator = React.lazy(() =>
  import(/* webpackChunkName: "views-calculator" */ './views/calculator')
);
const ViewAdmin = React.lazy(() =>
  import(/* webpackChunkName: "views-admin" */ './views/admin')
);

const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authUser || isDemo ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/user/login',
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: []
    }
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }

  componentWillMount() {
    console.log("start get user_details");
    let roles = undefined;
    let userDetails = localStorage.getItem("user_details");
    userDetails = userDetails ? JSON.parse(userDetails) : null;
    if (userDetails) {
      roles = userDetails.authUser?.role
    }
    this.setState({
      roles
    })
    console.log(roles);
  }

  renderRoleAdmin = () => {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];
    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <React.Fragment>
            <NotificationContainer />
            {isMultiColorActive && <ColorSwitcher />}
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <AuthRoute
                    path="/app"
                    authUser={loginUser}
                    component={ViewApp}
                  />
                  <Route
                    path="/admin"
                    render={props => <ViewAdmin {...props} />}
                  />
                  <Route
                    path="/user"
                    render={props => <ViewUser {...props} />}
                  />
                  <Route
                    path="/seller"
                    render={props => <ViewSeller {...props} />}
                  />
                  <Route
                    path="/store"
                    render={props => <ViewStore {...props} />}
                  />
                  <Route
                    path="/calculator"
                    render={props => <ViewCalculator {...props} />}
                  />
                  <Route
                    path="/error"
                    exact
                    render={props => <ViewError {...props} />}
                  />
                  <Route
                    path="/"
                    exact
                    render={props => <ViewMain {...props} />}
                  />
                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
      </div >
    )
  }

  renderRoleUser = () => {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];

    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <React.Fragment>
            <NotificationContainer />
            {isMultiColorActive && <ColorSwitcher />}
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <AuthRoute
                    path="/app"
                    authUser={loginUser}
                    component={ViewApp}
                  />
                  <Route
                    path="/user"
                    render={props => <ViewUser {...props} />}
                  />
                  <Route
                    path="/seller"
                    render={props => <ViewSeller {...props} />}
                  />
                  <Route
                    path="/store"
                    render={props => <ViewStore {...props} />}
                  />
                  <Route
                    path="/calculator"
                    render={props => <ViewCalculator {...props} />}
                  />
                  <Route
                    path="/error"
                    exact
                    render={props => <ViewError {...props} />}
                  />
                  <Route
                    path="/"
                    exact
                    render={props => <ViewMain {...props} />}
                  />
                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
      </div >
    )
  }

  renderRoleSeller = () => {
    const { locale } = this.props;
    const currentAppLocale = AppLocale[locale];

    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <React.Fragment>
            <NotificationContainer />
            {isMultiColorActive && <ColorSwitcher />}
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <Route
                    path="/seller"
                    render={props => <ViewSeller {...props} />}
                  />
                  <Route
                    path="/store"
                    render={props => <ViewStore {...props} />}
                  />
                  <Redirect to="/store" />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
      </div >
    )
  }


  render() {
    const { roles } = this.state;
    if (typeof roles === "undefined") {
      console.log("roles undefined");
      return this.renderRoleUser();
    } else if (roles.length > 0) {
      return (
        <>
          { roles.includes("admin") ? this.renderRoleAdmin() : this.renderRoleUser()}
        </>
      )
    } else {
      return this.renderRoleSeller();
    }
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { user: loginUser } = authUser;
  const { locale } = settings;
  return { loginUser, locale };
};
const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
