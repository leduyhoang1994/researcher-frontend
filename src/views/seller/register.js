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
import { validateName, validatePassword, validateEmailNoRequired, validatePhone } from '../../helpers/Validate';
import ApiController from "../../helpers/Api";
import { ADDRESS } from "../../constants/api";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: {},
      seller: {
        firstName: "",
        lastName: "",
        userName: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: ""
      },
      optionsCity: [],
      optionsDistrict: [],
      optionsCommune: [],
    };
  }

  componentDidMount() {
    this.getAddress();
  }

  getAddress = () => {
    ApiController.get(ADDRESS.all, {}, data => {
      let address = data;
      delete address["city"];
      this.setState({
        address
      })
      this.getCities();
    });
  }

  getCities = () => {
    let options = [];
    const { address } = this.state;
    let cities = Object.keys(address);
    for (var i = 0; i < 63; i++) {
      let city = cities[i];
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

    let seller = this.state.seller;
    let options = [];

    seller.selectedCity = selectedCity;
    seller.selectedDistrict = null;
    seller.selectedCommune = null;

    this.setState({
      seller: seller
    });

    const index = selectedCity.value;
    let district = Object.values(this.state.address)[index];

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
    let seller = this.state.seller;
    seller.selectedDistrict = selectedDistrict;
    seller.selectedCommune = null;

    this.setState({
      seller: seller
    });

    const index = seller.selectedCity.value;

    let district = Object.values(this.state.address)[index];
    let temp = district[selectedDistrict.label];

    temp.map((value, index) => {
      options.push({ label: value, value: index });
    })

    this.setState({
      optionsCommune: options,
    })
  };

  handleChangeCommune = selectedCommune => {
    let seller = this.state.seller;
    seller.selectedCommune = selectedCommune;
    this.setState({ seller: seller });
  };

  onSellerRegister = (values) => {
    let city = "", district = "", town = "";
    const { firstName, lastName, userName, phoneNumber, email, password, confirmPassword, address } = values;
    const { selectedCity, selectedDistrict, selectedCommune } = this.state.seller;
    if (selectedCity) city = selectedCity.label;
    if (selectedDistrict) district = selectedDistrict.label;
    if (selectedCommune) town = selectedCommune.label;
    const data = { firstName, lastName, userName, phoneNumber, email, password, confirmPassword, city, district, town, address }
    if (data.firstName !== "" && data.lastName !== "" && data.userName !== "" && data.phoneNumber !== "" && data.password !== "" && data.confirmPassword !== "") {
      if (data.password === data.confirmPassword) {
        this.props.registerSeller(data, this.props.history);
      } else {
        NotificationManager.warning("Nhập lại mật khẩu không trùng mật khẩu", "Cảnh báo")
      }
    }
  }

  componentDidUpdate() {
    if (this.props.error) {
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

  render() {
    const { seller, optionsCity, optionsDistrict, optionsCommune } = this.state;
    const { firstName, lastName, userName, phoneNumber, email, password, confirmPassword, address } = seller;
    const initialValues = { firstName, lastName, userName, phoneNumber, email, password, confirmPassword, address };

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
                        <FormGroup className="form-group has-float-label">
                          <Label>
                            <IntlMessages id="user.firstName" />
                          </Label>
                          <Field
                            type="text"
                            className="form-control"
                            name="firstName"
                            validate={validateName}
                          />
                          {errors.firstName && touched.firstName && (
                            <div className="invalid-feedback d-block">
                              {errors.firstName}
                            </div>
                          )}
                        </FormGroup>

                        <FormGroup className="form-group has-float-label">
                          <Label>
                            <IntlMessages id="user.userName" />
                          </Label>
                          <Field
                            type="text"
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
                            <IntlMessages id="user.email_" />
                          </Label>
                          <Field
                            type="text"
                            className="form-control"
                            name="email"
                            validate={validateEmailNoRequired}
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
                            validate={validatePassword}
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
                            validate={validatePassword}
                          />
                          {errors.confirmPassword && touched.confirmPassword && (
                            <div className="invalid-feedback d-block">
                              {errors.confirmPassword}
                            </div>
                          )}
                        </FormGroup>
                        <FormGroup className="form-group has-float-label">
                          <Label>
                            <IntlMessages id="user.address" />
                          </Label>
                          <Field
                            type="text"
                            className="form-control"
                            name="address"
                          />
                          {errors.address && touched.address && (
                            <div className="invalid-feedback d-block">
                              {errors.address}
                            </div>
                          )}
                        </FormGroup>
                      </Colxx>

                      <Colxx xxs="6">
                        <FormGroup className="form-group has-float-label">
                          <Label>
                            <IntlMessages id="user.lastName" />
                          </Label>
                          <Field
                            type="text"
                            className="form-control"
                            name="lastName"
                            validate={validateName}
                          />
                          {errors.lastName && touched.lastName && (
                            <div className="invalid-feedback d-block">
                              {errors.lastName}
                            </div>
                          )}
                        </FormGroup>

                        <FormGroup className="form-group has-float-label">
                          <Label>
                            <IntlMessages id="user.phoneNumber" />
                          </Label>
                          <Field
                            type="text"
                            className="form-control"
                            name="phoneNumber"
                            validate={validatePhone}
                          />
                          {errors.phoneNumber && touched.phoneNumber && (
                            <div className="invalid-feedback d-block">
                              {errors.phoneNumber}
                            </div>
                          )}
                        </FormGroup>

                        <Label className="form-group has-float-label mb-4">
                          <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            value={seller.selectedCity}
                            onChange={this.handleChangeCity}
                            options={optionsCity}
                          />
                          <IntlMessages id="user.city" />
                        </Label>

                        <Label className="form-group has-float-label mb-4">
                          <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            value={seller.selectedDistrict}
                            onChange={this.handleChangeDistrict}
                            options={optionsDistrict}
                          />
                          <IntlMessages id="user.district" />
                        </Label>

                        <Label className="form-group has-float-label mb-4">
                          <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            value={seller.selectedCommune}
                            onChange={this.handleChangeCommune}
                            options={optionsCommune}
                          />
                          <IntlMessages id="user.commune" />
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
