import React, { Component, Fragment } from 'react';
import { Button, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { changeCount } from "../../../redux/actions";
import { Colxx } from "../../../components/common/CustomBootstrap";
import { ORDERS } from '../../../constants/api';
import Api from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';
import ApiController from '../../../helpers/Api';
import "./style.scss";
import OrderDetails from './OrderDetails';

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            groupOrderId: this.props.groupOrderId || null,
            optionAddress: [],
            selectedAddress: [],
            lastMiles: 0,
            isOpenCreateAddress: false,
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.setState({
            orders: this.props.orders,
        })
    }

    toggleModalCreateAddress = () => {
        this.setState({
            isOpenCreateAddress: !this.state.isOpenCreateAddress
        });
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

    removeOrder = (index) => {
        let { orders } = this.state;
        orders.splice(index, 1);
        this.setState({
            orders
        })
    }

    orderProduct = () => {
        const { orders, groupOrderId } = this.state;
        let arr = [], flag = true;
        orders.forEach(order => {
            if ((order?.addressOrderId || "") === "") {
                NotificationManager.warning("Vui lòng chọn địa chỉ cho đơn hàng", "Thông báo", 1000);
                flag = false;
            }
            const products = Object.values(order)[0];
            let detail = [];
            products.forEach(product => {
                detail.push({ uboxProductId: product.id, optionIds: product.optionIds, quantity: product.quantity, description: "description" })
            })
            let newOrder = {
                description: "string",
                createOrderDetail: detail,
                addressOrderId: order.addressOrderId,
                groupOrderId: groupOrderId
            }
            arr.push(newOrder);
        })
        if (flag) {
            Api.callAsync('post', ORDERS.all, arr).then(data => {
                if (data.data.statusCode === 200) {
                    NotificationManager.success("Đặt hàng thành công", "Thành công", 700);
                    setTimeout(function () {
                        window.open("/store", "_self")
                    }, 1000);
                }
            }).catch(error => {
                NotificationManager.warning("Đặt hàng thất bại", "Thất bại", 1000);
            });
        }
    }

    render() {
        const { orders } = this.state;

        return (
            <Fragment>
                <Row className="row-before-btn-order">
                    <Colxx xxs="12">
                        {orders.map((item, index) => {
                            return (
                                <OrderDetails
                                    key={index}
                                    order={item}
                                    removeOrder={() => {
                                        this.removeOrder(index)
                                    }}
                                />
                            )
                        })}

                    </Colxx>
                </Row>
                <div className="text-right  btn-order-product">
                    <Button
                        disabled={this.state.orders?.length > 0 ? false : true}
                        color="primary"
                        onClick={() => {
                            this.orderProduct();
                        }}
                    >
                        Xác nhận đặt hàng
                                        </Button>
                    {/* <Button
                                            className="mr-2"
                                            color="primary"
                                            onClick={() => {
                                                localStorage.setItem("cart", JSON.stringify([]));
                                                this.setState({ cart: [] });
                                                window.open("/store", "_self")
                                            }}
                                        >
                                            Xóa giỏ hàng
                                        </Button> */}
                </div>
                {/* <CreateAddressModals
                    key={this.state.isOpenCreateAddress + "address"}
                    isOpen={this.state.isOpenCreateAddress}
                    getSellerAddress={this.getSellerAddress}
                    toggleModalCreateAddress={this.toggleModalCreateAddress}
                /> */}
            </Fragment >
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
    )(OrderList));
