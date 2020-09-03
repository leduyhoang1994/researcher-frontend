import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Select from 'react-select';
import { __ } from '../../../helpers/IntlMessages';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { CATEGORIES, PRODUCTS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import PicturesWall from '../../../containers/ui/PicturesWall';
import Property from './Property';

class EditProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setId: this.props.match.params.id || null,
            product: {},
            productName: "",
            idCategory: null,
            selectedCategory: "",
            priceMin: 0,
            priceMax: 0,
            futurePriceMin: 0,
            futurePriceMax: 0,
            description: "",
            optionsCategories: [],
            categories: [],
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        // this.loadCurrentProduct();
        // this.getProperties();
        this.getCategories();
    }

    loadCurrentProduct = () => {
        const { setId } = this.state;
        if (setId)
            this.getProduct(setId);
    }

    getCategories = () => {
        ApiController.get(CATEGORIES.allEdit, {}, data => {
            let tempOptions = [];
            let categories = [];
            console.log(JSON.stringify(data));
            data.forEach(item => {
                if (!tempOptions.includes(item.nameLv3)) {
                    tempOptions.push(item.nameLv3);
                    categories.push({ label: item.nameLv3, value: item.id })
                }
                console.log(categories);
            })
            this.setState({ optionsCategories: categories });
        });
    }

    handleChangeCategory = (data) => {
        this.setState({
            selectedCategory: data,
            idCategory: data.value
        })
    };

    render() {
        const { name, priceMin, priceMax, futurePriceMin, futurePriceMax } = this.state.product;
        const initialValues = { name, priceMin, priceMax, futurePriceMin, futurePriceMax };
        return (
            <div>
                <Fragment>
                    <Row>
                        <Colxx xxs="12">
                            <Breadcrumb heading="Sản phẩm" match={this.props.match} />
                            <Separator className="mb-5" />
                        </Colxx>
                    </Row>
                    <Row>
                        <Colxx xxs="5">
                            <PicturesWall />
                        </Colxx>
                        <Colxx xxs="1">
                        </Colxx>
                        <Colxx xxs="6">
                            <Label className="form-group has-float-label">
                                <Select
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={this.state.optionsCategories}
                                    value={this.state.selectedCategory}
                                    onChange={this.handleChangeCategory}
                                />
                                <span>
                                    {__(this.messages, "Ngành hàng")}
                                </span>
                            </Label>
                            <Label className="form-group has-float-label">
                                <Input
                                    type="text"
                                    onChange={e => {
                                        this.setState({
                                            name: e.target.value
                                        });
                                    }}
                                />
                                <span>
                                    {__(this.messages, "Tên sản phẩm")}
                                </span>
                            </Label>
                            <Row>
                                <Colxx xxs="6">
                                    <Label className="form-group has-float-label">
                                        <Input
                                            type="number"
                                            min="0"
                                            defaultValue="0"
                                            onChange={e => {
                                                this.setState({
                                                    priceMin: parseInt(e.target.value)
                                                });
                                            }}
                                        />
                                        <span>
                                            {__(this.messages, "Giá gốc Min")}
                                        </span>
                                    </Label>
                                    <Label className="form-group has-float-label">
                                        <Input
                                            type="number"
                                            min="0"
                                            defaultValue="0"
                                            onChange={e => {
                                                this.setState({
                                                    priceMax: parseInt(e.target.value)
                                                });
                                            }}
                                        />
                                        <span>
                                            {__(this.messages, "Giá gốc Max")}
                                        </span>
                                    </Label>
                                </Colxx>
                                <Colxx xxs="6">
                                    <Label className="form-group has-float-label">
                                        <Input
                                            type="number"
                                            min="0"
                                            defaultValue="0"
                                            onChange={e => {
                                                this.setState({
                                                    futurePriceMin: parseInt(e.target.value)
                                                });
                                            }}
                                        />
                                        <span>
                                            {__(this.messages, "Giá gốc Min")}
                                        </span>
                                    </Label>
                                    <Label className="form-group has-float-label">
                                        <Input
                                            type="number"
                                            min="0"
                                            defaultValue="0"
                                            onChange={e => {
                                                this.setState({
                                                    futurePriceMax: parseInt(e.target.value)
                                                });
                                            }}
                                        />
                                        <span>
                                            {__(this.messages, "Giá gốc Max")}
                                        </span>
                                    </Label>
                                </Colxx>
                            </Row>
                            <Row>
                                <Colxx xxs="12">
                                    <Property
                                        component={this}
                                        categoryId={this.state.idCategory} // category id of product
                                        productOptions={null} // options fields of product data
                                        setProductAttribute={null} // callback function, called everytime product property change
                                    />
                                </Colxx>
                            </Row>
                        </Colxx>
                    </Row>

                    <Row>
                        <Colxx xxs="12">
                            <Label className="form-group has-float-label">
                                <Input type="textarea"
                                    defaultValue={this.state.description} rows="5"
                                    onChange={e => {
                                        this.setState({
                                            description: e.target.value
                                        });
                                    }}
                                />
                                <span>
                                    {__(this.messages, "Mô tả")}
                                </span>
                            </Label>
                        </Colxx>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

export default injectIntl(EditProduct);