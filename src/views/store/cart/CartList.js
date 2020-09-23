import React, { Component } from 'react';
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
        if(index > -1) {
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
            order.push({ uboxProductId: product.id, optionIds: product.optionIds ,quantity: product.quantity, description: "description" })
        })
        Api.callAsync('post', ORDERS.all, {
            description: "string",
            createOrderDetail: order
        }).then(data => {
            console.log(data);
            if(data.data.statusCode === 200) {
                NotificationManager.success("Đặt hàng thành công", "Thành công", 700);
                localStorage.setItem("cart", JSON.stringify([]));
                setTimeout(function(){ 
                    window.open("/store", "_self")
                }, 1000);
            }
            
        }).catch(error => {
            NotificationManager.warning("Đặt hàng thất bại", "Thất bại", 1000);
            if(error.response.status === 401) {
                setTimeout(function(){ 
                    NotificationManager.info("Yêu cầu đăng nhập tài khoản khách hàng!", "Thông báo", 2000);
                    setTimeout(function(){ 
                        window.open("/seller/login", "_self")
                    }, 1500);
                }, 1500);
            }
            
        });
    }

    render() {
        const products = this.state.products;
        if (products.length > 0) {
            return (
                <div className="store">
                    <div className="products">
                        {products.map((product, index) => {
                            if(!product.featureImage) product.featureImage = defaultImg;
                            return (
                                <Products
                                    key={index}
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
