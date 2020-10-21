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

class AddressInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCity: null,
            selectedDistrict: null,
            selectedCommune: null,
            optionsCity: [],
            optionsDistrict: [],
            optionsCommune: [],
            isLoading: true,
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getAddress();
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
            this.setState({
                address,
                isLoading: false
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
        const {optionsCity, optionsDistrict, optionsCommune, typeInput, selectedCity, selectedDistrict, selectedCommune, selectedType, accounts } = this.state;

        if (this.state.isLoading) {
            return this.renderLoading();
        }

        return (
            <Fragment>
                <Card className="balance-row-in-body">
                    <CardBody >
                        <Row>
                            <Colxx xxs="12" md="12" className="mx-auto my-auto pb-3">
                                <h2>Thông tin địa chỉ</h2>
                            </Colxx>
                        </Row>
                        <Row>
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

export default injectIntl(AddressInfo);
