import React from 'react';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { Link, NavLink } from 'react-router-dom';
import "./style.scss";
import { Card, CardBody, Button, CardSubtitle, CardText, CardImg } from 'reactstrap';

const addToCart = products => {
    const { id, name, featureImage, priceMin, priceMax } = products;
    const quantity = 1;
    const product = { id, name, featureImage, priceMin, priceMax, quantity };

    let cart = localStorage.getItem("cart");

    if (cart === null) cart = [];
    else cart = JSON.parse(cart);

    for (let i = 0; i < cart.length; i++)
        if (cart[i].id === product.id) return;

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));
};

const Product = (props) => {
    const product = props.product;

    return (
        <Card className="mb-4 product">
            <NavLink to={"/store/products/detail/" + product.id}>
                <div className="position-relative">
                    <CardImg top src={product.featureImage} alt="Card image cap" />
                    {
                        /* 
                            <Badge color="primary" pill className="position-absolute badge-top-left">NEW</Badge>
                            <Badge color="secondary" pill className="position-absolute badge-top-left-2">TRENDING</Badge> 
                        */
                    }
                </div>
                <CardBody className="product-body">
                    <CardSubtitle className="font-weight-bold mb-2 product-subtitle">{product.name}</CardSubtitle>
                    {/* <CardText className="product-price font-weight-bold text-left text-normal mb-0">{product.priceMin}</CardText> */}
                    <CardText className="product-price font-weight-bold text-right text-normal mb-0">{product.priceMax} NDT</CardText>
                    <CardText className="text-left text-normal mb-0">Khối lượng {product.weight} kg</CardText>
                    <CardText className="text-left text-normal mb-0">Phí ship nội địa TQ {product.serviceCost}</CardText>
                </CardBody>
            </NavLink>
            <div className="align-center mt-3">
                <Button
                    className="mr-2"
                    color="primary"
                    onClick={() => {
                        addToCart(product)
                    }}
                >
                    Thêm vào giỏ
                            {/* {__(this.messages, "Thêm vào giỏ" )} */}
                </Button>
            </div>
        </Card>
    );
};

export default injectIntl(Product);