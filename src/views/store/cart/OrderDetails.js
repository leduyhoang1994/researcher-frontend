import React, { Component, Fragment } from 'react';
import { Button, Card, CardBody, Collapse, Label, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { changeCount } from "../../../redux/actions";
import { Colxx } from "../../../components/common/CustomBootstrap";
import { ADDRESS_ORDER, ORDERS, TRANSPORTATION } from '../../../constants/api';
import Api from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';
import { currencyFormatVND, numberFormat } from "../../../helpers/Utils";
import OrderModals from './OrderModals';
import ApiController from '../../../helpers/Api';
import OrderTables from './OrderTables';
import Select from 'react-select';
import IntlMessages from '../../../helpers/IntlMessages';
import ConfirmButton from '../../../components/common/ConfirmButton';
import CreateAddressModals from './CreateAddressModals';
import "./style.scss";

class OrderDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            collapse: false,
            optionAddress: [],
            selectedAddress: null,
            isOpenCreateAddress: false,
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.setState({
            order: this.props.order
        })
        this.getSellerAddress();
    }

    toggleModalCreateAddress = () => {
        this.setState({
            isOpenCreateAddress: !this.state.isOpenCreateAddress
        });
    }

    getSellerAddress = () => {
        let optionAddress = [];
        ApiController.get(ADDRESS_ORDER.all, {}, data => {
            data.forEach(item => {
                let valueAddress = "";
                if (item.name) valueAddress = valueAddress.concat(item.name).concat(" (");
                if (item.address) valueAddress = valueAddress.concat(item.address).concat(", ");
                if (item.town) valueAddress = valueAddress.concat(item.town).concat(", ");
                if (item.district) valueAddress = valueAddress.concat(item.district).concat(", ");
                if (item.city) valueAddress = valueAddress.concat(item.city).concat(")");
                optionAddress.push({ label: valueAddress, value: item.id })
            })
            this.setState({
                optionAddress
            })
            console.log("optionAddress ", optionAddress);
        });
    }

    getTransportation = () => {
        ApiController.get(TRANSPORTATION.all, {}, data => {
            let optionTrans = []
            data.forEach(item => {
                optionTrans.push({ label: item.name, value: item.id })
            })
            this.setState({
                optionTrans
            })
            console.log("optionTrans ", optionTrans);
        });
    }

    handleChangeQuantity = (obj, quantity) => {
        let { order } = this.state;
        let products = Object.values(order)[0];
        if (products?.length > 0) {
            products.forEach((item, index) => {
                if (item.id === obj.id && JSON.stringify(item.optionIds) === JSON.stringify(obj.optionIds)) {
                    if(parseInt(quantity) >= 1) {
                        item.quantity = parseInt(quantity);
                    } else {
                        item.quantity = 1;
                    }
                    products.splice(index, 1, item);
                }
            })
            const key = Object.keys(order)[0];
            order[key] = products;
            order = this.updateInfoOrder(order, key);
            this.setState({
                order
            })
        }
    }

    removeProduct = (obj) => {
        let { order } = this.state;
        let products = Object.values(order)[0];
        if (products?.length > 0) {
            products.forEach((item, index) => {
                if (item.id === obj.id && JSON.stringify(item.optionIds) === JSON.stringify(obj.optionIds)) {
                    products.splice(index, 1);
                }
            })
            const key = Object.keys(order);
            order[key] = products;
            order = this.updateInfoOrder(order, key);
            this.setState({
                order
            })
        }
    }

    updateInfoOrder = (order, name, transportation) => {
        let totalPrice = 0, weight = 0, timeToCome = 0;
        let products = Object.values(order)[0];
        transportation = transportation ? transportation : order?.transportation;

        if (products?.length > 0) {
            let removeProducts = [], addProducts = [];
            products.forEach(item => {
                let arrTransportation = item.transportation.map(transport => {
                    return transport.label;
                })
                if (!arrTransportation.includes(transportation)) {
                    removeProducts.push(item);
                } else {
                    addProducts.push(item);
                }
            })
            if (removeProducts.length > 0) {
                NotificationManager.warning(`Có ${removeProducts.length} sản phẩm không hỗ trợ hình thức vận chuyển này. Vui lòng chọn lại sản phẩm hoặc thay đổi hình thức vận chuyển.`, "Thông báo", 5000);
                return null;
            }
            addProducts.forEach(item => {
                totalPrice += (item.price * item.quantity);
                weight += (item.weight * item.quantity);
                if (item.workshopIn > timeToCome) {
                    timeToCome = item.workshopIn;
                }
            })
            order.totalPrice = totalPrice;
            order.weight = weight;
            order.timeToCome = timeToCome;
            order.transportation = transportation;
            order[name] = addProducts;
        }
        return order;
    }

    updateAddressOrder = () => {
        let { order } = this.state;
        order.addressOrderId = this.state.selectedAddress.value;
        order.address = this.state.selectedAddress.label;
        this.setState({
            order
        })
    }

    calculateLastMiles = async () => {
        let { order } = this.state;
        const { selectedAddress } = this.state;
        let city = selectedAddress.label.split(", ")[3];
        city = city.substr(0, city.length - 1);
        const district = selectedAddress.label.split(", ")[2];
        const data = { weight: order.weight, city, district };
        ApiController.post(ORDERS.calculator, data, value => {
            order.lastMiles = value;
            this.setState({
                order
            })
        });
    }

    optionOrders = (orders) => {
        const optionOrders = [];
        if (orders.length > 0) {
            const keys = orders.map(item => {
                return Object.keys(item)[0];
            })
            keys.forEach(item => {
                optionOrders.push({ label: item, value: item })
            })
        }
    }

    render() {
        const { order, collapse } = this.state;

        if(order.length < 1) {
            console.log("null");
            return (
                <></>
            )
        }
        console.log(order);
        return (
            <>
                <div className="mb-3">
                    <div className="text-left header-collapse">
                        <span
                            onClick={() => {
                                this.setState({
                                    collapse: !collapse
                                })
                            }}
                            className="text-left w-85 d-inline-block"
                        >{Object.keys(order)[0]}
                        </span>
                        <span className="text-left d-contents w-15">
                            <ConfirmButton
                                btnConfig={{
                                    color: "primary",
                                    size: "xs",
                                }}
                                content={{
                                    close: "Đóng",
                                    confirm: "Xác nhận"
                                }}
                                onConfirm={() => {
                                    this.props.removeOrder();
                                }}
                                closeOnConfirm={true}
                                buttonContent={() => {
                                    return (
                                        <b>Xóa</b>
                                    );
                                }}
                                confirmHeader={() => {
                                    return (
                                        <>Xác nhận loại bỏ đơn hàng</>
                                    );
                                }}
                                confirmContent={() => {
                                    return (
                                        <p>Chắc chắn muốn xóa đơn hàng này?</p>
                                    );
                                }}
                            />
                        </span>
                    </div>
                    <Collapse isOpen={collapse}>
                        <OrderTables
                            data={Object.values(order)[0]}
                            component={this}
                            removeProduct={this.removeProduct}
                            handleChangeQuantity={this.handleChangeQuantity}
                        />
                        <Row>
                            <Colxx xxs="6">
                                <p>Hình thức vận chuyển: {order?.transportation}</p>
                            </Colxx>
                            <Colxx xxs="6">
                                <p>Tổng khối lượng: {numberFormat(Number.parseFloat(order?.weight), 3, ".", ",")} kg</p>
                            </Colxx>
                        </Row>
                        <Row>
                            <Colxx xxs="12" className="position-relative">
                                <span className="w-75 d-inline-block">Địa chỉ giao hàng: {order?.address} </span>
                                <span className="w-25 d-inline-block text-right btn-change-address">
                                    <ConfirmButton
                                        btnConfig={{
                                            color: "primary",
                                            size: "xs",
                                        }}
                                        content={{
                                            close: "Đóng",
                                            confirm: "Xác nhận"
                                        }}
                                        onConfirm={() => {
                                            this.updateAddressOrder();
                                        }}
                                        closeOnConfirm={true}
                                        buttonContent={() => {
                                            return (
                                                <span>Thay đổi</span>
                                            );
                                        }}
                                        confirmHeader={() => {
                                            return (
                                                <>Chọn địa chỉ giao hàng</>
                                            );
                                        }}
                                        confirmContent={() => {
                                            return (
                                                <Row>
                                                    <Colxx xxs="12">
                                                        <Label className="form-group has-float-label mb-4">
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
                                                            <IntlMessages id="Chọn địa chỉ giao hàng" />
                                                        </Label>
                                                    </Colxx>
                                                    <Colxx xxs="12">
                                                        <div className="text-right">
                                                            <Button
                                                                color="primary"
                                                                onClick={() => {
                                                                    this.toggleModalCreateAddress();
                                                                    this.getSellerAddress();
                                                                }}
                                                            >
                                                                Tạo mới
                                                            </Button>
                                                        </div>
                                                    </Colxx>
                                                </Row>
                                            );
                                        }}
                                    />
                                </span>
                            </Colxx>
                            <Colxx xxs="12 mt-2">
                                <span className="w-80 d-inline-block">Tổng giá vận chuyển: {currencyFormatVND(Number.parseFloat(order?.lastMiles || 0))} VNĐ</span>
                                <span className="w-20 d-inline-block text-right">
                                    <Button
                                        disabled={this.state.selectedAddress?.label ? false : true}
                                        size="xs"
                                        color="primary"
                                        onClick={() => {
                                            this.calculateLastMiles()
                                        }}
                                    >Cập nhật</Button>
                                </span>
                            </Colxx>
                        </Row>
                        <Row className="mt-2">
                            <Colxx xxs="12">
                                <p>Tổng giá trị sản phẩm: {currencyFormatVND(Number.parseFloat(order?.totalPrice).toFixed(0))} đ</p>
                            </Colxx>
                            <Colxx xxs="12">
                                <p>Tổng giá trị nhập hàng: {currencyFormatVND(Number.parseFloat((order?.lastMiles ? order?.lastMiles + order?.totalPrice : 0)).toFixed(0))} đ</p>
                            </Colxx>
                        </Row>
                    </Collapse>
                </div>
                <CreateAddressModals
                    key={this.state.isOpenCreateAddress}
                    isOpen={this.state.isOpenCreateAddress}
                    getSellerAddress={this.getSellerAddress}
                    toggleModalCreateAddress={this.toggleModalCreateAddress}
                />
            </>
        );
    }
}
const mapStateToProps = ({ cart }) => {
    const { count } = cart;
    return {
        count
    };
};

export default injectIntl(
    connect(
        mapStateToProps,
        { changeCount }
    )(OrderDetails));
