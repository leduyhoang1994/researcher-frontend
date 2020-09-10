import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Select from 'react-select';
import { __ } from '../../../helpers/IntlMessages';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { CATEGORIES, PRODUCT_EDIT } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import Property from '../../app/productEdit/Property';
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
        };
        console.log(this.props);
        this.messages = this.props.intl.messages;
    }

    componentWillMount() {
        this.getMedia(this.state.id);
    }
    componentDidMount() {
        this.loadCurrentProduct();
    }

    loadCurrentProduct = () => {
        const { id } = this.state;
        if (id) {
            this.getProduct(id);
            // this.getMedia(id);
        }
    }

    getProduct = (id) => {
        ApiController.get(`${PRODUCT_EDIT.all}/${id}`, {}, data => {
            this.setState({
                product: data,
            })
        })
    }

    getMedia = (id) => {
        ApiController.get(`${PRODUCT_EDIT.all}/${id}/media`, {}, data => {
            const arr = data.images;
            // let images = [];
            arr.map((item, index) => {
                // images.push({id: index, img: item})
                this.setState({
                    detailImages: [...this.state.detailImages, { id: index, img: item }],
                })
            })
            // console.log(data.images);

        })
    }
    // , () => {
    //     const { media } = this.state.media;
    //     console.log(media.images);
    //     let arr = [];
    //     media.images.forEach(item => {
    //         arr.push({ id: 0, img: item })
    //     })
    //     this.setState({
    //         detailImages: arr
    //     })
    // }

    addToCart = () => {
        const { id, name, featureImage, priceMin, priceMax } = this.state.product;
        const quantity = 1;
        const product = { id, name, featureImage, priceMin, priceMax, quantity };

        let cart = localStorage.getItem("cart");

        if (cart === null) cart = [];
        else cart = JSON.parse(cart);

        for (let i = 0; i < cart.length; i++)
            if (cart[i].id === product.id) return;

        cart.push( product );

        localStorage.setItem("cart", JSON.stringify(cart));
    };

    render() {
        let { name, priceMin, priceMax, futurePriceMin, futurePriceMax, featureImage, serviceSla, serviceCost, description, transportation, workshopIn, uboxIn } = this.state.product;
        const detailImages = this.state.detailImages;

        console.log(detailImages);
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="Sản phẩm" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="6" className="col-left">
                        <Card className="mb-4" style={{ textAlign: "center" }}>
                            <CardBody>
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
                            </CardBody>
                        </Card>
                    </Colxx>
                    <Colxx xxs="6" className="col-right">
                        <h2>{name}</h2>
                        <p>{description}</p>
                    </Colxx>
                </Row>

                <Row>
                    <Colxx xxs="12">
                        <Card>
                            <CardBody>
                                <Row>
                                    <Colxx xxs="12">
                                        <Row>
                                            <Colxx xxs="6">
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="number"
                                                        name="priceMin"
                                                        value={priceMin}
                                                        defaultValue={priceMin}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Giá sản phẩm")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        name="serviceCost"
                                                        value={serviceCost}
                                                        defaultValue={serviceCost}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Phí dịch vụ dự kiến")}
                                                    </span>
                                                </Label>
                                            </Colxx>
                                            <Colxx xxs="6">
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="text"
                                                        name="transportation"
                                                        value={transportation}
                                                        defaultValue={transportation}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Hình thức vận chuyển")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="number"
                                                        name="workshopIn"
                                                        value={workshopIn}
                                                        min="0"
                                                        defaultValue={workshopIn}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Thời gian phát hàng của xưởng")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input type="number"
                                                        min="0"
                                                        name="uboxIn"
                                                        value={uboxIn}
                                                        defaultValue={this.state.uboxIn} rows="1"
                                                    />
                                                    <span>
                                                        {__(this.messages, "Thời gian giao hàng Ubox")}
                                                    </span>
                                                </Label>
                                            </Colxx>
                                        </Row>
                                        <Row>
                                            {/* <Colxx xxs="12">
                                                <Property
                                                    key={this.state.productId}
                                                    component={this}
                                                    categoryId={this.state.idCategory} // category id of product
                                                    productOptions={this.state.options} // options fields of product data
                                                    setProductAttribute={this.setProductAttribute} // callback function, called everytime product property change
                                                />
                                            </Colxx> */}
                                        </Row>
                                    </Colxx>

                                    <Colxx xxs="12">
                                        <Label className="form-group has-float-label">
                                            <Input type="textarea"
                                                value={description}
                                                name="description"
                                                defaultValue={description} rows="5"
                                            />
                                            <span>
                                                {__(this.messages, "Mô tả")}
                                            </span>
                                        </Label>
                                    </Colxx>
                                </Row>
                                <div className="text-right card-title">
                                    <Button
                                        className="mr-2"
                                        color="primary"
                                        onClick={() => {
                                            this.addToCart();
                                        }}
                                    >
                                        {__(this.messages, "Thêm vào giỏ")}
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </Colxx>
                </Row>
            </Fragment>
        );
    }
}

export default injectIntl(ProductDetail);