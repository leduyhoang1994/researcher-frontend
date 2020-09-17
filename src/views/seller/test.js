import React, { Component } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button, Input } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import { Formik, Form, Field } from "formik";
import { validateName, validatePassword } from '../../helpers/Validate';
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  onSellerLogin = (values) => {
    const username = this.state.username;
    if (!this.props.loading) {
      if (username !== "" && values.password !== "") {
        const password = values.password;
        const data = { username, password }
        this.props.loginSeller(data, this.props.history);
      }
    }
  }



  render() {
    const { password, username } = this.state;
    const initialValues = { username, password };

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">Seller</p>
              <p className="white mb-0">
                Vui lòng sử dụng "số điện thoại@lamita.vn" để đăng nhập
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.login-title" />
              </CardTitle>

              <Formik
                initialValues={initialValues}
                onSubmit={this.onSellerLogin}>
                {({ errors, touched }) => (
                  <>
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.userName" />
                      </Label>
                      <Field
                        className="form-control"
                        type="name"
                        name="username"
                        validate={validateName}
                      />
                      {errors.username && touched.username && (
                        <div className="invalid-feedback d-block">
                          {errors.username}
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
                      <NavLink to={`/seller/register`}>
                        <IntlMessages id="Đăng ký tài khoản" />
                      </NavLink>
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

                  </>
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

export default Test;
