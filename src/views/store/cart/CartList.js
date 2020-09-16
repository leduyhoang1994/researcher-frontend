import React, { Component } from 'react';
import { Button, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import Products from './Products';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { ORDERS } from '../../../constants/api';
import Api from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';
import { numberWithCommas } from "../../../helpers/Utils";
class CartList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            products: [],
            total: 0,
        };
    }

    componentDidMount() {
        this.getCart();
    }

    getCart = () => {
        let cart = localStorage.getItem("cart");

        if (cart === null || cart.trim() === "") cart = [];
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

    getItem = id => {
        const product = this.state.products.find(item => item.id === id);
        return product;
    }

    increment = id => {
        let tempCart = this.state.cart;
        const index = tempCart.indexOf(this.getItem(id));
        let product = tempCart[index];

        product.quantity += 1;
        tempCart.splice(index, 1, product)
        localStorage.setItem("cart", JSON.stringify([...tempCart]));
        this.setState(() => {
            return {
                cart: [...tempCart]
            };
        })
        this.addTotals();
    }

    decrement = id => {
        let tempCart = this.state.cart;
        const index = tempCart.indexOf(this.getItem(id));
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
    }

    remove = id => {
        let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];
        tempCart = tempCart.filter(item => item.id !== id);
        tempProducts = tempProducts.filter(item => item.id !== id);
        localStorage.setItem("cart", JSON.stringify([...tempCart]));
        this.setState(() => {
            return {
                cart: [...tempCart],
                products: [...tempProducts]
            };
        }, () => {
            this.addTotals();
        })
    }

    addTotals = () => {
        let total = 0;
        this.state.cart.map(item => {
            total += (item.priceMin + item.priceMax) / 2 * item.quantity
        });
        this.setState({
            total: total
        })
    }

    orderProduct = () => {
        const { products } = this.state;
        let order = [];
        products.forEach(product => {
            order.push({ productEditId: product.id, quantity: product.quantity, description: "" })
        })
        Api.callAsync('post', ORDERS.all, {
            description: "string",
            createOrderDetail: order
        }).then(data => {
            NotificationManager.success("Đặt hàng thành công", "Thành công");
        }).catch(error => {
            NotificationManager.warning("Đặt hàng thất bại", "Thất bại");
        });
    }

    render() {
        const products = this.state.products;
        if (products.length > 0) {
            return (
                <div className="store">
                    <div className="products">
                        {products.map((product) => {
                            return (
                                <Products
                                    item={product}
                                    decrement={this.decrement}
                                    increment={this.increment}
                                    remove={this.remove}
                                />
                            );
                        })
                        }
                        <Colxx xxs="12" className="text-right">
                            <h3>Tổng cộng: {numberWithCommas(this.state.total)} VNĐ</h3>
                        </Colxx>
                    </div>


                    <div className="text-right card-title mt-5">
                        <Button
                            className="mr-2"
                            color="primary"
                            onClick={() => {
                                this.orderProduct();
                            }}
                        >
                            Mua ngay
                                {/* {__(this.messages, "Thêm vào giỏ" )} */}
                        </Button>
                        <Button
                            className="mr-2"
                            color="primary"
                            onClick={() => {
                                localStorage.setItem("cart", JSON.stringify([]));
                                this.setState({ cart: [] });
                                window.open("/store", "_self")
                            }}
                        >
                            Xóa giỏ hàng
                                {/* {__(this.messages, "Thêm vào giỏ" )} */}
                        </Button>
                    </div>

                </div>
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
