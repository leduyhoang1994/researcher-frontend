import React, { Component } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser, registerUserError } from "../../redux/auth/actions";

import { NotificationManager } from "../../components/common/react-notifications";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";
import { Formik, Form, Field } from "formik";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "Tony",
      lastName: "Stark",
      email: "demo@gmail.com",
      password: "",
      confirmPassword: ""
    };
  }
  // onUserRegister(values) {
  //   if (this.state.firstName !== "" && this.state.lastName !== ""
  //     && this.state.email !== "" && this.state.password !== "" && this.state.confirmPassword !== "") {
  //     console.log("Pass here!");
  //     this.props.history.push("/");
  //     this.props.loginUser(values, this.props.history);
  //   }
  // }

  onUserRegister = (values) => {
    if (values.firstName !== "" && values.lastName !== ""
      && values.email !== "" && values.password !== "" && values.confirmPassword !== "") {
        this.props.registerUser(values, this.props.history);
    }
  }

  validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }

  validatePassword = (value) => {
    let error;
    if (!value) {
      error = "Please enter your password";
    } else if (value.length < 6) {
      error = "Value must be longer than 5 characters";
    }
    return error;
  }

  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.warning(
        "Email is existed, please try another!",
        "Register Error",
        3000,
        null,
        null,
        ''
      );
    }
  }

  render() {
    const { firstName, lastName, email, password, confirmPassword } = this.state;
    const initialValues = { firstName, lastName, email, password, confirmPassword };

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">Researcher</p>
              <p className="white mb-0">
                Please use this form to register. <br />
                If you are a member, please{" "}
                <NavLink to={`/user/login`} className="white">
                  login
                </NavLink>
                .
              </p>
            </div>
            <div className="form-side">
              <NavLink to={`/`} className="white">
                <span className="logo-single" />
              </NavLink>
              <CardTitle className="mb-4">
                <IntlMessages id="user.register" />
              </CardTitle>
              <Formik
                initialValues={initialValues}
                onSubmit={this.onUserRegister}>
                {({ errors, touched }) => (
                  <Form>
                    <Label className="form-group has-float-label mb-4">
                      <Input type="name" defaultValue={this.state.firstName} />
                      <IntlMessages id="user.firstName" />
                    </Label>
                    <Label className="form-group has-float-label mb-4">
                      <Input type="name" defaultValue={this.state.lastName} />
                      <IntlMessages id="user.lastName" />
                    </Label>

                    <FormGroup className="form-group has-float-label">
                      <Label className="form-group has-float-label mb-4">
                        <IntlMessages id="user.email" />
                      </Label>
                      <Field
                        className="form-control"
                        name="email"
                        validate={this.validateEmail}
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email}
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
                        validate={this.validatePassword}
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.confirmPassword" />
                      </Label>
                      <Field
                        className="form-control"
                        type="password"
                        name="confirmPassword"
                        validate={this.validatePassword}
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="invalid-feedback d-block">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </FormGroup>

                    <div className="d-flex justify-content-end align-items-center">
                      <Button
                        color="primary"
                        className="btn-shadow"
                        size="lg"
                      >
                        <IntlMessages id="user.register-button" />
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
    registerUser,
    registerUserError,
  }
)(Register);
