import React, { Component, Fragment } from 'react';
import { Button, Row } from 'reactstrap';
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

class CartList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            products: [],
            total: 0,
            selectedProducts: [],
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getCart();
    }

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
        const products = this.state.products;
        if (products.length > 0) {
            return (
                <Fragment>
                    <Row>
                        {/* cart list here */}
                        <Colxx xxs="7">
                            <div className="store">
                                <div className="products">
                                    <CartTables
                                        data={products}
                                        component={this}
                                        handleCheckAll={this.handleCheckAll}
                                        allProductSelected={this.allProductSelected}
                                        addToSelectedCart={this.addToSelectedCart}
                                        existInSelectedCart={this.existInSelectedCart}
                                        removeFromSelectedCart={this.removeFromSelectedCart}
                                    />
                                    {/* {products.map((product, index) => {
                                        if (!product.featureImage) product.featureImage = defaultImg;
                                        return (
                                            <Products
                                                key={index}
                                                item={product}
                                                decrement={this.decrement}
                                                increment={this.increment}
                                                remove={this.remove}
                                            />
                                        );
                                    })} */}
                                    {/* <Colxx xxs="12" className="text-right">
                                        <h3>Tổng cộng: {numberWithCommas(this.state.total.toFixed(0))} đ</h3>
                                    </Colxx> */}
                                </div>



                            </div>
                        </Colxx>

                        {/* order here */}
                        <Colxx xxs="5">
                        </Colxx>
                    </Row>
                    <Row>
                        <Colxx xxs="12">
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
                        </Colxx>
                    </Row>

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
