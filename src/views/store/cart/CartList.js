import React, { Component, Fragment } from 'react';
import { Button, Card, CardBody, Collapse, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import Products from './Products';
import { connect } from "react-redux";
import { changeCount } from "../../../redux/actions";
import { Colxx } from "../../../components/common/CustomBootstrap";
import { ORDERS } from '../../../constants/api';
import Api from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';
import { numberWithCommas } from "../../../helpers/Utils";
import { defaultImg } from '../../../constants/defaultValues';
import CartTables from './CartTables';

import "./style.scss";
import OrderModals from './OrderModals';

class CartList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            products: [],
            selectedProducts: [],
            orders: [],
            collapses: [],
            total: 0,
            isOpenOrderModals: false
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getCart();
    }

    toggleOpenOrderModals = () => {
        this.setState({
            isOpenOrderModals: !this.state.isOpenOrderModals
        });
    }

    toggleCollapse = (index) => {
        let { collapses } = this.state;
        let collapse = collapses[index];
        collapse = !collapse;
        collapses.splice(index, 1, collapse);
        this.setState({
            collapses
        });
    };

    getCart = () => {
        let cart = localStorage.getItem("cart");

        if (cart === null || cart.trim() === "") {
            cart = [];
        }
        else cart = JSON.parse(cart);

        this.setState({
            cart: cart
        }, () => {
            this.getProduct()
        })
    }

    getProduct = () => {
        const cart = this.state.cart;
        let products = [];
        cart.forEach(product => {
            products.push(product);
        })
        this.setState({
            products: products
        })
        this.addTotals();
    }

    getItem = obj => {
        const product = this.state.products.find(item => (item.id === obj.id && item.optionIds === obj.optionIds));
        return product;
    }

    increment = obj => {
        let tempCart = this.state.cart;
        const index = tempCart.indexOf(this.getItem(obj));
        let product = tempCart[index];

        product.quantity = parseInt(product.quantity) + 1;
        tempCart.splice(index, 1, product)
        localStorage.setItem("cart", JSON.stringify([...tempCart]));
        this.setState(() => {
            return {
                cart: [...tempCart]
            };
        })
        this.addTotals();
        this.props.changeCount();
    }

    decrement = obj => {
        let tempCart = this.state.cart;
        const index = tempCart.indexOf(this.getItem(obj));
        let product = tempCart[index];

        if (product.quantity === 1) return;
        product.quantity -= 1;
        tempCart.splice(index, 1, product);
        localStorage.setItem("cart", JSON.stringify([...tempCart]));
        this.setState(() => {
            return {
                cart: [...tempCart]
            };
        })
        this.addTotals();
        this.props.changeCount();
    }

    remove = obj => {
        let tempProducts = this.state.products;
        let tempCart = this.state.cart;
        const index = tempCart.indexOf(this.getItem(obj));
        if (index > -1) {
            tempProducts.splice(index, 1);
            tempCart.splice(index, 1);
        }

        localStorage.setItem("cart", JSON.stringify([...tempCart]));
        this.setState(() => {
            return {
                cart: [...tempCart],
                products: [...tempProducts]
            };
        }, () => {
            this.addTotals();
            this.props.changeCount();
        })
    }

    addTotals = () => {
        let total = 0;
        this.state.cart.forEach(item => {
            if (item.price) {
                total += item?.price * item?.quantity;
            }
        });
        this.setState({
            total: total
        })
    }

    openOrderModals = () => {
        if (this.state.selectedProducts.length > 0) {
            this.toggleOpenOrderModals();
        } else {
            NotificationManager.info("Vui lòng chọn sản phẩm trong giỏ", "Thông báo", 1500);
        }
    }

    addToOrder = (key, name) => {
        let { orders, selectedProducts } = this.state;
        if (key === "update") {
            let order = {}, idx = 0;
            orders.forEach((item, index) => {
                if (Object.keys(item)[0] === name) {
                    order = orders[index];
                    idx = index;
                }
            })
            const products = order[name];

            let newProducts = products;
            selectedProducts.forEach(item => {
                if (!products.includes(item)) {
                    newProducts.push(item)
                }
            })
            order[name] = newProducts;
            order = this.updateInfoOrder(order);
            orders = orders.splice(idx, 1, order);

            NotificationManager.success("Cập nhật đơn hàng thành công", "Thông báo", 1500);

        } else if (key === "add") {
            let order = this.updateInfoOrder({ [name]: selectedProducts });
            orders.push(order);
            let {collapses} = this.state;
            collapses.push(true);
            this.setState({collapses})
            NotificationManager.success("Thêm đơn hàng thành công", "Thông báo", 1500);
        }

        this.setState({
            orders
        })
    }

    updateInfoOrder = (order) => {
        let totalPrice = 0, serviceCost = 0, weight = 0, timeToCome = 0;
        const products = Object.values(order)[0];
        console.log(products);
        if (products?.length > 0) {
            products.forEach(item => {
                totalPrice += item.offerPrice;
                // serviceCost += item.offerPrice;
                weight += item.weight;
                if(item.workshopIn > timeToCome) {
                    timeToCome = item.workshopIn;
                }
            })
            order.totalPrice = totalPrice;
            order.serviceCost = serviceCost;
            order.weight = weight;
            order.timeToCome = timeToCome;
        }

        return order;
    }

    orderProduct = () => {
        const { products } = this.state;
        let order = [];
        products.forEach(product => {
            order.push({ uboxProductId: product.id, optionIds: product.optionIds, quantity: product.quantity, description: "description" })
        })
        Api.callAsync('post', ORDERS.all, {
            description: "string",
            createOrderDetail: order
        }).then(data => {
            console.log(data);
            if (data.data.statusCode === 200) {
                NotificationManager.success("Đặt hàng thành công", "Thành công", 700);
                localStorage.setItem("cart", JSON.stringify([]));
                setTimeout(function () {
                    window.open("/store", "_self")
                }, 1000);
            }

        }).catch(error => {
            NotificationManager.warning("Đặt hàng thất bại", "Thất bại", 1000);
            if (error.response.status === 401) {
                setTimeout(function () {
                    NotificationManager.info("Yêu cầu đăng nhập tài khoản khách hàng!", "Thông báo", 2000);
                    setTimeout(function () {
                        window.open("/seller/login", "_self")
                    }, 1500);
                }, 1500);
            }

        });
    }

    handleCheckAll = (checked, data) => {
        const newData = data.map(data => data._original)
        if (checked)
            this.addToSelectedCart(newData)
        else {
            this.removeFromSelectedCart(newData)
        }
    }

    existInSelectedCart = (product) => {
        const { selectedProducts } = this.state;
        let exist = false;
        selectedProducts.forEach(selectedProduct => {
            if (JSON.stringify(selectedProduct) === JSON.stringify(product)) {
                exist = true;
                return false;
            }
        });
        return exist;
    }

    addToSelectedCart = (products) => {
        let newProducts = []

        if (Array.isArray(products)) newProducts = [...products];
        else newProducts.push(products);

        const { selectedProducts } = this.state;

        for (const product of newProducts) {
            let exist = this.existInSelectedCart(product);
            if (!exist) {
                selectedProducts.push(product);
            }
        }

        this.setState({
            selectedProducts: selectedProducts
        });
    }

    allProductSelected = (data) => {
        if (Array.isArray(data)) {
            for (const index of data)
                if (this.existInSelectedCart(index) === false) return false
        }
        return true
    }

    removeFromSelectedCart = (products) => {
        let { selectedProducts } = this.state;

        let newProducts = []

        if (Array.isArray(products)) newProducts = [...products]
        else newProducts.push(products)

        for (const product of newProducts) {
            selectedProducts = selectedProducts.filter(selectedProduct => {
                return JSON.stringify(selectedProduct) !== JSON.stringify(product);
            });
        }

        this.setState({
            selectedProducts: selectedProducts
        });
    }

    render() {
        const optionOrders = [];
        const { orders, collapses, products } = this.state;
        if (orders.length > 0) {
            const keys = orders.map(item => {
                return Object.keys(item)[0];
            })
            keys.forEach(item => {
                optionOrders.push({ label: item, value: item })
            })
        }

        if (products.length > 0) {
            return (
                <Fragment>
                    <Card >
                        <CardBody >
                            <Row>
                                {/* cart list here */}
                                <Colxx xxs="7" className="list-product-cart">
                                    <h2>Danh sách sản phẩm</h2>
                                    <div className="products mt-4">
                                        <CartTables
                                            data={products}
                                            component={this}
                                            handleCheckAll={this.handleCheckAll}
                                            allProductSelected={this.allProductSelected}
                                            addToSelectedCart={this.addToSelectedCart}
                                            existInSelectedCart={this.existInSelectedCart}
                                            removeFromSelectedCart={this.removeFromSelectedCart}
                                        />
                                    </div>
                                    <div className="text-right  mt-5">
                                        <Button
                                            className="mr-2"
                                            color="primary"
                                            onClick={() => {
                                                this.openOrderModals();
                                            }}
                                        >
                                            Thêm vào đơn hàng
                                </Button>
                                    </div>
                                </Colxx>

                                {/* order here */}
                                <Colxx xxs="5">
                                    {orders.length > 0 ? (
                                        <h2>Danh sách đơn hàng</h2>
                                    ) : (
                                            <h2>Chọn sản phẩm để tạo đơn hàng</h2>
                                        )}
                                    {orders.map((item, index) => {
                                        return (
                                            <div key={Object.values(item)[0] + index} className="mb-3">
                                                <div className="text-left header-collapse"
                                                    onClick={() => {
                                                        this.toggleCollapse(index)
                                                    }}
                                                >
                                                    <span className="text-left">{Object.keys(item)[0]}</span>
                                                    {/* <span>{!collapses[index] ? "Mở rộng" : "Thu nhỏ"}</span> */}
                                                </div>
                                                <Collapse
                                                    isOpen={collapses[index]}
                                                >
                                                    <CartTables
                                                        isOrderProducts={false}
                                                        data={Object.values(item)[0]}
                                                        component={this}
                                                        removeFromSelectedCart={this.removeFromSelectedCart}
                                                    />
                                                    <Row>
                                                        <Colxx xxs="6">
                                                            <div>Tổng giá trị nhập hàng: {item.totalPrice} VNĐ</div>
                                                        </Colxx>
                                                        <Colxx xxs="6">
                                                            <div>Tổng phí dịch vụ: {item.serviceCost} VNĐ</div>
                                                        </Colxx>
                                                        <Colxx xxs="6">
                                                            <div>Thời gian dự kiến hàng về: {item.timeToCome} ngày</div>
                                                        </Colxx>
                                                        <Colxx xxs="6">
                                                            <div>Tổng khối lượng: {item.weight} kg</div>
                                                        </Colxx>
                                                        <Colxx xxs="6">
                                                            <div>Hình thức vận chuyển: {}</div>
                                                        </Colxx>
                                                        <Colxx xxs="6">
                                                            <div>Địa chỉ giao hàng: {}</div>
                                                        </Colxx>
                                                    </Row>
                                                </Collapse>
                                            </div>
                                        )
                                    })}

                                </Colxx>
                            </Row>
                            <Row>
                                <Colxx xxs="12">
                                    <div className="text-right mt-5">
                                        <Button
                                            className="mr-2"
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
                                </Colxx>
                            </Row>
                        </CardBody>
                    </Card>
                    <OrderModals
                        key={this.state.isOpenOrderModals}
                        isOpen={this.state.isOpenOrderModals}
                        toggleModal={this.toggleOpenOrderModals}
                        addToOrder={this.addToOrder}
                        optionOrders={optionOrders}
                    />
                </Fragment>
            );
        } else {
            return (
                <div className="container mt-5">
                    <Row>
                        <h1>Your cart is currently empty</h1>
                    </Row>
                </div>
            )
        }

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
    )(CartList));
