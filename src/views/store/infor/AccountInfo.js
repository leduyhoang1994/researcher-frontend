import React, { Component, Fragment } from "react";
import { Row, Card, Label, Button, Input, CardBody } from "reactstrap";
import { NotificationManager } from "../../../components/common/react-notifications";

import ApiController from '../../../helpers/Api';
import { SELLER, ADDRESS, ADDRESS_ORDER } from '../../../constants/api';
import { Colxx } from "../../../components/common/CustomBootstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { injectIntl } from "react-intl";
import Select from "react-select";
import ConfirmButton from "../../../components/common/ConfirmButton";
import "./style.scss";
import CreateAddressModals from "../cart/CreateAddressModals";

class AccountInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props?.match?.params.id || null,
            address: [],
            seller: {
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
            typeInput: "password",
            isOpenUserModal: false,
            isOpenCreateAddress: false,
            optionAddress: [],
            selectedAddress: [],
        };
        this.messages = this.props?.type === "modal" ? null : this.props.intl.messages;
        this.toggleOpenUserModal = this.toggleOpenUserModal.bind(this);

    }

    componentDidMount() {
        this.getAddress();
        let { id } = this.state;
        if (this.props?.sellerId !== undefined && this.props?.sellerId !== null) {
            id = this.props.sellerId;
            this.setState({ id })
        }

        if (this.props?.type !== "modal") {
            if (id) {
                this.loadSellers(id);
            } else {
                this.loadSellers();
            }
        } else if (id) {
            this.loadSellers(id);
        }
        this.getSellerAddress();
    }

    toggleModalCreateAddress = () => {
        this.setState({
            isOpenCreateAddress: !this.state.isOpenCreateAddress
        });
    }

    toggleOpenUserModal() {
        this.setState({
            isOpenUserModal: !this.state.isOpenUserModal
        })
    }

    loadSellers = (id) => {
        if (id) {
            ApiController.get(`${SELLER.details}/${id}`, {}, data => {
                this.setState({ seller: data });
                this.defaultCity()
            });
        } else {
            ApiController.get(`${SELLER.details}`, {}, data => {
                this.setState({
                    seller: data,
                    id: data?.id
                });
                this.defaultCity()
            });
        }
    }

    getSellerAddress = () => {
        let optionAddress = [];
        ApiController.get(ADDRESS_ORDER.all, {}, data => {
            data.forEach(item => {
                let valueAddress = item.city + " " + item.district + " " + item.town + " " + item.address;
                optionAddress.push({ label: valueAddress, value: item.id })
            })
            this.setState({
                optionAddress
            })
        });
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
            this.setState({
                address: data
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

    submitChangePassword = () => {
        let id = null;
        if (this.state.id) {
            id = this.state.id;
        }
        const { passwordCheck, password, confirmPassword } = this.state.seller;
        const data = { id, passwordCheck, password, confirmPassword };
        console.log(data);
        ApiController.callAsync('put', SELLER.all, data)
            .then(data => {
                NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
            }).catch(error => {
                NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
            });
    }

    validateField = async () => {
        const needToValidate = [{ firstName: "Họ" }, { lastName: "Tên" },
        { phoneNumber: "Số điện thoại" }, { email: "E-mail" }, { passwordCheck: "Mật khẩu hiện tại" },
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

    updateSeller = async () => {
        if (await this.validateField()) {
            this.callApi();
        } else {
            return;
        }
    }

    callApi = () => {
        let id = this.state.id || null;
        const { selectedCity, selectedDistrict, selectedCommune } = this.state;
        let { seller } = this.state;
        if (selectedCity) {
            seller.city = selectedCity.label;
        }
        if (selectedDistrict) {
            seller.district = selectedDistrict.label;
        }
        if (selectedCommune) {
            seller.town = selectedCommune.label;
        }
        const { firstName, lastName, phoneNumber, email, city, district, town, address, passwordCheck, company } = seller;
        const data = { id, firstName, lastName, phoneNumber, email, city, district, town, address, passwordCheck, company };

        console.log(data);
        ApiController.callAsync('put', SELLER.all, data)
            .then(data => {
                NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
            }).catch(error => {
                if (error.response.status === 401) {
                    NotificationManager.warning("Mật khẩu không chính xác", "Thất bại", 1500);
                } else {
                    NotificationManager.warning(error.response?.data?.message, "Thất bại", 1500);
                }
            });
    }

    render() {
        const { seller, optionsCity, optionsDistrict, optionsCommune, typeInput, selectedCity, selectedDistrict, selectedCommune } = this.state;
        const { firstName, lastName, phoneNumber, email, address, password, passwordCheck, confirmPassword, company } = seller;

        const isDisabled = (password && confirmPassword) ? ((password === confirmPassword) ? false : true) : true;
        const showChangePassword = (this.props?.type === "modal" && !this.state.id) ? false : true;

        return (
            <Fragment>
                <Card className="balance-row-in-body">
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
                                        type={typeInput}
                                        value={passwordCheck || ""}
                                        name="passwordCheck"
                                        onChange={(e) => {
                                            this.handleChangeInput(e)
                                        }}
                                    />
                                    <span>
                                        <IntlMessages id="Mật khẩu hiện tại *" />
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
                                <Label className="form-group has-float-label mb-4 w-80  d-inline-block">
                                    <Select
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={this.state.optionAddress}
                                        value={this.state.selectedAddress}
                                        onChange={(e) => {
                                            this.setState({
                                                selectedAddress: e
                                            })
                                        }}
                                    />
                                    <IntlMessages id="Danh sách địa chỉ giao hàng" />
                                </Label>
                                <span className="w-20 d-inline-block text-right">
                                    <Button
                                        className="button"
                                        color="primary"
                                        onClick={() => {
                                            this.toggleModalCreateAddress();
                                        }}
                                    >
                                        Tạo mới
                                    </Button>
                                </span>
                            </Colxx>
                        </Row>
                        <div className="text-right mt-3">
                            {
                                showChangePassword ? (
                                    <ConfirmButton
                                        isDisabled={isDisabled}
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
                                                        <Colxx xxs="12">
                                                            <Label className="has-float-label ">
                                                                <Input
                                                                    type={typeInput}
                                                                    value={passwordCheck || ""}
                                                                    name="passwordCheck"
                                                                    onChange={(e) => {
                                                                        this.handleChangeInput(e)
                                                                    }}
                                                                />
                                                                <span>
                                                                    <IntlMessages id="Mật khẩu hiện tại *" />
                                                                </span>
                                                            </Label>
                                                        </Colxx>
                                                        <Colxx xxs="12">
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
                                                                    <IntlMessages id="Mật khẩu mới *" />
                                                                </span>
                                                            </Label>
                                                        </Colxx>
                                                        <Colxx xxs="12">
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
                                                                    typeInput === "password" ? (
                                                                        this.setState({
                                                                            typeInput: "text"
                                                                        })
                                                                    ) : (
                                                                            this.setState({
                                                                                typeInput: "password"
                                                                            })
                                                                        )
                                                                }}
                                                            >
                                                                {typeInput === "password" ? "Hiển thị" : "Ẩn"}
                                                            </Button>
                                                        </Colxx>
                                                    </Row>
                                                </div>
                                            );
                                        }}
                                    />
                                ) : (<></>)
                            }
                            <Button
                                className="button"
                                color="primary"
                                onClick={() => {
                                    this.updateSeller();
                                }}
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </CardBody>
                </Card >
                <CreateAddressModals
                    key={this.state.isOpenCreateAddress + "address"}
                    isOpen={this.state.isOpenCreateAddress}
                    toggleModalCreateAddress={this.toggleModalCreateAddress}
                    getSellerAddress={this.getSellerAddress}
                />
            </Fragment >
        );
    }
}

export default injectIntl(AccountInfo);
