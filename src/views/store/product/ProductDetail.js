import React, { Component, Fragment } from 'react';
import { Row, Button, Card, CardBody } from 'reactstrap';
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
import { currencyFormatVND, numberFormat } from "../../../helpers/Utils";
import Property from "./Property";
import { defaultImg } from '../../../constants/defaultValues';
// import { detailImages, detailThumbs } from "../../../data/carouselItems";

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
            options: null,
            optionIds: [],
            quantity: 1,
            isLoading: true,
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.loadCurrentProduct();
    }

    loadCurrentProduct = () => {
        const { id } = this.state;
        if (id) {
            this.getProduct(id);
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
                properties: arr,
                isLoading: false
            })
        })
    }

    addToCart = () => {
        const { optionIds, quantity } = this.state;
        const { id, name, featureImage, weight, price, workshopIn, uboxProductTransportations } = this.state.product;
        const property = [];
        this.state.properties.forEach(item => {
            if(optionIds.includes(item.id)) {
                return property.push(item.value)
            }
        })
        let transportation = [];
        uboxProductTransportations.forEach(item => {
            let trans = item?.transportation;
            if(trans) {
                transportation.push({label: trans.name, value: trans.id})
            }
        })
        const product = { id, name, featureImage, transportation, weight, price, workshopIn, quantity, optionIds, property };
        let cart = localStorage.getItem("cart");
        let flag = false;
        if (cart === null) cart = [];
        else cart = JSON.parse(cart);

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === product.id) {
                if (JSON.stringify(cart[i].optionIds) === JSON.stringify(product.optionIds)) {
                    NotificationManager.info("Sản phẩm đã được thêm vào giỏ", "Thông báo", 1000);
                    flag = true;
                    break;
                }
            }
        }
        if (!flag) {
            cart.push(product);
            NotificationManager.success("Thêm giỏ hàng thành công", "Thành công", 1000);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
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

    convertOptions = properties => {
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
        } else {
            return null;
        }
    }

    handleChangeOptions = (newValue) => {
        this.setState({ optionsOwnProperties: newValue });
    };

    setDefaultImage = (images, product) => {
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
        return listImages;
    }
    
    convertTransportation = (product) => {
        let result = "";
        if(product && product.uboxProductTransportations) {
            product.uboxProductTransportations.forEach(item => {
                result = result.concat(item.transportation.name).concat(", ")       
            })
            if(result.length > 2) {
                result = result.substr(0, result.length - 2);
            }
        }
        return result;
    }

    renderLoading = () => {
        return (
            <div className="loading"></div>
        );
    }

    render() {
        const { product, properties } = this.state;
        const { images } = product;

        const options = this.convertOptions(properties);
        let listImages = this.setDefaultImage(images, product);
        let transportation = this.convertTransportation(product);

        if (this.state.isLoading) {
            return this.renderLoading();
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
                                            <p className="product-price">{product?.price ? currencyFormatVND(parseFloat(product.price).toFixed(0)): null} đ</p>
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
                                    <Row className="mt-5">
                                        <Colxx xxs="12">
                                            <div className="text-left card-title float-left">
                                                <Button
                                                    className="mr-2"
                                                    color="primary"
                                                    onClick={() => {
                                                        this.addToCart();
                                                        this.props.changeCount();
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
                                    <p className="mt-3 ml-3">Hình thức vận chuyển: {transportation} </p>
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
                                    <p className="mt-3 ml-3">Khối lượng {numberFormat(Number.parseFloat(product.weight), 3, ".", ",")} kg</p>

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