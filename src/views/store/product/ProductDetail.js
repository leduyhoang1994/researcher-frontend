import React, { Component, Fragment } from 'react';
import { Row, Input, Label, Button, Card, CardBody } from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { changeCount } from "../../../redux/actions";
import { connect } from "react-redux";
import { __ } from '../../../helpers/IntlMessages';
import { PRODUCT_SELLER } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import GlideComponentThumbs from "../../../components/carousel/GlideComponentThumbs";
import { NotificationManager } from "../../../components/common/react-notifications";
import { currencyFormatVND } from "../../../helpers/Utils";
import Property from "./Property";
import { defaultImg } from '../../../constants/defaultValues';
// import { detailImages, detailThumbs } from "../../../data/carouselItems";


const convertOptions = properties => {
    let options = {};
    let list = [];
    if (properties) {
        properties.forEach(item => {
            if (!options[item.label]) {
                options[item.label] = {};
            }
            if (!options[item.label][item.value]) {
                options[item.label][item.value] = item.id;
            }
        });

        for (let option in options) {
            let value = options[option];
            let attr = [];
            for (let val in value) {
                attr.push({ label: option, value: val, id: value[val] })
            }
            list.push(attr)
        }

        return list;
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
            properties: [],
            isAddedToCart: false,
            options: null,
            optionIds: [],
            quantity: 1,
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.loadCurrentProduct();
        this.loadLocalStorage();
    }

    loadCurrentProduct = () => {
        const { id } = this.state;
        if (id) {
            this.getProduct(id);
        }
    }

    loadLocalStorage = () => {
        let cart = localStorage.getItem("cart");
        cart = cart ? JSON.parse(cart) : [];

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === this.state.id) {
                this.setState({
                    isAddedToCart: !this.state.isAddedToCart
                })

            }
        }
    }

    getProduct = (id) => {
        ApiController.get(`${PRODUCT_SELLER.all}/${id}`, {}, data => {
            let arr = [];
            data.uboxProductOptions.forEach(item => {
                arr.push({ label: item.option.attribute.label, value: item.option.label, id: item.option.id })
            });
            this.setState({
                product: data,
                properties: arr
            })
        })
    }

    addToCart = () => {
        const { optionIds, quantity } = this.state;
        const { id, name, featureImage, internalPrice, price, } = this.state.product;
        const property = [];
        this.state.properties.forEach(item => {
            if(optionIds.includes(item.id)) {
                return property.push(item.value)
            }
        })
        const product = { id, name, featureImage, internalPrice, price, quantity, optionIds, property };
        let cart = localStorage.getItem("cart");
        let flag = false;
        if (cart === null) cart = [];
        else cart = JSON.parse(cart);

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === product.id) {
                if (JSON.stringify(cart[i].optionIds) === JSON.stringify(product.optionIds)) {
                    cart[i].quantity += quantity;
                    flag = true;
                    break;
                }
            }
        }
        if (!flag) cart.push(product);

        localStorage.setItem("cart", JSON.stringify(cart));
        NotificationManager.success("Thêm giỏ hàng thành công", "Thành công", 1000);
    };

    setAttribute = (data) => {
        let list = [];
        if (data) {
            for (let value in data) {
                list.push(data[value])
            }
        }
        this.setState({
            optionIds: list
        });
    }

    handleChangeOptions = (newValue) => {
        this.setState({ optionsOwnProperties: newValue });
    };

    render() {
        const { product, properties } = this.state;
        const options = convertOptions(properties);
        const { images } = product;
        let listImages = [];
        if (images && product) {
            listImages.push({ id: 0, img: product.featureImage ? `${process.env.REACT_APP_MEDIA_BASE_PATH}${product.featureImage}` : `${process.env.REACT_APP_MEDIA_BASE_PATH}${defaultImg}` });
            let index = 0;
            for (let i = 0; i < images.length; i++) {
                if (product.featureImage !== images[i]) {
                    listImages.push({ id: ++index, img: images[i] ? `${process.env.REACT_APP_MEDIA_BASE_PATH}${images[i]}` : `${process.env.REACT_APP_MEDIA_BASE_PATH}${defaultImg}`});
                }
            }
        }
        return (
            <Fragment >
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.products" match={this.props.match} />
                        {/* <Separator className="mb-5" /> */}
                    </Colxx>
                </Row>
                <Row>
                    <Card className="p-4 w-100">
                        <CardBody>
                            <Row>
                                <Colxx xxs="6" className="align-center" >
                                    {
                                        images && <GlideComponentThumbs settingsImages={
                                            {
                                                bound: true,
                                                rewind: false,
                                                focusAt: 0,
                                                startAt: 0,
                                                gap: 5,
                                                perView: 1,
                                                data: listImages,
                                            }
                                        } settingsThumbs={
                                            {
                                                bound: true,
                                                rewind: false,
                                                focusAt: 0,
                                                startAt: 0,
                                                gap: 10,
                                                perView: 5,
                                                data: listImages,
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
                                <p className="product-price">{product?.price ? currencyFormatVND(parseFloat(product.price).toFixed(0)) + "đ": null}{}</p>
                                            <div className="mt-4">
                                                <h3>Thuộc tính sản phẩm</h3>
                                                <Property
                                                    properties={options}
                                                    setAttribute={this.setAttribute}
                                                />
                                            </div>
                                        </Colxx>
                                        <Colxx xxs="6">
                                            <p >Sản lượng bán tại site gốc 1244</p>
                                        </Colxx>
                                    </Row>
                                    <Row>
                                        <div className="mt-5">
                                            <p className="float-left mt-3 ml-3">Số lượng</p>
                                            <Label className="form-group has-float-label float-left ml-5">
                                                <Input
                                                    type="number"
                                                    name="quantity"
                                                    min={1}
                                                    value={this.state.quantity}
                                                    // defaultValue="0"
                                                    onChange={e => {
                                                        this.setState({
                                                            quantity: parseInt(e.target.value)
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
                                                        // if (!isAddedToCart) {
                                                        this.addToCart();
                                                        this.setState({
                                                            isAddedToCart: true
                                                        });
                                                        this.props.changeCount();
                                                        // } 
                                                        // else {
                                                        //     window.open("/store/cart", "_self")
                                                        // }
                                                    }}
                                                >
                                                    {__(this.messages, "Thêm vào giỏ")}
                                                </Button>
                                            </div>

                                        </Colxx>
                                    </Row>
                                </Colxx>
                            </Row>
                        </CardBody>
                    </Card>
                </Row>
                <Row className="mt-2">
                    <Card className="p-4 w-100">
                        <Row>
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
                            {/* <Colxx xxs="4" >
                                <div>
                                    <p className="mt-3 ml-3">Phí dịch vụ dự kiến {product.serviceCost}</p>
                                </div>
                            </Colxx> */}
                        </Row>
                    </Card>
                </Row>

                <Row className="mt-2">
                    <Card className="p-4 w-100">
                        <Row>
                            <Colxx xxs="12" >
                                <h2 className="mt-3 ml-3">Mô tả sản phẩm</h2>
                                <p className="mt-3 ml-3">{product.description}</p>
                            </Colxx>
                        </Row>
                    </Card>
                </Row>
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
    )(ProductDetail));