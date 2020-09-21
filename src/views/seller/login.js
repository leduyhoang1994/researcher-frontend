import React, { Component } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button, Input } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { loginSeller } from "../../redux/actions";
import { validateName, validatePassword } from '../../helpers/Validate';

import { NotificationManager } from "../../components/common/react-notifications";
import { Formik, Form, Field } from "formik";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: ""
    };
  }

  onSellerLogin = (values) => {
    if (!this.props.loading) {
      console.log(values);
      if (values.userName !== "" && values.password !== "") {
        const userName = values.userName;
        const password = values.password;
        const data = { userName, password }
        this.props.loginSeller(data, this.props.history);
      }
    }
  }

  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.warning(
        this.props.error,
        "Login Error",
        3000,
        null,
        null,
        ''
      );
    }
  }

  render() {
    const { password, userName } = this.state;
    const initialValues = { userName, password };

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">Seller</p>
              <p className="white mb-0">
                Vui lòng sử dụng tài khoản lamita để đăng nhập
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/store`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.login-title" />
              </CardTitle>

              <Formik
                initialValues={initialValues}
                onSubmit={this.onSellerLogin}>
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.userName" />
                      </Label>
                      <Field
                        className="form-control"
                        name="userName"
                        validate={validateName}
                      />
                      {errors.userName && touched.userName && (
                        <div className="invalid-feedback d-block">
                          {errors.userName}
                        </div>
                      )}
                    </FormGroup>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.password" />
                      </Label>
                      <Field
                        className="form-control"
                        type="password"
                        name="password"
                        validate={validatePassword}
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
                        </div>
                      )}
                    </FormGroup>
                    <div className="d-flex justify-content-between align-items-center">
                      {/* <NavLink to={`/user/forgot-password`}>
                        <IntlMessages id="user.forgot-password-question" />
                      </NavLink> */}
                      <Button
                        color="primary"
                        className={`btn-shadow btn-multiple-state ${this.props.loading ? "show-spinner" : ""}`}
                        size="lg"
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label"><IntlMessages id="user.login-button" /></span>
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading, error } = authUser;
  return { user, loading, error };
};

export default connect(
  mapStateToProps,
  {
    loginSeller
  }
)(Login);
