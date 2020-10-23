import React, { Component, Fragment } from "react";
import { Row, Card, Label, CardBody } from "reactstrap";
import { NotificationManager } from "../../../components/common/react-notifications";
import ApiController from '../../../helpers/Api';
import { ADDRESS } from '../../../constants/api';
import { Colxx } from "../../../components/common/CustomBootstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { injectIntl } from "react-intl";
import Select from "react-select";
import CityDetails from "./CityDetails";
import AddressStatistic from "./AddressStatistic";
import "../style.scss";

class AddressInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            store: [],
            interCity: [],
            optionsCity: [],
            addressType: [],
            isWarehouseChecked: false,
            selectedCity: null,
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
            })
            this.setState({
                addressType: data
            })
        });
    }

    getCities = () => {
        let optionsCity = [], store = [], interCity = [];
        const { address } = this.state;
        address.forEach((item, index) => {
            let value = Object.keys(item)[0];
            if (item.type === "INTERCITY") {
                interCity.push({ label: value, value: index, isWarehouseChecked: false })
                optionsCity.push({ label: value, value: index, isWarehouseChecked: false });
            } else {
                store.push({ label: value, value: index, isWarehouseChecked: true })
                optionsCity.push({ label: value, value: index, isWarehouseChecked: true });
            }
        })
        this.setState({
            optionsCity,
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
            isWarehouseChecked: city.isWarehouseChecked
        })
    };

    changeWarehouseChecked = () => {
        const { isWarehouseChecked, selectedCity } = this.state;
        this.setState({
            isWarehouseChecked: !isWarehouseChecked
        })
        if (selectedCity !== null) {
            let data = { city: selectedCity.label, isUboxWarehouse: !isWarehouseChecked }
            if(!isWarehouseChecked) {
                data = {...data, districts: []}
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
        const { isWarehouseChecked, optionsCity, selectedCity, optionsDistrict, addressType, interCity, store } = this.state;

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
                                <CityDetails
                                    key={selectedCity?.label+isWarehouseChecked}
                                    isWarehouseChecked={isWarehouseChecked}
                                    addressType={addressType}
                                    city={selectedCity?.label}
                                    districts={optionsDistrict}
                                    changeWarehouseChecked={this.changeWarehouseChecked}
                                />
                            </Colxx>
                        </Row>
                    </CardBody>
                </Card>
                <AddressStatistic 
                    store={store}
                    interCity={interCity}
                    handleChangeCity={this.handleChangeCity}
                />
            </Fragment >
        );
    }
}

export default injectIntl(AddressInfo);
