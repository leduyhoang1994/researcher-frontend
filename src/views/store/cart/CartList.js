import React, { Component, Fragment } from 'react';
import { Button } from 'reactstrap';
import { injectIntl } from 'react-intl';
import Products from './Products';

class CartList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: [],
            products: [],
            total: 0,
        };
        this.addTotals();
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
        const cart  = this.state.cart;
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

        console.log(tempCart);
        // product.quantity += 1;
        tempCart.splice(index, 1, product)
        this.setState(() => {
            return {
                cart: [...tempCart]
            };
        }, () => {
            this.addTotals();
        })
    }

    decrement = id => {
        let tempCart = this.state.cart;
        const index = tempCart.indexOf(this.getItem(id));
        let product = tempCart[index];

        console.log(tempCart);
        // product.quantity -= 1;
        tempCart.splice(index, 1, product)
        this.setState(() => {
            return {
                cart: [...tempCart]
            };
        }, () => {
            this.addTotals();
        })
    }

    addTotals = () => {
        let total = 0;
        this.state.cart.map(item => {
            console.log(item);
            // total += (item.priceMin + item.priceMax) * item.quantity
        });
        this.setState( {
            total: total
        })
    }

    render() {
        const products = this.state.products;

        return (
            <div className="store">
                <div className="products">
                    {/* <Products */}
                    {/* products={products} /> */}
                    {products.map((product) => {
                        return (
                            <Products
                                item={product}
                                decrement={this.decrement}
                                increment={this.increment}
                            // updateCartState={() => {
                            //     let cart = localStorage.getItem("cart");
                            //     if (cart === null) cart = [];
                            //     else cart = JSON.parse(cart);
                            //     this.setState({ cart: cart });
                            // }}
                            />
                        );
                    })}
                </div>
                <div className="text-right card-title">
                    <Button
                        className="mr-2"
                        color="primary"
                        onClick={() => {
                            localStorage.setItem("cart", JSON.stringify([]));
                            // this.setState({ cart: [] });
                            window.open("/store/cart", "_self")
                        }}
                    >
                        Xóa giỏ hàng
                            {/* {__(this.messages, "Thêm vào giỏ" )} */}
                    </Button>
                </div>

            </div>
        );
    }
}

export default injectIntl(CartList);
