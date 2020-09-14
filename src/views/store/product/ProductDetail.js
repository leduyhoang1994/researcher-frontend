import React, { Component, Fragment } from 'react';
import { Row, Input, Label, Button } from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { PRODUCT_SELLER } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import GlideComponentThumbs from "../../../components/carousel/GlideComponentThumbs";
import { numberWithCommas } from "../../../helpers/Utils";
// import { detailImages, detailThumbs } from "../../../data/carouselItems";

const renderOptions = properties => {
    let options = {};
    let list = [];
    if (properties) {
        properties.forEach(item => {
            if (!options[item.label]) {
                options[item.label] = {};
            }
            if (!options[item.label][item.value]) {
                options[item.label][item.value] = "";
            }
        });


        for (let option in options) {
            let value = options[option];
            let attr = "";
            for (let val in value) {
                attr = attr.concat(val).concat(", ");
            }
            attr = attr.substr(0, attr.length - 2);
            list.push({ label: option, value: attr })
        }

        return list.map(item => {
            return (
                <p key={`${item.label}-${item.value}`}>{item.label} : {item.value}</p>
            )
        })
    }
}

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
            isAddedToCart: false,
            options: {},
            optionIds: [],
            quantity: 1,
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.loadCurrentProduct();
        let cart = localStorage.getItem("cart");
        cart = cart ? JSON.parse(cart) : [];

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id == this.state.id) {
                this.setState({
                    isAddedToCart: !this.state.isAddedToCart
                })

            }
        }
    }

    loadCurrentProduct = () => {
        const { id } = this.state;
        if (id) {
            this.getProduct(id);
            this.getMedia(id)
        }
    }

    getProduct = (id) => {
        ApiController.get(`${PRODUCT_SELLER.all}/${id}`, {}, data => {
            let arr = [];
            data.productEditOptions.forEach(item => {
                arr.push({ label: item.option.attribute.label, value: item.option.label })
            });
            this.setState({
                product: data,
                properties: arr
            })
        })
    }

    getMedia = (id) => {
        ApiController.get(`${PRODUCT_SELLER.all}/${id}/media`, {}, data => {
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
        const quantity = this.state.quantity || 1;
        const product = { id, name, featureImage, priceMin, priceMax, quantity };

        let cart = localStorage.getItem("cart");

        if (cart === null) cart = [];
        else cart = JSON.parse(cart);

        for (let i = 0; i < cart.length; i++)
            if (cart[i].id === product.id) return;

        cart.push(product);

        localStorage.setItem("cart", JSON.stringify(cart));
    };

    setProductAttribute = (data) => {
        let optionId = [];
        for (var items in data) {
            let arr = data[items];
            arr.map(item => {
                optionId.push(item.id);
            })
        }

        this.setState({
            optionIds: optionId
        });
    }

    render() {
        const { product, detailImages, isAddedToCart, properties } = this.state;

        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12" >
                        <Row>
                            <Colxx xxs="6" style={{ textAlign: "center" }}>
                                {
                                    detailImages.length > 0 && <GlideComponentThumbs settingsImages={
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
                                }
                            </Colxx>
                            <Colxx xxs="6">
                                <h2>{product.name}</h2>
                                <Row className="mt-3">
                                    <Colxx xxs="6">
                                        <p className="product-price">{numberWithCommas(parseInt(product.priceMin))} VNĐ</p>
                                        <p className="product-price">{numberWithCommas(parseInt(product.futurePriceMin))} VNĐ</p>
                                        <div className="mt-3">
                                            <h3 >Thuộc tính sản phẩm</h3>
                                            {
                                                renderOptions(properties)
                                            }
                                        </div>
                                    </Colxx>
                                    <Colxx xxs="6">
                                        <p >Sản lượng bán tại site gốc 1244</p>
                                    </Colxx>
                                </Row>
                                <Row>
                                    <div>
                                        <p className="float-left mt-3 ml-3">Số lượng</p>
                                        <Label className="form-group has-float-label float-left ml-5">
                                            <Input
                                                type="number"
                                                name="quantity"
                                                min={0}
                                                value={this.state.quantity}
                                                // defaultValue="0"
                                                onChange={e => {
                                                    this.setState({
                                                        quantity: e.target.value
                                                    })
                                                }}
                                            />
                                        </Label>
                                    </div>
                                </Row>
                                <Row className="mt-3">
                                    <Colxx xxs="12">
                                        <div className="text-left card-title float-left">
                                            <Button
                                                className="mr-2"
                                                color="primary"
                                                onClick={() => {
                                                    if (!isAddedToCart) {
                                                        this.addToCart();
                                                        this.setState({
                                                            isAddedToCart: true
                                                        });
                                                    } else {
                                                        window.open("/store/cart")
                                                    }
                                                }}
                                            >
                                                {__(this.messages, isAddedToCart ? "Đặt ngay" : "Thêm vào giỏ")}
                                            </Button>
                                        </div>

                                    </Colxx>
                                </Row>
                            </Colxx>
                        </Row>
                    </Colxx>
                </Row>
                <Row className="mt-5">
                    <Colxx xxs="4" >
                        <div>
                            <p className="mt-3 ml-3">Thời gian phát hàng của xưởng {product.workshopIn} ngày</p>
                        </div>
                    </Colxx>
                    <Colxx xxs="4" >
                        <div>
                            <p className="mt-3 ml-3">Hình thức vận chuyển {product.transportation}</p>
                        </div>
                    </Colxx>
                    <Colxx xxs="4" >
                        <div>
                            <p className="mt-3 ml-3">Thời gian giao hàng Ubox {product.uboxIn} ngày</p>
                        </div>
                    </Colxx>
                </Row>
                <Row >
                    <Colxx xxs="4" >
                        <div>
                            <p className="mt-3 ml-3">Khối lượng {product.weight} kg</p>

                        </div>
                    </Colxx>
                    <Colxx xxs="4" >
                        <div>
                            <p className="mt-3 ml-3">SLA dịch vụ {product.serviceSla}</p>
                        </div>
                    </Colxx>
                    <Colxx xxs="4" >
                        <div>
                            <p className="mt-3 ml-3">Phí dịch vụ dự kiến {product.serviceCost}</p>
                        </div>
                    </Colxx>
                </Row>
                <Row className="mt-5">
                    <Colxx xxs="12" >
                        <h2 className="mt-3 ml-3">Mô tả sản phẩm</h2>
                        <p className="mt-3 ml-3">{product.description}</p>
                    </Colxx>
                </Row>
            </Fragment >
        );
    }
}

export default injectIntl(ProductDetail);