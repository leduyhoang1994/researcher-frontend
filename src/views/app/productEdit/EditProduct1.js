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
            name: "",
            priceMin: 0,
            priceMax: 0,
            futurePriceMin: 0,
            futurePriceMax: 0,
            serviceSla: "",
            serviceCost: null,
            description: "",
            transportation: "",
            workshopIn: null,
            uboxIn: null,
            idCategory: null,
            selectedCategory: "",
            optionCategories: [],
            selectedOldProduct: "",
            optionOldProducts: [],
        };
        this.messages = this.props.intl.messages;
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        this.loadCurrentProduct();
        // this.getProperties();
        this.getCategories();

        this.getOldProducts()
    }

    loadCurrentProduct = () => {
        const { setId } = this.state;
        if (setId)
            this.getProduct(setId);
    }

    getProduct = (setId) => {
        ApiController.get(`${PRODUCTS.allEdit}/${setId}`, {}, data => {
            console.log(JSON.stringify(data));
            this.setState({ product: data })
        })
    }

    getOldProducts = () => {
        let options = [];
        ApiController.get(PRODUCTS.all, {}, data => {
            data.forEach(item => {
                options.push({ label: item.productTitleCn, value: item.id })
            })
            this.setState({ optionOldProducts: options })
        })
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
            })
            this.setState({ optionCategories: categories });
        });
    }

    handleChangeCategory = (data) => {
        this.setState({
            selectedCategory: data,
            idCategory: data.value
        })
    };

    handleChange(event) {
        const value = event.target.value;
        this.setState({
            ...this.state,
            [event.target.name]: value
        });
    }

    render() {
        let { name, priceMin, priceMax, futurePriceMin, futurePriceMax, serviceSla, serviceCost, description, transportation, workshopIn, uboxIn } = this.state;
        console.log(priceMin);
        const initialValues = { name, priceMin, priceMax, futurePriceMin, futurePriceMax };
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="Sản phẩm" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12">
                        <Card>
                            <CardBody>
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
                                                options={this.state.optionCategories}
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
                                                value={name}
                                                name="name"
                                                onChange={this.handleChange}
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
                                                        name="priceMin"
                                                        defaultValue={0}
                                                        min={0}
                                                        value={priceMin}
                                                        // defaultValue="0"
                                                        onChange={this.handleChange}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Giá gốc Min")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="number"
                                                        name="priceMax"
                                                        value={priceMax}
                                                        min={0}
                                                        defaultValue={0}
                                                        onChange={this.handleChange}
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
                                                        name="futurePriceMin"
                                                        value={futurePriceMin}
                                                        min="0"
                                                        defaultValue="0"
                                                        onChange={this.handleChange}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Giá dự kiến Min")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="number"
                                                        name="futurePriceMax"
                                                        value={futurePriceMax}
                                                        min="0"
                                                        defaultValue="0"
                                                        onChange={this.handleChange}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Giá dự kiến Max")}
                                                    </span>
                                                </Label>
                                            </Colxx>
                                        </Row>
                                        <Row>
                                            {/* <Property categoryId={this.state.idCategory} /> */}
                                        </Row>
                                    </Colxx>
                                </Row>
                                <Row>
                                    <Colxx xxs="12">
                                        <Row>
                                            <Colxx xxs="6">
                                                <Label className="form-group has-float-label">
                                                    <Select
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        options={this.state.optionOldProducts}
                                                        value={this.state.selectedOldProduct}
                                                        onChange={data =>
                                                            this.setState({
                                                                selectedOldProduct: data
                                                            })
                                                        }
                                                    />
                                                    <span>
                                                        {__(this.messages, "Nguồn sản phẩm")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="text"
                                                        name="serviceSla"
                                                        value={serviceSla}
                                                        defaultValue={this.state.serviceSla}
                                                        onChange={e => {
                                                            this.setState({
                                                                serviceSla: e.target.value
                                                            });
                                                        }}
                                                    />
                                                    <span>
                                                        {__(this.messages, "SLA dịch vụ")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="number"
                                                        name="serviceCost"
                                                        value={serviceCost}
                                                        defaultValue={this.state.serviceCost}
                                                        onChange={e => {
                                                            this.setState({
                                                                serviceCost: e.target.value
                                                            });
                                                        }}
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
                                                        defaultValue={this.state.transportation}
                                                        onChange={e => {
                                                            this.setState({
                                                                transportation: e.target.value
                                                            });
                                                        }}
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
                                                        defaultValue={this.state.workshopIn}
                                                        onChange={e => {
                                                            this.setState({
                                                                workshopIn: e.target.value
                                                            });
                                                        }}
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
                                                        onChange={e => {
                                                            this.setState({
                                                                transportation: e.target.value
                                                            });
                                                        }}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Thời gian giao hàng Ubox")}
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

                                    <Colxx xxs="12">
                                        <Label className="form-group has-float-label">
                                            <Input type="textarea"
                                                value={description}
                                                name="description"
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
                                <div className="text-right card-title">
                                    <Button
                                        className="mr-2"
                                        color="primary"
                                        onClick={() => {
                                            this.editCategory();
                                        }}
                                    >
                                        {__(this.messages, this.state.setId ? "Cập nhật" : "Thêm mới")}
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

export default injectIntl(EditProduct);