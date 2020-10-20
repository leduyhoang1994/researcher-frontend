import React, { Component, Fragment } from "react";
import { Row, Card, Label, Button, Input, CardBody } from "reactstrap";
import { NotificationManager } from "../../components/common/react-notifications";

import ApiController from '../../helpers/Api';
import { SELLER, ADDRESS, ACCOUNTS, SELLERS } from '../../constants/api';
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { injectIntl } from "react-intl";
import Select from "react-select";
import "./style.scss"

class SellerInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props?.match?.params.id || null,
            seller: {
                firstName: "",
                lastName: "",
                username: "",
                phoneNumber: "",
                email: "",
                address: "",
                company: "",
                password: "",
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
            typeInput: "password",
            accounts: [],
            selectedType: [],
            isLoading: true,
        };
        this.messages = this.props?.type === "modal" ? null : this.props.intl.messages;
        this.formRef = React.createRef();

    }

    componentDidMount() {
        this.getAddress();
        this.loadAccountType();
        let { id } = this.state;
        if (this.props?.sellerId !== undefined && this.props?.sellerId !== null) {
            id = this.props.sellerId;
            this.setState({ id })
        }

        if (this.props?.type !== "modal") {
            if (id) {
                this.loadUsers(id);
            } else {
                this.loadUsers();
            }
        } else if (id) {
            this.loadUsers(id);
        }
    }

    loadUsers = (id) => {
        if (id) {
            ApiController.get(`${SELLER.details}/${id}`, {}, data => {
                this.setState({
                    seller: data,
                    isLoading: false
                });
                this.defaultCity();
                this.defaultAccountType()
            });
        } else {
            ApiController.get(`${SELLER.details}`, {}, data => {
                this.setState({
                    seller: data,
                    id: data?.id,
                    isLoading: false
                });
                this.defaultCity()
                this.defaultAccountType()
            });
        }
    }

    loadAccountType = () => {
        ApiController.get(ACCOUNTS.all, {}, data => {
            let accounts = [];
            data.forEach(item => {
                accounts.push({ label: item.label, value: item.id })
            })
            this.setState({ accounts });
        });
    }

    defaultAccountType = () => {
        const { seller, accounts } = this.state;
        if (seller?.accountTypeId) {
            accounts.forEach(item => {
                if (item.value === seller.accountTypeId) {
                    this.setState({
                        selectedType: item
                    })
                }
            })
        }
    }

    defaultCity = () => {
        const { seller, optionsCity } = this.state;
        if (seller.city) {
            optionsCity.forEach(item => {
                if (item.label === seller.city) {
                    this.handleChangeCity(item);
                }
            })
            if (seller.district) {
                this.defaultDistrict()
            }
        }
    }

    defaultDistrict = () => {
        const { seller, optionsDistrict } = this.state;
        optionsDistrict.forEach(item => {
            if (item.label === seller.district) {
                this.handleChangeDistrict(item);
            }
        })
        if (seller.town) {
            this.defaultCommune()
        }
    }

    defaultCommune = () => {
        const { seller, optionsCommune } = this.state;
        optionsCommune.forEach(item => {
            if (item.label === seller.town) {
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
        address.forEach((item, index) => {
            let value = Object.keys(item)[0];
            options.push({ label: value, value: index });
        })
        this.setState({
            optionsCity: options
        })
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

        district.forEach((item, index) => {
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
        selectedDistrict.forEach(item => {
            if (Object.keys(item)[0] === district.label) {
                temp = Object.values(item)[0];
            }
        })

        temp.forEach((value, index) => {
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
        const { seller } = this.state;
        seller[e.target.name] = e.target.value;
        this.setState({
            seller
        })
    }

    submitChangeType = () => {
        const { id, selectedType } = this.state;
        const data = { sellerId: id, accountTypeId: selectedType.value }
        console.log(data);
        ApiController.callAsync('put', SELLER.type, data)
            .then(data => {
                console.log(data);
                NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
            }).catch(error => {
                NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
            });
    }

    validateField = async () => {
        const needToValidate = [{ firstName: "Họ" }, { lastName: "Tên" },
        { phoneNumber: "Số điện thoại" }, { email: "E-mail" },
        { password: "Mật khẩu" }, { confirmPassword: "Xác nhận mật khẩu" }]
        let success = true;
        for await (const field of needToValidate) {
            let fieldName = "", fieldValue = "";
            for (let key in field) {
                fieldName = key;
                fieldValue = field[key];
            }
            if ((this.state.seller[fieldName] || "") === "") {
                if ((fieldName === "password" || fieldName === "confirmPassword") && this.state.id) {
                } else {
                    success = false;
                    NotificationManager.error(`Trường ${fieldValue} cần phải nhập`);
                }
            }
        }
        return success;
    }

    createUser = async () => {
        if (await this.validateField()) {
            this.callApi();
        } else {
            return;
        }
    }

    callApi = () => {
        let flag = true, id = this.state.id || null;
        const { selectedCity, selectedDistrict, selectedCommune, selectedType } = this.state;
        let { seller } = this.state;
        if (flag) {
            if (selectedCity) {
                seller.city = selectedCity.label;
            }
            if (selectedDistrict) {
                seller.district = selectedDistrict.label;
            }
            if (selectedCommune) {
                seller.town = selectedCommune.label;
            }
            const { firstName, lastName, username, phoneNumber, email, city, district, town, address, company, password, confirmPassword } = seller;
            if (password !== "" && password === confirmPassword) {
                const data = { firstName, lastName, phoneNumber, email, city, district, town, address, company, password, confirmPassword, accountTypeId: selectedType.value };
                if (id) {
                    const obj = { ...data, id };
                    ApiController.callAsync('put', SELLER.admin, obj)
                        .then(data => {
                            NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
                        }).catch(error => {
                            NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
                        });
                } else {
                    const obj = { ...data, username };
                    ApiController.callAsync('post', SELLERS.register, obj)
                        .then(data => {
                            NotificationManager.success("Thêm mới thành công", "Thành công", 1500);
                        }).catch(error => {
                            NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
                        });
                }

            } else if (password !== "" && password !== confirmPassword) {
                NotificationManager.warning("Xác nhận mật khẩu không trùng mật khẩu", "Thông báo", 1500);
            }

        }
    }

    renderLoading = () => {
        return (
            <div className="loading"></div>
        );
    }

    render() {
        const { seller, optionsCity, optionsDistrict, optionsCommune, typeInput, selectedCity, selectedDistrict, selectedCommune, selectedType, accounts } = this.state;
        const { firstName, lastName, username, phoneNumber, email, address, password, confirmPassword, company } = seller;

        if (this.state.isLoading) {
            return this.renderLoading();
        }

        return (
            <Fragment>
                <Card className="balance-row-in-body">
                    <CardBody >
                        <Row>
                            <Colxx xxs="12" md="12" className="mx-auto my-auto pb-3">
                                <h2>Thông tin tài khoản</h2>
                            </Colxx>
                        </Row>
                        <Row>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
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
                                        type="text"
                                        value={username || ""}
                                        name="username"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="user.userName" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
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
                                        type={typeInput}
                                        value={password || ""}
                                        name="password"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="Mật khẩu mới" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="has-float-label ">
                                    <Input
                                        type={typeInput}
                                        value={confirmPassword || ""}
                                        name="confirmPassword"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span >
                                        <IntlMessages id="Xác nhận mật khẩu" />
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="6">
                                <Label className="form-group has-float-label mb-4 w-80 d-inline-block">
                                    <Select
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        value={selectedType}
                                        options={accounts}
                                        onChange={e => {
                                            this.setState({
                                                selectedType: e
                                            })
                                        }}
                                    />
                                    <IntlMessages id="Loại tài khoản" />
                                </Label>
                                <span className="w-20 d-inline-block text-right">
                                    <Button
                                        className="button"
                                        color="primary"
                                        onClick={() => {
                                            this.submitChangeType();
                                        }}
                                    >
                                        Thay đổi
                                    </Button>
                                </span>
                            </Colxx>
                        </Row>

                        <div className="text-right mt-3">
                            <Button
                                className="button"
                                color="primary"
                                onClick={() => {
                                    this.createUser();
                                }}
                            >
                                {this.state.id ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </div>
                    </CardBody>
                </Card >
            </Fragment >
        );
    }
}

export default injectIntl(SellerInfo);
