import React, { Component } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Input, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { registerSeller, registerSellerError } from "../../redux/auth/actions";

import { NotificationManager } from "../../components/common/react-notifications";
import IntlMessages from "../../helpers/IntlMessages";
import { Colxx } from "../../components/common/CustomBootstrap";
import { Formik, Form, Field } from "formik";
import Select from 'react-select';
import address from '../../data/address.json';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "Tony",
      lastName: "Stark",
      userName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      optionsCity: [],
      optionsDistrict: [],
      optionsCommune: [],
      selectedCity: null,
      selectedDistrict: null,
      selectedCommune: null,
      address: "",
    };
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    this.getCities();
  }

  getCities = () => {
    let options = [];
    for (var i = 0; i < 63; i++) {
      let city = Object.keys(address)[i];
      options.push({ label: city, value: i });
    }
    this.setState({
      optionsCity: options
    })
  }

  handleChangeCity = selectedCity => {
    this.setState({
      optionsDistrict: [],
      optionsCommune: [],
    })

    let options = [];
    this.setState({ selectedDistrict: null });
    this.setState({ selectedCommune: null });
    this.setState({ selectedCity });

    const index = selectedCity.value;
    let district = Object.values(address)[index];

    for (var i = 0; i < 100; i++) {
      let temp = Object.keys(district)[i];
      if (temp) {
        options.push({ label: temp, value: i });
      }
    }
    this.setState({
      optionsDistrict: options,
    })
  };

  handleChangeDistrict = selectedDistrict => {
    this.setState({
      optionsCommune: [],
    })

    let options = [];
    this.setState({ selectedCommune: null });
    this.setState({ selectedDistrict });
    const index = this.state.selectedCity.value;

    let district = Object.values(address)[index];
    let temp = district[selectedDistrict.label];

    temp.map((value, index) => {
      options.push({ label: value, value: index });
    })

    this.setState({
      optionsCommune: options,
    })
  };

  handleChangeCommune = selectedCommune => {
    this.setState({ selectedCommune });
  };

  onSellerRegister = (values) => {
    const { email, password, confirmPassword } = values;
    const { firstName, lastName, userName, phone } = this.state;
    let { selectedCity, selectedDistrict, selectedCommune } = this.state;
    if (selectedCity) selectedCity = selectedCity.label;
    if (selectedDistrict) selectedDistrict = selectedDistrict.label;
    if (selectedCommune) selectedCommune = selectedCommune.label;
    const data = { firstName, lastName, userName, phone, email, password, confirmPassword, selectedCity, selectedDistrict, selectedCommune }
    console.log(data);
    if (data.userName !== "" && data.phone !== "" && data.password !== "" && data.confirmPassword !== "") {
      this.props.registerSeller(data, this.props.history);
    }
  }

  validateEmail = (value) => {
    let error;
    if (value) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        error = "Invalid email address";
      }
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
      console.log("Error: " + JSON.stringify(this.props.error));
      NotificationManager.warning(
        this.props.error.message,
        "Register Error",
        3000,
        null,
        null,
        ''
      );
    }
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      ...this.state,
      [event.target.name]: value
    });
  }

  render() {
    const { email, password, confirmPassword, optionsCity, optionsDistrict, optionsCommune, selectedDistrict, selectedCommune, address } = this.state;
    const { selectedCity } = this.state.optionsCity;
    const initialValues = { email, password, confirmPassword };

    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className="text-white h2">Seller</p>
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
                onSubmit={this.onSellerRegister}>
                {({ errors, touched }) => (
                  <Form>
                    <Row className="h-100">
                      <Colxx xxs="6">
                        <Label className="form-group has-float-label mb-4">
                          <Input type="name" name="firstName" onChange={this.handleChange} defaultValue={this.state.firstName} />
                          <IntlMessages id="user.firstName" />
                        </Label>

                        <Label className="form-group has-float-label mb-4">
                          <Input type="name" name="userName" onChange={this.handleChange} defaultValue={this.state.userName} />
                          <IntlMessages id="user.userName" />
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
                      </Colxx>

                      <Colxx xxs="6">
                        <Label className="form-group has-float-label mb-4">
                          <Input type="name" name="lastName" onChange={this.handleChange} defaultValue={this.state.lastName} />
                          <IntlMessages id="user.lastName" />
                        </Label>

                        <Label className="form-group has-float-label mb-4">
                          <Input type="name" name="phone" required onChange={this.handleChange} defaultValue={this.state.phone} />
                          <IntlMessages id="user.phone" />
                        </Label>

                        <Label className="form-group has-float-label mb-4">
                          <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            value={selectedCity}
                            onChange={this.handleChangeCity}
                            options={optionsCity}
                          />
                          <IntlMessages id="user.city" />
                        </Label>

                        <Label className="form-group has-float-label mb-4">
                          <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            value={selectedDistrict}
                            onChange={this.handleChangeDistrict}
                            options={optionsDistrict}
                          />
                          <IntlMessages id="user.district" />
                        </Label>

                        <Label className="form-group has-float-label mb-4">
                          <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            value={selectedCommune}
                            onChange={this.handleChangeCommune}
                            options={optionsCommune}
                          />
                          <IntlMessages id="user.commune" />
                        </Label>

                        <Label className="form-group has-float-label mb-4">
                          <Input type="name" name="address" onChange={this.handleChange} defaultValue={address} />
                          <IntlMessages id="user.address" />
                        </Label>

                      </Colxx>
                    </Row>

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
    registerSeller,
    registerSellerError,
  }
)(Register);
