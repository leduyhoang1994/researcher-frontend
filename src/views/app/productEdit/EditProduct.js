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
import { Redirect } from 'react-router-dom';
import { isFunction } from 'formik';

class EditProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id || null,
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
            featureImage: "",
            sourceProduct: {},
            sourceProductSelected: null,
            redirect: false,
            loading: false,
            isPublished: false
        };
        this.messages = this.props.intl.messages;
        this.handleChange = this.handleChange.bind(this);
    }

    setRedirect = (url) => {
        this.setState({
            redirect: url
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect push to={this.state.redirect} />
        }
    }

    async componentDidMount() {

        this.setState({ loading: true });
        await this.getCategories();
        const productId = new URLSearchParams(this.props.location.search).get("product-id");
        const productAddId = new URLSearchParams(this.props.location.search).get("productId");
        if (productId) {
            const data = await ApiController.callAsync('get', `${PRODUCTS.allEdit}/source/${productId}`, {});
            const product = data.data.result;

            if (product?.id) {
                window.open(`/app/list-product/edit/${product.id}`, "_self");
            } else {
                window.open(`/app/list-product/add?productId=${productId}`, "_self");
            }
        }
        else if (productAddId) {
            ApiController.get(`${PRODUCTS.all}/${productAddId}`, {}, data => {
                this.setState({
                    sourceProduct: { productTitleVi: data.productTitleVi },
                    productId: productAddId
                })
            })

        } else {
            this.loadCurrentProduct();
        }
        this.setState({ loading: false });
    }

    loadCurrentProduct = () => {
        const { id } = this.state;
        if (id)
            this.getProduct(id);
    }

    getProduct = (id) => {
        ApiController.get(`${PRODUCTS.allEdit}/${id}`, {}, data => {
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
                featureImage: data.featureImage,
                sourceProduct: data.sourceProduct,
                isPublished: data.isPublished
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
        // const { productId } = this.state;

        const filter = {
            productTitleVi: {
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

    validateFields = async () => {
        const needToValidate = ["name", "priceMin", "priceMax", "futurePriceMin", "futurePriceMax", "serviceSla"
            , "serviceCost", "description", "transportation", "workshopIn", "uboxIn", "idCategory", "idCategory", () => {
                return [this.state.selectedOldProduct.value, "sourceProduct"]
            }];
        let success = true;
        for await (const field of needToValidate) {
            if (isFunction(field)) {
                const fieldData = field();
                if (fieldData[0] === "") {
                    success = false;
                    NotificationManager.error(`Trường ${fieldData[0]} cần phải nhập`);
                }
            } else {
                if (this.state[field] === "") {
                    success = false;
                    NotificationManager.error(`Trường ${field} cần phải nhập`);
                }
            }
        }

        return success;
    }

    editProduct = async () => {
        if (await this.validateFields()) {
            this.callApi();
        } else {
            return;
        }
    }

    callApi = async () => {
        if (this.state.id) {
            await Api.callAsync('put', PRODUCTS.allEdit, {
                id: parseInt(this.state.id),
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
                productId: this.state.productId,
                optionIds: this.state.optionIds,
                featureImage: this.state.featureImage,
                isPublished: this.state.isPublished,
            }).then(data => {
                // window.open(`/app/list-product/edit/${this.state.id}`, "_self")
                NotificationManager.success("Thành công", "Thành công");
                this.loadCurrentProduct();
            }).catch(error => {
                NotificationManager.warning("Cập nhật thất bại", "Thất bại");
            });
        } else {
            const data = await Api.callAsync('post', PRODUCTS.allEdit, {
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
                productId: this.state.productId,
                optionIds: this.state.optionIds,
                featureImage: this.state.featureImage,
                isPublished: this.state.isPublished,
            }).then(data => {
                return data.data;
                // window.open(`/app/list-product/edit/${this.state.id}`, "_self")
            }).catch(error => {
                return error.response?.data;
            });

            if (data.success) {
                NotificationManager.success("Thành công", "Thành công");
                window.open(`/app/list-product/edit/${data.result.id}`, "_self");
            } else {
                NotificationManager.warning("Thêm mới thất bại", "Thất bại");
                const message = data?.message;
                if (Array.isArray(message)) {
                    for (const mess of message) {
                        NotificationManager.warning(mess, "Thêm mới thất bại");
                    }
                } else {
                    NotificationManager.warning(message, "Thêm mới thất bại");
                }
            }
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <Fragment>
                    <div className="loading"></div>
                </Fragment>
            )
        }
        let { name, priceMin, priceMax, futurePriceMin, futurePriceMax, serviceSla, serviceCost, description, transportation, workshopIn, uboxIn } = this.state;
        return (
            <Fragment>
                {this.renderRedirect()}
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
                                            productId={this.state.id}
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
                                                        min={0}
                                                        value={priceMin}
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
                                                        onChange={this.handleChange}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Giá dự kiến Max")}
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
                                                        onChange={data => {
                                                            this.setState({
                                                                productId: data?.id,
                                                                sourceProductSelected: data
                                                            })
                                                        }
                                                        }
                                                        additional={{
                                                            page: 1
                                                        }}
                                                        value={
                                                            this.state.sourceProductSelected ||
                                                            (
                                                                this.state.sourceProduct ? {
                                                                    id: this.state.productId,
                                                                    productTitleVi: this.state.sourceProduct.productTitleVi

                                                                } : null
                                                            )
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
                                                        rows="1"
                                                        onChange={this.handleChange}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Thời gian giao hàng Ubox")}
                                                    </span>
                                                </Label>
                                            </Colxx>
                                        </Row>
                                        <Row>
                                        </Row>
                                    </Colxx>

                                    <Colxx xxs="12">
                                        <Label className="form-group has-float-label">
                                            <Input type="textarea"
                                                value={description}
                                                name="description"
                                                rows="5"
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
                                        color={this.state.isPublished ? "danger" : "success"}
                                        onClick={() => {
                                            this.setState({
                                                isPublished: !this.state.isPublished
                                            }, () => {
                                                this.editProduct();
                                            });
                                        }}
                                    >
                                        {__(this.messages, this.state.isPublished ? "Ngừng xuất bản" : "Xuất bản")}
                                    </Button>
                                    <Button
                                        className="mr-2"
                                        color="primary"
                                        onClick={() => {
                                            this.editProduct();
                                        }}
                                    >
                                        {__(this.messages, this.state.id ? "Cập nhật" : "Thêm mới")}
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