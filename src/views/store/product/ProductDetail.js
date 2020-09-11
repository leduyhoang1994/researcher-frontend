import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { CATEGORIES, PRODUCT_EDIT } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import Api from '../../../helpers/Api';
import GlideComponentThumbs from "../../../components/carousel/GlideComponentThumbs";

class ProductDetail extends Component {
    constructor(props) {
        super(props);
        let cart = localStorage.getItem("cart");
        if (cart === null || cart.trim() === "") {
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
        } else cart = JSON.parse(cart);

        this.state = {
            id: this.props.match.params.id || null,
            product: {},
            media: [],
            detailImages: [],
            properties: [],
            isAddedToCart: false
        };
        console.log(this.props);
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.loadCurrentProduct();
    }

    loadCurrentProduct = () => {
        const { id } = this.state;
        if (id) {
            this.getProduct(id);
            this.getMedia(id)
        }
    }

    getProduct = (id) => {
        ApiController.get(`${PRODUCT_EDIT.all}/${id}`, {}, data => {
            this.setState({
                product: data,
            }, () => {
                // const option = this.state.product.productEditOptions;
                // let arr = [];
                // console.log(option);
                // option.forEach(item => {
                //     arr.push({ label: item.options.attribute.label, value: item.options.label })
                // })
                // this.setState({
                //     properties: arr,
                // })
            })
        })
    }

    getMedia = (id) => {
        ApiController.get(`${PRODUCT_EDIT.all}/${id}/media`, {}, data => {
            const arr = data.images;
            let list = [];
            arr.map((item, index) => {
                return list.push({ id: index, img: item })
            })
            this.setState({
                detailImages: list,
            })
        })
    }

    addToCart = () => {
        const { id, name, featureImage, priceMin, priceMax } = this.state.product;
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

    render() {
        let { name, priceMin, priceMax, futurePriceMin, featureImage, serviceSla, serviceCost, description, transportation, workshopIn, uboxIn } = this.state.product;
        const detailImages = this.state.detailImages;
        
        let cart = localStorage.getItem("cart");
        cart = cart ? JSON.parse(cart) : [];

        let isAddedToCart = this.state.isAddedToCart;

        for (let i = 0; i < cart.length; i++)
            if (cart[i].id == this.state.id) 
                isAddedToCart = true;

        return (
            <Fragment>
                <Row>
                    <Colxx xxs="2" >
                        {/* category */}
                    </Colxx>
                    <Colxx xxs="10" >
                        <Row>
                            <Colxx xxs="6" style={{ textAlign: "center" }}>
                                <GlideComponentThumbs settingsImages={
                                    {
                                        bound: true,
                                        rewind: false,
                                        focusAt: 0,
                                        startAt: 0,
                                        gap: 5,
                                        perView: 1,
                                        data: detailImages,
                                    }
                                } settingsThumbs={
                                    {
                                        bound: true,
                                        rewind: false,
                                        focusAt: 0,
                                        startAt: 0,
                                        gap: 10,
                                        perView: 5,
                                        data: detailImages,
                                        breakpoints: {
                                            576: {
                                                perView: 4
                                            },
                                            420: {
                                                perView: 3
                                            }
                                        }
                                    }
                                } />
                            </Colxx>
                            <Colxx xxs="6">
                                <h2>{name}</h2>
                                <Row>
                                    <Colxx xxs="6">
                                        <p>{priceMin} VNĐ</p>
                                        <p>{futurePriceMin} VNĐ</p>
                                    </Colxx>
                                </Row>
                                <div className="text-left card-title">
                                    <Button
                                        className="mr-2"
                                        color="primary"
                                        disabled={isAddedToCart}
                                        onClick={() => {
                                            this.addToCart();
                                            this.setState({
                                                isAddedToCart: true
                                            });
                                        }}
                                    >
                                        {__(this.messages, isAddedToCart ? "Đã thêm" : "Thêm vào giỏ")}
                                    </Button>
                                </div>
                            </Colxx>
                        </Row>



                    </Colxx>
                </Row>

            </Fragment >
        );
    }
}

export default injectIntl(ProductDetail);