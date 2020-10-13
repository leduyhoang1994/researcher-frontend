import React, { Component, Fragment } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button, Input, CardBody } from "reactstrap";
import { connect } from "react-redux";

import { NotificationManager } from "../../components/common/react-notifications";

import ApiController from '../../helpers/Api';
import { USER, ROLES, ADDRESS } from '../../constants/api';
import { loginUser } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import UserTables from "./UserTables";
import { injectIntl } from "react-intl";
import ConfirmButton from "../../components/common/ConfirmButton";
import Select from "react-select";
import "./style.scss"

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props?.match?.params.id || null,
            user: {
                firstName: "",
                lastName: "",
                phoneNumber: "",
                email: "",
                address: "",
                company: "",
                password: "",
                confirmPassword: "",
                selectedCity: null,
                selectedDistrict: null,
                selectedCommune: null,
            },
            roles: [],
            optionsCity: [],
            optionsDistrict: [],
            optionsCommune: [],
        };
        this.messages = this.props.isPopup ? null : this.props.intl.messages;
    }

    componentDidMount() {
        if (this.state.id) {
            this.loadUsers(this.state.id);
        }
        this.getAddress();
    }

    loadUsers = (id) => {
        console.log(id);
        ApiController.get(`${USER.details}/${id}`, {}, data => {
            this.setState({ user: data });
        });
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

        let user = this.state.user;
        let options = [];

        user.selectedCity = selectedCity;
        user.selectedDistrict = null;
        user.selectedCommune = null;

        this.setState({
            user: user
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
        let user = this.state.user;
        user.selectedDistrict = selectedDistrict;
        user.selectedCommune = null;

        this.setState({
            user: user
        });

        const index = user.selectedCity.value;

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
        let user = this.state.user;
        user.selectedCommune = selectedCommune;
        this.setState({ user: user });
    };

    handleChangeInput = (e) => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        })
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
        } else if (value.length < 4) {
            error = "Value must be longer than 3 characters";
        }
        return error;
    }

    componentDidUpdate() {
        if (this.props.error) {
            NotificationManager.warning(
                "Email or password is incorrect!",
                "Login Error",
                3000,
                null,
                null,
                ''
            );
        }
    }

    createUser = () => {
        console.log(this.state);
    }

    render() {
        const { user, optionsCity, optionsDistrict, optionsCommune } = this.state;
        const { firstName, lastName, phoneNumber, email, address, password, confirmPassword, company, selectedCity, selectedDistrict, selectedCommune } = user;

        return (
            <Fragment>
                <Card >
                    <CardBody>
                        <Row>
                            <Colxx xxs="12" md="12" className="mx-auto my-auto pb-3">
                                <h2>Thông tin tài khoản</h2>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        className=""
                                        type="text"
                                        value={firstName || ""}
                                        name="firstName"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="user.firstName" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        className=""
                                        type="text"
                                        value={lastName  || ""}
                                        name="lastName"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="user.lastName" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        className=""
                                        type="text"
                                        value={phoneNumber || ""}
                                        name="phoneNumber"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="user.phoneNumber" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        className=""
                                        type="text"
                                        value={email || ""}
                                        name="email"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="user.email" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
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
                            </Colxx>

                            <Colxx xxs="6">
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
                            </Colxx>
                            <Colxx xxs="6">
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
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        className=""
                                        type="text"
                                        value={address || ""}
                                        name="address"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="user.address" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        className=""
                                        type="text"
                                        value={company || ""}
                                        name="company"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="Công ty" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        className=""
                                        type="password"
                                        value={password || ""}
                                        name="password"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="Mật khẩu mới *" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        className=""
                                        type="password"
                                        value={password || ""}
                                        name="password"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="Mật khẩu hiện tại *" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        className=""
                                        type="password"
                                        value={confirmPassword || ""}
                                        name="confirmPassword"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="user.confirmPassword" />
                                    </span>
                                </Label>
                            </Colxx>
                        </Row>
                        {
                            !this.props.isPopup ?
                                (
                                    <div className="text-right mt-3">
                                        <Button
                                            className="button"
                                            color="primary"
                                            onClick={() => {
                                                this.createUser();
                                            }}
                                        >
                                            Cập nhật
                                        </Button>
                                    </div>
                                )
                                : (<></>)
                        }
                    </CardBody>
                </Card >
            </Fragment >
        );
    }
}
const mapStateToProps = ({ authUser }) => {
    const { user, loading, error } = authUser;
    return { user, loading, error };
};

export default injectIntl(connect(
    mapStateToProps,
    {
        loginUser
    }
)(Admin));
