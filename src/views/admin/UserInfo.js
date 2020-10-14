import React, { Component, Fragment } from "react";
import { Row, Card, Label, Button, Input, CardBody, Form, FormGroup } from "reactstrap";
import { connect } from "react-redux";
import { NotificationManager } from "../../components/common/react-notifications";

import ApiController from '../../helpers/Api';
import { USER, ADDRESS } from '../../constants/api';
import { loginUser } from "../../redux/actions";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { injectIntl } from "react-intl";
import Select from "react-select";
import "./style.scss"
import ConfirmButton from "../../components/common/ConfirmButton";
import { Field, Formik } from "formik";
import { validateEmail, validateName, validatePhone } from "../../helpers/Validate";

class UserInfo extends Component {
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
                passwordCheck: "",
                confirmPassword: "",
                city: "",
                district: "",
                town: ""
            },
            selectedCity: null,
            selectedDistrict: null,
            selectedCommune: null,
            optionsCity: [],
            optionsDistrict: [],
            optionsCommune: [],
            type: "password"
        };
        this.messages = this.props.isPopup ? null : this.props.intl.messages;
        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.getAddress();
        if (this.state.id) {
            this.loadUsers(this.state.id);
        } else {
            this.loadUsers();
        }
    }

    loadUsers = (id) => {
        if (id) {
            ApiController.get(`${USER.details}/${id}`, {}, data => {
                this.setState({ user: data });
                this.defaultCity()
            });
        } else {
            ApiController.get(`${USER.details}`, {}, data => {
                this.setState({ user: data });
                this.defaultCity()
            });
        }
    }

    defaultCity = () => {
        const { user, optionsCity } = this.state;
        if (user.city) {
            optionsCity.forEach(item => {
                if (item.label === user.city) {
                    this.handleChangeCity(item);
                }
            })
            if (user.district) {
                this.defaultDistrict()
            }
        }
    }

    defaultDistrict = () => {
        const { user, optionsDistrict } = this.state;
        optionsDistrict.forEach(item => {
            if (item.label === user.district) {
                this.handleChangeDistrict(item);
            }
        })
        if (user.town) {
            this.defaultCommune()
        }
    }

    defaultCommune = () => {
        const { user, optionsCommune } = this.state;
        optionsCommune.forEach(item => {
            if (item.label === user.town) {
                this.handleChangeCommune(item);
            }
        })
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
        address.map((item, index) => {
            let value = Object.keys(item)[0];
            options.push({ label: value, value: index });
        })
        this.setState({
            optionsCity: options
        })
    }

    getUserIdInLocalStorage = () => {
        let userDetails = localStorage.getItem("user_details");
        userDetails = userDetails ? JSON.parse(userDetails) : null;
        console.log(userDetails);
        if (userDetails) {
            return userDetails.id;
        }
        return null;
    }

    handleChangeCity = city => {
        let options = [];
        this.setState({
            optionsDistrict: [],
            optionsCommune: [],
            selectedDistrict: null,
            selectedCommune: null,
            selectedCity: city
        })

        const index = city.value;
        const selectedCity = this.state.address[index];
        const district = Object.values(selectedCity)[0];

        district.map((item, index) => {
            let value = Object.keys(item)[0];
            options.push({ label: value, value: index });
        })

        this.setState({
            optionsDistrict: options,
        })
    };

    handleChangeDistrict = district => {
        this.setState({
            optionsCommune: [],
            selectedCommune: null
        })

        let options = [];

        this.setState({
            selectedDistrict: district
        });

        const index = this.state.selectedCity.value;
        const selectedCity = this.state.address[index];
        const selectedDistrict = Object.values(selectedCity)[0];
        let temp = [];
        selectedDistrict.map(item => {
            if (Object.keys(item)[0] === district.label) {
                temp = Object.values(item)[0];
            }
        })

        temp.map((value, index) => {
            options.push({ label: value, value: index });
        })

        this.setState({
            optionsCommune: options,
        })
    };

    handleChangeCommune = commune => {
        this.setState({
            selectedCommune: commune
        });
    };

    handleChangeInput = (e) => {
        const { user } = this.state;
        user[e.target.name] = e.target.value;
        this.setState({
            user
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

    submitChangePassword = () => {
        let id = null;
        if(this.state.id) {
            id = this.state.id;
        } else {
            id = this.getUserIdInLocalStorage();
        }
        const { passwordCheck, password, confirmPassword } = this.state.user;
        const data = { id, passwordCheck, password, confirmPassword };
        console.log(data);
        ApiController.callAsync('put', USER.all, data)
            .then(data => {
                NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
            }).catch(error => {
                NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
            });
    }

    createUser = () => {
        let flag = true, id = null;
        if (this.state.id) {
            id = this.state.id;
        } else {
            id = this.getUserIdInLocalStorage();
        }
        const { selectedCity, selectedDistrict, selectedCommune } = this.state;
        let { user } = this.state;
        if (user.firstName === "" || user.firstName === null) {
            NotificationManager.error(`Trường Họ cần phải nhập`);
            flag = false;
        }
        if (user.lastName === "" || user.lastName === null) {
            NotificationManager.error(`Trường Tên cần phải nhập`);
            flag = false;
        }
        if (user.phoneNumber === "" || user.phoneNumber === null) {
            NotificationManager.error(`Trường Số điện thoại cần phải nhập`);
            flag = false;
        }

        if (flag) {
            if (selectedCity) {
                user.city = selectedCity.label;
            }
            if (selectedDistrict) {
                user.district = selectedDistrict.label;
            }
            if (selectedCommune) {
                user.town = selectedCommune.label;
            }
            const { firstName, lastName, phoneNumber, email, city, district, town, address, company } = user;
            const data = { id, firstName, lastName, phoneNumber, email, city, district, town, address, company };

            ApiController.callAsync('put', USER.all, data)
                .then(data => {
                    NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
                    setTimeout(() => {
                        window.open(`/info/${data.data.result.id}`, "_self")
                    }, 2000)
                }).catch(error => {
                    NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
                });
        }
    }

    render() {
        const { user, optionsCity, optionsDistrict, optionsCommune, type, selectedCity, selectedDistrict, selectedCommune } = this.state;
        const { firstName, lastName, phoneNumber, email, address, password, passwordCheck, confirmPassword, company } = user;

        return (
            <Fragment>
                <Card >
                    <CardBody>
                        <Row>
                            <Colxx xxs="12" md="12" className="mx-auto my-auto pb-3">
                                <h2>Thông tin tài khoản</h2>
                            </Colxx>
                        </Row>
                        <Row>
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
                                        value={lastName || ""}
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
                                        disabled
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
                            {/* <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        type="password"
                                        value={passwordCheck || ""}
                                        name="passwordCheck"
                                        onLoad={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="Mật khẩu *" />
                                    </span>
                                </Label>
                            </Colxx> */}
                        </Row>
                        {
                            !this.props.isPopup ?
                                (
                                    <div className="text-right mt-3">
                                        <ConfirmButton
                                            isDisabled={(password && confirmPassword) ? ((password === confirmPassword) ? false : true) : true}
                                            btnConfig={{ color: "warning", className: "mr-2" }}
                                            content={{
                                                close: "Đóng",
                                                confirm: "Xác nhận"
                                            }}
                                            onConfirm={() => {
                                                this.submitChangePassword();
                                            }}
                                            buttonContent={() => {
                                                return (
                                                    <>Đổi mật khẩu</>
                                                );
                                            }}
                                            confirmHeader={() => {
                                                return (
                                                    <>Thay đổi mật khẩu</>
                                                );
                                            }}
                                            closeOnConfirm={true}
                                            confirmContent={() => {
                                                return (
                                                    <div>
                                                        <Row id="popup-change-password">
                                                            {
                                                                !this.state.id ? (
                                                                    <Colxx xxs="12">
                                                                        <Label className="has-float-label ">
                                                                            <Input
                                                                                type={type}
                                                                                value={passwordCheck || ""}
                                                                                name="passwordCheck"
                                                                                onChange={(e) => {
                                                                                    this.handleChangeInput(e)
                                                                                }}
                                                                            />
                                                                            <span >
                                                                                <IntlMessages id="Mật khẩu hiện tại *" />
                                                                            </span>
                                                                        </Label>
                                                                    </Colxx>
                                                                ) : (<></>)
                                                            }
                                                            <Colxx xxs="12">
                                                                <Label className="has-float-label ">
                                                                    <Input
                                                                        type={type}
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
                                                            <Colxx xxs="12">
                                                                <Label className="has-float-label ">
                                                                    <Input
                                                                        type={type}
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
                                                            <Colxx xxs="12">
                                                                <Button
                                                                    size="xs"
                                                                    className="button"
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        type === "password" ? (
                                                                            this.setState({
                                                                                type: "text"
                                                                            })
                                                                        ) : (
                                                                                this.setState({
                                                                                    type: "password"
                                                                                })
                                                                            )
                                                                    }}
                                                                >
                                                                    {type === "password" ? "Hiển thị" : "Ẩn"}
                                                                </Button>
                                                            </Colxx>
                                                        </Row>
                                                    </div>
                                                );
                                            }}
                                        />
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
)(UserInfo));
