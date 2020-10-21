import React, { Component, Fragment } from 'react';
import { Button, Card, CardBody, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { TRANSPORTATION } from '../../../constants/api';
import { NotificationManager } from '../../../components/common/react-notifications';
import CartTables from './CartTables';
import OrderModals from './OrderModals';
import ApiController from '../../../helpers/Api';
import CreateAddressModals from './CreateAddressModals';
import GroupOrderModals from './GroupOrderModals';
import OrderList from './OrderList';
import "./style.scss";

class CartList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            selectedProducts: [],
            orders: [],
            groupOrderId: null,
            isOpenOrderModals: false,
            isOpenGroupOrderModals: false,
            optionTrans: [],
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getCart();
        this.getTransportation();
    }

    toggleOpenOrderModals = () => {
        this.setState({
            isOpenOrderModals: !this.state.isOpenOrderModals
        });
    }

    toggleOpenGroupOrderModals = () => {
        this.setState({
            isOpenGroupOrderModals: !this.state.isOpenGroupOrderModals
        });
    }

    setGroupOrderId = id => {
        this.setState({
            groupOrderId: id
        })
        this.toggleOpenOrderModals();
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
        });
    }

    getCart = () => {
        let cart = localStorage.getItem("cart");
        if (cart === null || cart.trim() === "") {
            cart = [];
        }
        else cart = JSON.parse(cart);
        this.setState({
            products: cart
        })
    }

    getItem = obj => {
        const product = this.state.products.find(item => (item.id === obj.id && item.optionIds === obj.optionIds));
        return product;
    }

    createUUID = () => {
        const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        return pattern.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : ((r & 0x3) | 0x8);
            return v.toString(16).toUpperCase();
        });
    };

    openOrderModals = () => {
        if (this.state.selectedProducts.length > 0) {
            if (!this.state.groupOrderId) {
                this.toggleOpenGroupOrderModals();
            } else {
                this.toggleOpenOrderModals();
            }
        } else {
            NotificationManager.info("Vui lòng chọn sản phẩm trong giỏ", "Thông báo", 1500);
        }
    }

    addToOrder = (key, name, transportation) => {
        let { orders, selectedProducts } = this.state;
        if (key === "update") {
            let order = {};
            orders.forEach((item, index) => {
                if (Object.keys(item)[0] === name) {
                    order = orders[index];
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
            order = this.updateInfoOrder(order, name);

            if (order !== null) {
                NotificationManager.success("Cập nhật đơn hàng thành công", "Thông báo", 1500);
            }
        } else if (key === "add") {
            let order = this.updateInfoOrder({ [name]: selectedProducts }, name, transportation);
            if (order !== null) {
                orders.push(order);
                NotificationManager.success("Thêm đơn hàng thành công", "Thông báo", 1500);
            }
        }
        this.setState({
            orders
        })
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

    deleteSelectedCart = (data) => {
        let { products } = this.state;
        products.forEach((item, index) => {
            if (item.id === data.id && JSON.stringify(item.optionIds) === JSON.stringify(data.optionIds)) {
                products.splice(index, 1);
            }
        })
        localStorage.setItem("cart", JSON.stringify(products));
        this.props.changeCount()
        this.setState({
            products
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
        return optionOrders;
    }

    render() {
        const { orders, products, groupOrderId } = this.state;
        const optionOrders = this.optionOrders(orders);

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
                                            deleteSelectedCart={this.deleteSelectedCart}
                                        />
                                    </div>
                                    <div className="text-right  mt-5">
                                        <Button
                                            className="mr-2"
                                            color="success"
                                            onClick={() => {
                                                this.openOrderModals();
                                            }}
                                        >
                                            Thêm vào đơn hàng
                                </Button>
                                    </div>
                                </Colxx>

                                {/* order here */}
                                <Colxx xxs="5" className="position-relative">
                                    {orders.length > 0 ? (
                                        <>
                                            <h2>Danh sách đơn hàng</h2>
                                            <OrderList
                                                key={orders.length}
                                                orders={orders}
                                                groupOrderId={groupOrderId}
                                            />
                                        </>
                                    ) : (
                                            <h2>Chọn sản phẩm để tạo đơn hàng</h2>
                                        )
                                    }
                                </Colxx>
                            </Row>
                            <Row>
                                <Colxx xxs="12">
                                    <div className="text-right mt-5">
                                        {/* <Button
                                            disabled={this.state.orders?.length > 0 ? false : true}
                                            className="mr-2"
                                            color="primary"
                                            onClick={() => {
                                                this.orderProduct();
                                            }}
                                        >
                                            Xác nhận đặt hàng
                                        </Button> */}
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
                    <GroupOrderModals
                        key={this.state.isOpenGroupOrderModals + "group"}
                        isOpen={this.state.isOpenGroupOrderModals}
                        toggleModal={this.toggleOpenGroupOrderModals}
                        setGroupOrderId={this.setGroupOrderId}
                    />
                    <OrderModals
                        key={this.state.isOpenOrderModals + "order"}
                        isOpen={this.state.isOpenOrderModals}
                        toggleModal={this.toggleOpenOrderModals}
                        addToOrder={this.addToOrder}
                        optionOrders={optionOrders}
                        optionTrans={this.state.optionTrans}
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

export default injectIntl(CartList);
