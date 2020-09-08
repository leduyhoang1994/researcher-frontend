import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Select from 'react-select';
import { __ } from '../../../helpers/IntlMessages';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { CATEGORIES, PRODUCTS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import Property from './Property';
import Api from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';
import Media from './Media';
import { AsyncPaginate } from 'react-select-async-paginate';

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
            serviceCost: "",
            description: "",
            transportation: "",
            workshopIn: "",
            uboxIn: "",
            idCategory: "",
            selectedCategory: "",
            optionCategories: [],
            selectedOldProduct: "",
            optionOldProducts: [],
            optionProperties: [],
            productId: "",
            options: {},
            optionIds: [],
            featureImage: ""
        };
        this.messages = this.props.intl.messages;
        this.handleChange = this.handleChange.bind(this)
    }

    async componentDidMount() {
        await this.getCategories();
        this.loadCurrentProduct();
    }

    loadCurrentProduct = () => {
        const { setId } = this.state;
        if (setId)
            this.getProduct(setId);
    }

    getProduct = (setId) => {
        ApiController.get(`${PRODUCTS.allEdit}/${setId}`, {}, data => {
            this.setState({
                name: data.name,
                priceMin: data.priceMin,
                priceMax: data.priceMax,
                futurePriceMin: data.futurePriceMin,
                futurePriceMax: data.futurePriceMax,
                serviceSla: data.serviceSla,
                serviceCost: data.serviceCost,
                description: data.description,
                transportation: data.transportation,
                workshopIn: data.workshopIn,
                uboxIn: data.uboxIn,
                idCategory: data.categoryEditId,
                productId: data.productId,
                options: data.productEditOptions,
                featureImage: data.featureImage
            })

            this.state.optionCategories.forEach(item => {
                if (item.value === this.state.idCategory) {
                    this.setState({
                        selectedCategory: { label: item.label, value: item.value }
                    })
                }
            })

            this.state.optionOldProducts.forEach(item => {
                if (item.value === this.state.productId) {
                    this.setState({
                        selectedOldProduct: { label: item.label, value: item.value }
                    })
                }
            })
        })
    }

    getOldProducts = async (search, loadedOptions, { page }) => {
        const filter = {
            productTitleVi : { 
                "$cont": `%${search}%`
            }
        };
        const data = await ApiController.getAsync(PRODUCTS.all, {
            s: JSON.stringify(filter),
            page: page,
            size: 20
        });

        const hasMore = data.data.result.page < data.data.result.pageCount;

        return {
            options: data.data.result.data,
            hasMore: hasMore,
            additional: {
                page: page + 1,
            },
        };
    }

    getCategories = async () => {
        const data = await ApiController.getAsync(CATEGORIES.allEdit, {});
        let tempOptions = [];
        let categories = [];
        // console.log(JSON.stringify(data));
        data.data.result.forEach(item => {
            if (!tempOptions.includes(item.nameLv3)) {
                tempOptions.push(item.nameLv3);
                categories.push({ label: item.nameLv3, value: item.id })
            }
        })
        this.setState({ optionCategories: categories });
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

    editProduct = () => {
        if (this.state.name !== "" && this.state.priceMin !== ""
            && this.state.priceMax !== "" && this.state.futurePriceMin !== ""
            && this.state.futurePriceMax !== "" && this.state.serviceSla !== ""
            && this.state.serviceCost !== "" && this.state.description !== ""
            && this.state.transportation !== "" && this.state.workshopIn !== ""
            && this.state.uboxIn !== "" && this.state.idCategory !== ""
            && this.state.selectedOldProduct.value !== "" && this.state.idCategory !== "") {

            this.callApi();
        } else {
            return;
        }
    }

    callApi = async () => {
        if (this.state.setId) {
            await Api.callAsync('put', PRODUCTS.allEdit, {
                id: parseInt(this.state.setId),
                name: this.state.name,
                priceMin: this.state.priceMin,
                priceMax: this.state.priceMax,
                futurePriceMin: this.state.futurePriceMin,
                futurePriceMax: this.state.futurePriceMax,
                serviceSla: this.state.serviceSla,
                serviceCost: this.state.serviceCost,
                description: this.state.description,
                transportation: this.state.transportation,
                workshopIn: this.state.workshopIn,
                uboxIn: this.state.uboxIn,
                categoryEditId: this.state.idCategory,
                productId: this.state.productId || this.state.selectedOldProduct.value,
                optionIds: this.state.optionIds,
                featureImage: this.state.featureImage,
            }).then(data => {
                // window.open(`/app/list-product/edit/${this.state.setId}`, "_self")
                NotificationManager.success("Thành công", "Thành công");
            }).catch(error => {
                NotificationManager.warning("Cập nhật thất bại", "Thất bại");
            });
        } else {
            console.log(this.state.attributeIds);
            await Api.callAsync('post', PRODUCTS.allEdit, {
                name: this.state.name,
                priceMin: this.state.priceMin,
                priceMax: this.state.priceMax,
                futurePriceMin: this.state.futurePriceMin,
                futurePriceMax: this.state.futurePriceMax,
                serviceSla: this.state.serviceSla,
                serviceCost: this.state.serviceCost,
                description: this.state.description,
                transportation: this.state.transportation,
                workshopIn: this.state.workshopIn,
                uboxIn: this.state.uboxIn,
                categoryEditId: this.state.idCategory,
                productId: this.state.productId || this.state.selectedOldProduct.value,
                optionIds: this.state.optionIds,
                featureImage: this.state.featureImage,
            }).then(data => {
                // console.log(JSON.stringify(data.categoryEdit.id));
                // window.open(`/app/list-product/edit/${this.state.setId}`, "_self")
                NotificationManager.success("Thành công", "Thành công");
            }).catch(error => {
                NotificationManager.warning("Thêm mới thất bại", "Thất bại");
            });
        }
    }

    render() {
        let { name, priceMin, priceMax, futurePriceMin, futurePriceMax, serviceSla, serviceCost, description, transportation, workshopIn, uboxIn } = this.state;
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
                                    <Colxx xxs="6">
                                        <Media
                                            key={this.state.featureImage !== ""}
                                            setFeatureImage={url => {
                                                this.setState({ featureImage: url })
                                            }}
                                            featureImage={this.state.featureImage}
                                        />
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
                                                        min={0}
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
                                                        min={0}
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
                                                    <AsyncPaginate
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        defaultOptions
                                                        // options={this.state.optionOldProducts}
                                                        // value={this.state.selectedOldProduct}
                                                        getOptionLabel={(option) => option.productTitleVi}
                                                        getOptionValue={(option) => option.id}
                                                        loadOptions={this.getOldProducts}
                                                        onChange={data =>
                                                            this.setState({
                                                                selectedOldProduct: data
                                                            })
                                                        }
                                                        additional={{ 
                                                            page: 1 
                                                        }}
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
                                                        onChange={this.handleChange}
                                                    />
                                                    <span>
                                                        {__(this.messages, "SLA dịch vụ")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        name="serviceCost"
                                                        value={serviceCost}
                                                        defaultValue={this.state.serviceCost}
                                                        onChange={this.handleChange}
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
                                                        onChange={this.handleChange}
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
                                                        onChange={this.handleChange}
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
                                                        onChange={this.handleChange}
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
                                                    key={this.state.productId}
                                                    component={this}
                                                    categoryId={this.state.idCategory} // category id of product
                                                    productOptions={this.state.options} // options fields of product data
                                                    setProductAttribute={this.setProductAttribute} // callback function, called everytime product property change
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
                                            this.editProduct();
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