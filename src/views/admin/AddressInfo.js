import React, { Component, Fragment } from "react";
import { Row, Card, Label, Button, CardBody, CustomInput } from "reactstrap";
import { NotificationManager } from "../../components/common/react-notifications";
import ApiController from '../../helpers/Api';
import { ADDRESS } from '../../constants/api';
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { injectIntl } from "react-intl";
import Select from "react-select";
import "./style.scss"

class AddressInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            store: [],
            interCity: [],
            optionsCity: [],
            addressType: [],
            isChecked: false,
            selectedCity: null,
            selectedDistrict: null,
            optionsDistrict: [],
            isLoading: true,
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getAddress();
        this.getAddressType();
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

    getAddressType = () => {
        ApiController.get(ADDRESS.type, {}, data => {
            data.forEach(item => {
                if (item.code === "INSIDECITY") {
                    item.name = "Nội thành"
                }
                if (item.code === "OUTSIDECITY") {
                    item.name = "Ngoại thành"
                }
                if (item.code === "DISTRICT") {
                    item.name = "Huyện xã"
                }
                if (item.code === "INTERCITY") {
                    item.name = "Liên tỉnh"
                }
            })
            this.setState({
                addressType: data
            })
        });
    }

    getCities = () => {
        let options = [], store = [], interCity = [];
        const { address } = this.state;
        address.forEach((item, index) => {
            let value = Object.keys(item)[0];
            if (item.type === "INTERCITY") {
                interCity.push({ label: value, value: index })
            } else {
                store.push({ label: value, value: index })
            }
            options.push({ label: value, value: index });
        })
        this.setState({
            optionsCity: options,
            interCity,
            store
        })
    }

    handleChangeCity = city => {
        let options = [];
        this.setState({
            optionsDistrict: [],
            selectedDistrict: null,
            selectedCity: city
        })

        const index = city.value;
        const selectedCity = this.state.address[index];
        const district = Object.values(selectedCity)[0];

        district.forEach((item, index) => {
            let value = Object.keys(item)[0];
            options.push({ label: value, value: index, radius: "", type: item.type });
        })

        this.setState({
            optionsDistrict: options,
        })
    };

    handleChangeDistrict = e => {
        const { addressType } = this.state;
        addressType.forEach(item => {
            if (item.code === e?.type) {
                e.radius = item.name;
            }
        })
        this.setState({
            selectedDistrict: e
        })
    }

    changeRadius = (e) => {
        console.log(e.target.id);
    }

    handleChangeInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    validateFields = () => {
        const { isChecked, selectedCity, selectedDistrict } = this.state;
        if(selectedCity === null) {
            NotificationManager.warning("Yêu cầu chọn tỉnh / thành phố", "Thông báo", 1500);
            return true;
        } else if(isChecked && selectedDistrict === null) {
            NotificationManager.warning("Yêu cầu chọn quận / huyện", "Thông báo", 1500);
            return true;
        } else if(isChecked && (selectedDistrict?.radius || "") === "") {
            NotificationManager.warning("Yêu cầu loại hình địa chỉ", "Thông báo", 1500);
            return true;
        }
        return false;
    }

    updateAddress = () => {
        const { isChecked, selectedCity, selectedDistrict } = this.state;
        if(!this.validateFields()) {
            let data = { city: selectedCity.label, isUboxWarehouse: isChecked }
            if (isChecked) {
                data = {
                    ...data, districts: [
                        {
                            district: selectedDistrict.label,
                            type: selectedDistrict.type
                        }
                    ]
                }
            }
            ApiController.callAsync('put', ADDRESS.all, data)
                .then(data => {
                    NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
                    this.getAddress();
                }).catch(error => {
                    NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
                });
        }
    }

    renderLoading = () => {
        return (
            <div className="loading"></div>
        );
    }

    render() {
        const { isChecked, optionsCity, selectedCity, optionsDistrict, selectedDistrict, addressType, interCity, store } = this.state;

        if (this.state.isLoading) {
            return this.renderLoading();
        }

        return (
            <Fragment>
                <Card className="balance-row-in-body">
                    <CardBody >
                        <Row>
                            <Colxx xxs="12" md="12" className="mx-auto my-auto pb-3">
                                <h2>Cấu hình địa chỉ</h2>
                            </Colxx>
                        </Row>
                        <Row>
                            <Colxx xxs="12">
                                <Label className="form-group has-float-label mb-2">
                                    <Select
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        value={selectedCity}
                                        onChange={this.handleChangeCity}
                                        options={optionsCity}
                                    />
                                    <IntlMessages id="Chọn tỉnh / thành phố *" />
                                </Label>
                            </Colxx>
                            <Colxx xxs="12" >
                                <CustomInput
                                    id="custom-input-store"
                                    className="mb-0"
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                        this.setState({
                                            isChecked: !isChecked
                                        })
                                    }}
                                    label="Là kho"
                                />
                            </Colxx>
                            {
                                isChecked ? (
                                    <Colxx xxs="12" className="mt-4">
                                        <p><b>Thông tin quận / huyện</b></p>
                                        <Label className="form-group has-float-label mt-3">
                                            <Select
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                value={selectedDistrict}
                                                options={optionsDistrict}
                                                onChange={event => {
                                                    this.handleChangeDistrict(event);
                                                }}
                                            />
                                            <IntlMessages id="Chọn quận / huyện *" />
                                        </Label>
                                        {
                                            selectedDistrict ? (
                                                <div className="mt-4">
                                                    <p className="w-40 d-inline-block">{selectedDistrict.label}</p>
                                                    <div className="w-60 d-inline-block">
                                                        {
                                                            addressType.map((item, index) => {
                                                                return (
                                                                    <CustomInput
                                                                        key={index}
                                                                        type="radio"
                                                                        name="radiusRadio"
                                                                        id={item.name}
                                                                        label={item.name}
                                                                        inline
                                                                        checked={selectedDistrict.radius === item.name ? true : false}
                                                                        onChange={(e) => {
                                                                            let district = selectedDistrict
                                                                            district.radius = e.target.id;
                                                                            district.type = item.code;
                                                                            this.setState({
                                                                                selectedDistrict: district
                                                                            })
                                                                        }}
                                                                    />
                                                                )

                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            ) : (<></>)
                                        }
                                    </Colxx>
                                ) : (<></>)
                            }
                        </Row>
                        <div className="text-right mt-3">
                            <Button
                                className="button"
                                color="primary"
                                onClick={() => {
                                    this.updateAddress();
                                }}
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </CardBody>
                </Card>
                <Card className="mt-4">
                    <CardBody >
                        <h2 className="">Thống kê</h2>
                        <Row>
                            <Colxx xxs="2" className="mt-3">
                                <span className="vertical-align-middle">Kho: </span>
                            </Colxx>
                            <Colxx xxs="10" className="mt-3">
                                {
                                    store && store.map((item, index) => {
                                        return (
                                            <span key={item + index}
                                                id={`${item.label}`}
                                                onClick={() => {
                                                    this.handleChangeCity(item)
                                                }}
                                                className="constants height-40 align-middle"
                                            >
                                                {item.label}
                                            </span>
                                        )
                                    })
                                }
                            </Colxx>
                            <Colxx xxs="2" className="mt-3">
                                <span className="vertical-align-middle">Liên tỉnh: </span>
                            </Colxx>
                            <Colxx xxs="10" className="mt-3">
                                {
                                    interCity && interCity.map((item, index) => {
                                        return (
                                            <span key={item + index}
                                                id={`${item.label}`}
                                                onClick={() => {
                                                    this.handleChangeCity(item)
                                                }}
                                                className="constants height-40 align-middle"
                                            >
                                                {item.label}
                                            </span>
                                        )
                                    })
                                }
                            </Colxx>
                        </Row>
                    </CardBody>
                </Card>
            </Fragment >
        );
    }
}

export default injectIntl(AddressInfo);
