import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, Input, Label, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Select from 'react-select';
import { __ } from '../../../helpers/IntlMessages';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { CATEGORIES, PRODUCTS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { jsonToFormData, parse } from '../../../helpers/Utils'
import Property from './Property';
import Api from '../../../helpers/Api';
import { copySamplePropertiesObj } from '../../../helpers/Utils'
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
            product: {
                optionIds: [],
                sourceProduct: {}
            },
            keyProperty: '',
            keyMedia: '',
            productEdit: {
                name: '',
                priceMax: 0,
                priceMin: 0,
                futurePriceMax: 0,
                futurePriceMin: 0,
                weight: 0,
                serviceSla: '',
                serviceCost: 0,
                description: '',
                transportation: '',
                featureImage: '',
                workshopIn: 0,
                uboxIn: 0,
                categoryEditId: 0,
                productId: 0,
                optionIds: [],
                isPublished: false
            },
            selectedCategory: "",
            optionCategories: [],
            selectedOldProduct: "",
            optionOldProducts: [],
            sourceProductSelected: null,
            redirect: false,
            loading: false,
            files: [],
            fileBase64: [],
            mediaItems: {
                images: [],
                videos: []
            }
        };
        this.messages = this.props.intl.messages;
        this.handleChange = this.handleChange.bind(this);
    }

    setRedirect = (url) => {
        this.setState({
            redirect: url
        })
    }

    handleFiles = async (fileList) => {
        let { files, fileBase64 } = this.state;
        const fileData = []

        for await (const file of fileList) {
            let content = await parse(file);
            fileData.push(`${file.type.split('/')[0]}#*#*#*#*#` + content);
        }

        files = [...files, ...Array.from(fileList)]
        fileBase64 = [...fileBase64, ...fileData]


        this.setState({
            files: files,
            fileBase64: fileBase64,
            keyMedia: new Date().getTime()
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

            // if (product?.id) {
            //     this.setRedirect(`/app/list-product/edit/${product.id}`);
            //     this.renderRedirect();
            // } else {
            //     this.setRedirect(`/app/list-product/add?productId=${productId}`);
            //     this.renderRedirect();
            // }
            if (product?.id) {
                window.open(`/app/list-product/edit/${product.id}`, "_self");
            } else {
                window.open(`/app/list-product/add?productId=${productId}`, "_self");
            }
        }
        else if (productAddId) {
            ApiController.get(`${PRODUCTS.all}/${productAddId}`, {}, data => {
                this.setState({
                    product: {
                        ...this.state.product,
                        sourceProduct: {
                            productTitleVi: data.productTitleVi
                        },
                        productId: productAddId
                    }
                })
            })

        } else {
            // NotificationManager.error("Sản phẩm không tồn tại!", "Thất bại");
            // window.open(`/app/research`, "_self")
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
                keyProperty: new Date().getTime(),
                keyMedia: new Date().getTime(),
                product: { ...data },
                mediaItems: copySamplePropertiesObj(data, this.state.mediaItems)
            })

            this.state.optionCategories.forEach(item => {
                if (item.value === this.state.product.categoryEditId) {
                    this.setState({
                        selectedCategory: { label: item.label, value: item.value }
                    })
                }
            })

            this.state.optionOldProducts.forEach(item => {
                if (item.value === this.state.product.productId) {
                    this.setState({
                        selectedOldProduct: { label: item.label, value: item.value }
                    })
                }
            })
        })
    }

    getOldProducts = async (search, loadedOptions, { page }) => {
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
        let product = this.state.product;
        product.categoryEditId = data.value;
        this.setState({
            selectedCategory: data,
            product: product
        })
    };

    handleChange(event) {
        let value = parseInt(event.target.value) || event.target.value;
        let product = this.state.product;
        product[event.target.name] = value
        this.setState({
            product: product
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
            product: {
                ...this.state.product,
                optionIds: optionId
            }
        });
    }

    validateFields = async () => {
        const needToValidate = ["name", "priceMin", "priceMax", "futurePriceMin", "futurePriceMax", "serviceSla"
            , "serviceCost", "description", "transportation", "workshopIn", "uboxIn", "categoryEditId", () => {
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
                if ((this.state.product[field] || "") == "") {
                    console.log(this.state.product[field])
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

    handleRemoveMediaServer = () => {
        this.getProduct(this.state.id)
    }

    handleRemoveMediaLocal = (index) => {
        let { files, fileBase64 } = this.state

        if (files && files[index]) {
            files.splice(index, 1)
        }
        if (fileBase64 && fileBase64[index]) {
            fileBase64.splice(index, 1)
        }

        this.setState({
            files: files,
            fileBase64: fileBase64
        })
    }

    callApi = async () => {
        const { files } = this.state
        if (this.state.id) {
            // let product = this.state.product;
            // product.id = parseInt(this.state.id);
            let formData = new FormData()

            formData = jsonToFormData(copySamplePropertiesObj(this.state.product, this.state.productEdit), formData)
            if (files) {
                files.forEach(file => {
                    formData.append("file", file);
                });
            }

            formData.append('id', parseInt(this.state.id));
            await Api.callAsync('put', PRODUCTS.allEdit,
                formData
            ).then(data => {
                NotificationManager.success("Cập nhật thành công", "Thành công");
                this.loadCurrentProduct();
                this.setState({
                    keyMedia: new Date().getTime(),
                    keyProperty: new Date().getTime(),
                    files: [],
                    fileBase64: []
                })
            }).catch(error => {
                NotificationManager.warning("Cập nhật thất bại", "Thất bại");
            });
        } else {
            let formData = new FormData()

            formData = jsonToFormData(copySamplePropertiesObj(this.state.product, this.state.productEdit), formData)

            if (files) {
                files.forEach(file => {
                    formData.append("file", file);
                });
            }

            const data = await Api.callAsync('post', PRODUCTS.allEdit,
                formData
            ).then(data => {
                return data.data;
            }).catch(error => {
                return error.response?.data;
            });

            if (data.success) {
                window.open(`/app/list-product/edit/${data.result.productEdit.id}`, "_self");
                NotificationManager.success("Thêm mới thành công", "Thành công");
                this.setState({
                    keyMedia: new Date().getTime(),
                    keyProperty: new Date().getTime(),
                    files: [],
                    fileBase64: []
                })

                this.setRedirect(`/app/list-product/edit/${data.result.productEdit.id}`);
                this.renderRedirect();
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

        const { fileBase64, product, keyMedia, mediaItems, keyProperty } = this.state
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
                                            key={keyMedia}
                                            setFeatureImage={url => {
                                                this.setState({
                                                    product: {
                                                        ...this.state.product,
                                                        featureImage: url
                                                    }
                                                })
                                            }}
                                            featureImage={product.featureImage}
                                            handleFiles={this.handleFiles}
                                            mediaItems={mediaItems}
                                            // files={files}
                                            fileBase64={fileBase64}
                                            handleRemoveMediaLocal={this.handleRemoveMediaLocal}
                                            handleRemoveMediaServer={this.handleRemoveMediaServer}
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
                                                value={product.name}
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
                                                        value={product.priceMin}
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
                                                        value={product.priceMax}
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
                                                        value={product.futurePriceMin}
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
                                                        value={product.futurePriceMax}
                                                        min={0}
                                                        onChange={this.handleChange}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Giá dự kiến Max")}
                                                    </span>
                                                </Label>
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
                                                        getOptionLabel={(option) => option.productTitleVi}
                                                        getOptionValue={(option) => option.id}
                                                        loadOptions={this.getOldProducts}
                                                        onChange={data => {
                                                            this.setState({
                                                                product: {
                                                                    ...this.state.product,
                                                                    productId: data?.id
                                                                },
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
                                                                product.sourceProduct ? {
                                                                    id: product.productId,
                                                                    productTitleVi: product.sourceProduct.productTitleVi

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
                                                        value={product.serviceSla}
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
                                                        value={product.serviceCost}
                                                        onChange={this.handleChange}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Phí dịch vụ dự kiến")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        name="weight"
                                                        value={product.weight}
                                                        onChange={this.handleChange}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Khối lượng")}
                                                    </span>
                                                </Label>
                                            </Colxx>
                                            <Colxx xxs="6">
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="text"
                                                        name="transportation"
                                                        value={product.transportation}
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
                                                        value={product.workshopIn}
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
                                                        value={product.uboxIn}
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
                                            <Colxx xxs="12">
                                                <Property
                                                    key={keyProperty}
                                                    component={this}
                                                    categoryId={product.categoryEditId} // category id of product
                                                    productOptions={product.productEditOptions} // options fields of product data
                                                    setProductAttribute={this.setProductAttribute} // callback function, called everytime product property change
                                                />
                                            </Colxx>
                                        </Row>
                                    </Colxx>

                                    <Colxx xxs="12">
                                        <Label className="form-group has-float-label">
                                            <Input type="textarea"
                                                value={product.description}
                                                name="description"
                                                rows="5"
                                                onChange={this.handleChange}
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
                                        color={product.isPublished ? "danger" : "success"}
                                        onClick={() => {
                                            let publish = this.state.product.isPublished;
                                            this.setState({
                                                product: {
                                                    ...this.state.product,
                                                    isPublished: !publish
                                                }

                                            }, () => {
                                                this.editProduct();
                                            });
                                        }}
                                    >
                                        {__(this.messages, product.isPublished ? "Ngừng xuất bản" : "Xuất bản")}
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