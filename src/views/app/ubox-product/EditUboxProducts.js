import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, Input, Label, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Select from 'react-select';
import { __ } from '../../../helpers/IntlMessages';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { UBOX_CATEGORIES, SOURCE_PRODUCTS, UBOX_PRODUCTS, TRANSPORTATION } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { jsonToFormData, numberWithCommas, parse } from '../../../helpers/Utils'
import Properties from './Properties';
import Api from '../../../helpers/Api';
import { copySamplePropertiesObj } from '../../../helpers/Utils'
import { NotificationManager } from '../../../components/common/react-notifications';
import Medias from './Medias';
import { AsyncPaginate } from 'react-select-async-paginate';
import { Redirect } from 'react-router-dom';
import { isFunction } from 'formik';
import CategoryModals from './CategoryModals';
import SourceProductInfoModal from './SourceProductInfoModal';
import "./style.scss";

class EditUboxProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id || null,
            isUpdating: false,
            product: {
                optionIds: [],
                sourceProduct: {},
                description: "",
                featureImage: "",
                isPublished: true,
                name: "",
                serviceCost: "",
                serviceSla: "",
                sourceProductId: "",
                transportationIds: [],
                uboxProductTransportations: [],
                uboxCategoryId: "",
                uboxIn: "",
                uboxProductOptions: [],
                weight: "",
                workshopIn: "",
                price: 0,
                internalPrice: 0,
                minPrice: 0,
                offerPrice: 0,
            },
            keyProperty: '',
            keyMedia: '',
            uboxProduct: {
                name: '',
                weight: 0,
                serviceSla: '',
                serviceCost: 0,
                description: '',
                transportationIds: [],
                featureImage: '',
                workshopIn: 0,
                uboxIn: 0,
                uboxCategoryId: 0,
                sourceProductId: 0,
                optionIds: [],
                isPublished: false,
                price: 0,
                internalPrice: 0,
                minPrice: 0,
                offerPrice: 0,
            },
            selectedCategory: "",
            selectedTransportation: "",
            optionUboxCategories: [],
            selectedSourceProduct: "",
            optionSourceProducts: [],
            sourceProductSelected: null,
            optionTrans: [],
            redirect: false,
            loading: false,
            files: [],
            fileBase64: [],
            mediaItems: {
                images: [],
                videos: []
            },
            isOpenCategoryModal: false,
            isSourceProductInfoModalOpen: false,
            sourceProductUrl: ''
        };
        this.messages = this.props.intl.messages;
        this.handleChangeText = this.handleChangeText.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.toggleOpenCategoryModal = this.toggleOpenCategoryModal.bind(this);
    }

    setRedirect = (url) => {
        this.setState({
            redirect: url
        })
    }

    toggleOpenCategoryModal() {
        this.setState({
            isOpenCategoryModal: !this.state.isOpenCategoryModal
        })
    }

    toggleSourceProductInfoModal = () => {
        this.setState({
            isSourceProductInfoModalOpen: !this.state.isSourceProductInfoModalOpen
        })
    }

    setSourceProductUrl = (sourceProductUrl) => {
        this.setState({
            sourceProductUrl: sourceProductUrl
        });
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
        await this.getUboxCategories();
        const productId = new URLSearchParams(this.props.location.search).get("product-id");
        const sourceProductId = new URLSearchParams(this.props.location.search).get("sourceProductId");
        if (productId) {
            const data = await ApiController.callAsync('get', `${UBOX_PRODUCTS.source}/${productId}`, {});
            const product = data.data.result;

            if (product?.id) {
                window.open(`/app/ubox-products/edit/${product.id}`, "_self");
            } else {
                window.open(`/app/ubox-products/add?sourceProductId=${productId}`, "_self");
            }
        }
        else if (sourceProductId) {
            //check if exist in ubox product
            const data = await ApiController.callAsync('get', `${UBOX_PRODUCTS.source}/${sourceProductId}`, {});
            const product = data?.data?.result;

            if (product?.id) {
                window.open(`/app/ubox-products/edit/${product?.id}`, "_self");
            }

            ApiController.get(`${SOURCE_PRODUCTS.all}/${sourceProductId}`, {}, data => {
                this.setState({
                    product: {
                        ...this.state.product,
                        sourceProduct: {
                            productTitleVi: data.productTitleVi
                        },
                        sourceProductId: sourceProductId,
                    }
                }, () => {
                    this.getSourceInfo(sourceProductId);
                })
            })

        } else {
            // NotificationManager.error("Sản phẩm không tồn tại!", "Thất bại");
            // window.open(`/app/research`, "_self")
            this.loadCurrentProduct();
        }
        this.getTransportation();
        this.setState({ loading: false });
    }

    getTransportation = () => {
        ApiController.get(TRANSPORTATION.all, {}, data => {
            let optionTrans = []
            data.forEach(item => {
                optionTrans.push({ label: item.name, value: item.name, id: item.id })
            })
            this.setState({
                optionTrans
            })
        });
    }

    loadCurrentProduct = () => {
        const { id } = this.state;
        if (id)
            this.getProduct(id);
    }

    getProduct = (id) => {
        ApiController.get(`${UBOX_PRODUCTS.all}/${id}`, {}, data => {
            let transportation = [];
            data.uboxProductTransportations.forEach(item => {
                transportation.push({ label: item.transportation.name, value: item.transportation.name, id: item.transportation.id })
            })

            this.setState({
                keyProperty: new Date().getTime(),
                keyMedia: new Date().getTime(),
                product: { ...data },
                mediaItems: copySamplePropertiesObj(data, this.state.mediaItems)
            })
            this.handleChangeTransportation(transportation);

            this.state.optionUboxCategories.forEach(item => {
                if (item.value === this.state.product.uboxCategoryId) {
                    this.setState({
                        selectedCategory: { label: item.label, value: item.value }
                    })
                }
            })

            this.state.optionSourceProducts.forEach(item => {
                if (item.value === this.state.product.sourceProductId) {
                    this.setState({
                        selectedSourceProduct: { label: item.label, value: item.value }
                    })
                }
            })
        })
    }

    getSourceProducts = async (search, loadedOptions, { page }) => {
        const data = await ApiController.getAsync(SOURCE_PRODUCTS.all, {
            sourceProductName: search,
            page: page,
            size: 20,
            type: "non-relation"
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

    getUboxCategories = async () => {
        const data = await ApiController.getAsync(UBOX_CATEGORIES.all, {});
        let tempOptions = [];
        let UboxCategories = [];
        data.data.result.forEach(item => {
            if (!tempOptions.includes(item.nameLv3)) {
                tempOptions.push(item.nameLv3);
                UboxCategories.push({ label: item.nameLv3, value: item.id })
            }
        })
        this.setState({ optionUboxCategories: UboxCategories });
    }

    handleChangeCategory = (data) => {
        let product = this.state.product;
        product.uboxCategoryId = data.value;
        this.setState({
            selectedCategory: data,
            product: product
        })
    };

    handleChangeTransportation = (data) => {
        let product = this.state.product;
        let transportationIds = []
        if (data.length > 0) {
            data.forEach(item => {
                transportationIds.push(item.id)
            })
        }
        this.setState({
            product: {
                ...product,
                transportationIds: transportationIds
            },
            selectedTransportation: data,
        })
    };

    handleChangeNumber(event) {
        let value = parseFloat(event.target.value);
        let product = this.state.product;
        product[event.target.name] = value
        this.setState({
            product: product
        });
    }

    handleChangeText(event) {
        let value = event.target.value;
        let product = this.state.product;
        product[event.target.name] = value
        this.setState({
            product: product
        });
    }

    setUboxProductAttribute = (data) => {
        let optionId = [];
        for (var items in data) {
            let arr = data[items];
            arr.forEach(item => {
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
        const needToValidate = [
            { name: "Tên sản phẩm" }, { price: "Giá ubox" },
            { internalPrice: "Giá nội bộ" }, { minPrice: "Giá bán tối thiểu" },
            { offerPrice: "Giá bán đề xuất" }, { serviceSla: "Dịch vụ SLA" },
            { transportationIds: "Hình thức vận chuyển" },
            { workshopIn: "Thời gian phát hàng của cửa hàng" },
            { uboxIn: "Thời gian giao hàng Ubox" }, { uboxCategoryId: "Ngành hàng" },
            () => {
                return [this.state.product.sourceProductId, { sourceProduct: "Nguồn sản phẩm" }]
            }];
        let success = true;
        for await (const field of needToValidate) {
            if (isFunction(field)) {
                const fieldData = field();
                if (fieldData[0] === "") {
                    success = false;
                    NotificationManager.error(`Trường ${fieldData[1].sourceProduct} cần phải nhập`);
                }
            } else {
                let fieldName = "", fieldValue = "";
                for (let key in field) {
                    fieldName = key;
                    fieldValue = field[key];
                }
                if ((this.state.product[fieldName] || "") === "") {
                    success = false;
                    NotificationManager.error(`Trường ${fieldValue} cần phải nhập`);
                }
            }
        }
        return success;
    }

    publishProduct = () => {
        const value = { ids: [this.state.id], status: this.state.product.isPublished }
        ApiController.call('put', `${UBOX_PRODUCTS.publish}`, value, data => {
            if (data) {
                NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
            }
        })
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

    getSourceInfo = async (id) => {
        const uboxPrice = await ApiController.callAsync('get', `${UBOX_PRODUCTS.info}/${id}`, {});
        if (uboxPrice && uboxPrice.data && uboxPrice.data.result) {
            this.setState({
                product: {
                    ...this.state.product,
                    ...uboxPrice.data.result
                },
            })
        }
    }

    callApi = async () => {
        const { files } = this.state;
        let { product } = this.state;
        product.featureImage = product.featureImage ? product.featureImage.replace(`${process.env.REACT_APP_MEDIA_BASE_PATH}`, "") : product.featureImage;
        this.setState({ isUpdating: true });
        if (this.state.id) {
            // let product = this.state.product;
            // product.id = parseInt(this.state.id);
            let formData = new FormData()

            formData = jsonToFormData(copySamplePropertiesObj(product, this.state.uboxProduct), formData)
            if (files) {
                if (files.length > 20) {
                    NotificationManager.warning(`Số lượng files media vượt quá số hạn định mức! (${files.length}/20 files)`, "Cảnh báo");
                    this.setState({ isUpdating: false });
                    return;
                }
                files.forEach(file => {
                    formData.append("file", file);
                });
            }

            formData.append('id', parseInt(this.state.id));

            await Api.callAsync('put', UBOX_PRODUCTS.all,
                formData
            ).then(data => {
                NotificationManager.success("Cập nhật thành công", "Thành công");
                this.loadCurrentProduct();
                this.setState({
                    keyMedia: new Date().getTime(),
                    keyProperty: new Date().getTime(),
                    files: [],
                    fileBase64: []
                });
            }).catch(error => {
                NotificationManager.warning("Cập nhật thất bại", "Thất bại");
            });
        } else {
            let formData = new FormData()

            formData = jsonToFormData(copySamplePropertiesObj(this.state.product, this.state.uboxProduct), formData)

            if (files) {
                if (files.length > 20) {
                    NotificationManager.warning(`Số lượng files media vượt quá số hạn định mức! (${files.length}/20 files)`, "Cảnh báo");
                    this.setState({ isUpdating: false });
                    return;
                }
                files.forEach(file => {
                    formData.append("file", file);
                });
            }

            const data = await Api.callAsync('post', UBOX_PRODUCTS.all,
                formData
            ).then(data => {
                return data.data;
            }).catch(error => {
                return error.response?.data;
            });

            if (data.success) {
                NotificationManager.success("Thêm mới thành công", "Thành công", 1500);
                this.setState({
                    keyMedia: new Date().getTime(),
                    keyProperty: new Date().getTime(),
                    files: [],
                    fileBase64: []
                })
                setTimeout(() => {
                    window.open(`/app/ubox-products/edit/${data.result.id}`, "_self");
                }, 2000);

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
        this.setState({ isUpdating: false });
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
                                        <Medias
                                            sourceProductId={this.state.id}
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
                                        <div className="d-flex flex-grow-1 min-width-zero">
                                            <Label className="form-group has-float-label w-90">
                                                <Select
                                                    className="react-select"
                                                    classNamePrefix="react-select"
                                                    options={this.state.optionUboxCategories}
                                                    value={this.state.selectedCategory}
                                                    onChange={this.handleChangeCategory}
                                                />
                                                <span>
                                                    {__(this.messages, "Ngành hàng *")}
                                                </span>
                                            </Label>
                                            <span className="w-10">
                                                <Button
                                                    outline
                                                    className="button"
                                                    color="primary"
                                                    onClick={() => {
                                                        this.toggleOpenCategoryModal()
                                                    }}
                                                >
                                                    <i className="iconsminds-add align-middle" />
                                                </Button>
                                            </span>
                                        </div>
                                        <Label className="form-group has-float-label">
                                            <Input
                                                type="text"
                                                value={product.name}
                                                name="name"
                                                onChange={this.handleChangeText}
                                            />
                                            <span>
                                                {__(this.messages, "Tên sản phẩm *")}
                                            </span>
                                        </Label>
                                        <Row>
                                            <Colxx xxs="6">
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        disabled={true}
                                                        type="number"
                                                        name="price"
                                                        min={0}
                                                        value={numberWithCommas(Number.parseFloat(product.price).toFixed(0))}
                                                        onChange={e => {
                                                            this.handleChangeNumber(e)
                                                        }}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Giá Ubox (VNĐ)*")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        disabled={true}
                                                        type="number"
                                                        min={0}
                                                        name="internalPrice"
                                                        value={numberWithCommas(Number.parseFloat(product.internalPrice).toFixed(0))}
                                                        onChange={e => {
                                                            this.handleChangeNumber(e)
                                                        }}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Giá nội bộ (VNĐ)*")}
                                                    </span>
                                                </Label>
                                            </Colxx>
                                            <Colxx xxs="6">
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        disabled={true}
                                                        type="number"
                                                        name="minPrice"
                                                        value={numberWithCommas(Number.parseFloat(product.minPrice).toFixed(0))}
                                                        min={0}
                                                        onChange={e => {
                                                            this.handleChangeNumber(e)
                                                        }}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Giá bán tối thiểu (VNĐ)*")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        disabled={true}
                                                        type="number"
                                                        name="offerPrice"
                                                        value={numberWithCommas(Number.parseFloat(product.offerPrice).toFixed(0))}
                                                        min={0}
                                                        onChange={e => {
                                                            this.handleChangeNumber(e)
                                                        }}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Giá bán đề xuất (VNĐ)*")}
                                                    </span>
                                                </Label>
                                            </Colxx>
                                        </Row>
                                        <Row>
                                            <Colxx xxs="12">
                                                <Properties
                                                    key={keyProperty}
                                                    component={this}
                                                    uboxCategoryId={product.uboxCategoryId} // category id of product
                                                    uboxProductOptions={product.uboxProductOptions} // options fields of product data
                                                    setUboxProductAttribute={this.setUboxProductAttribute} // callback function, called everytime product property change
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
                                                        isDisabled={!!this.state.id}
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        defaultOptions
                                                        getOptionLabel={(option) => option.productTitleVi}
                                                        getOptionValue={(option) => option.id}
                                                        loadOptions={this.getSourceProducts}
                                                        onChange={async data => {
                                                            this.getSourceInfo(data?.id);
                                                            this.setState({
                                                                product: {
                                                                    ...this.state.product,
                                                                    sourceProductId: data?.id,
                                                                },
                                                                sourceProductSelected: data
                                                            })
                                                        }
                                                        }
                                                        additional={{
                                                            page: 0
                                                        }}
                                                        value={
                                                            this.state.sourceProductSelected ||
                                                            (
                                                                product.sourceProduct ? {
                                                                    id: product.sourceProductId,
                                                                    productTitleVi: product.sourceProduct.productTitleVi

                                                                } : null
                                                            )
                                                        }
                                                    />
                                                    <span>
                                                        {__(this.messages, "Nguồn sản phẩm *")}
                                                    </span>
                                                    <a href="#" className="text-small" onClick={this.toggleSourceProductInfoModal} style={{ fontStyle: "italic" }}>
                                                        Xem thông tin sản phẩm nguồn
                                                    </a>
                                                    <SourceProductInfoModal
                                                        sourceProductId={
                                                            this.state.sourceProductSelected?.value ||
                                                            (
                                                                product.sourceProduct ? product.sourceProductId : null
                                                            )
                                                        }
                                                        isOpen={this.state.isSourceProductInfoModalOpen}
                                                        toggle={this.toggleSourceProductInfoModal}
                                                        setSourceProductUrl={this.setSourceProductUrl}
                                                    />
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="text"
                                                        name="serviceSla"
                                                        value={product.serviceSla}
                                                        onChange={this.handleChangeText}
                                                    />
                                                    <span>
                                                        {__(this.messages, "SLA dịch vụ *")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        // disabled={true}
                                                        type="number"
                                                        min={0}
                                                        name="weight"
                                                        value={product.weight}
                                                        onChange={e => {
                                                            this.handleChangeNumber(e)
                                                        }}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Khối lượng (kg)*")}
                                                    </span>
                                                </Label>
                                            </Colxx>
                                            <Colxx xxs="6">
                                                <Label className="form-group has-float-label">
                                                    <Select
                                                        isMulti
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        options={this.state.optionTrans}
                                                        value={this.state.selectedTransportation}
                                                        onChange={e => {
                                                            this.handleChangeTransportation(e)
                                                        }}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Hình thức vận chuyển *")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input
                                                        type="number"
                                                        name="workshopIn"
                                                        value={product.workshopIn}
                                                        min="0"
                                                        onChange={e => {
                                                            this.handleChangeNumber(e)
                                                        }}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Thời gian phát hàng của cửa hàng (Ngày)*")}
                                                    </span>
                                                </Label>
                                                <Label className="form-group has-float-label">
                                                    <Input type="number"
                                                        min="0"
                                                        name="uboxIn"
                                                        value={product.uboxIn}
                                                        onChange={e => {
                                                            this.handleChangeNumber(e)
                                                        }}
                                                    />
                                                    <span>
                                                        {__(this.messages, "Thời gian giao hàng Ubox (Ngày)*")}
                                                    </span>
                                                </Label>
                                            </Colxx>
                                        </Row>
                                    </Colxx>

                                    <Colxx xxs="12">
                                        <Label className="form-group has-float-label">
                                            <Input type="textarea"
                                                value={product.description}
                                                name="description"
                                                rows="5"
                                                onChange={this.handleChangeText}
                                            />
                                            <span>
                                                {__(this.messages, "Mô tả")}
                                            </span>
                                        </Label>
                                    </Colxx>
                                </Row>
                                <div className="text-right card-title">
                                    {
                                        this.state.id ? (
                                            <Button
                                                disabled={this.state.isUpdating}
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
                                                        this.publishProduct();
                                                    });
                                                }}
                                            >
                                                {__(this.messages, product.isPublished ? "Ngừng xuất bản" : "Xuất bản")}
                                            </Button>) : (<></>)
                                    }
                                    <Button
                                        disabled={this.state.isUpdating}
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
                {/* <Row className="mt-4">
                    <Colxx xxs="12">
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    Sản phẩm gốc
                                </CardTitle>
                                <iframe
                                    width="100%"
                                    height="768"
                                    src={this.state.sourceProductUrl}
                                />
                            </CardBody>
                        </Card>
                    </Colxx>
                </Row> */}
                <CategoryModals
                    key={this.state.isOpenCategoryModal}
                    isOpenModal={this.state.isOpenCategoryModal}
                    toggleOpenCategoryModal={this.toggleOpenCategoryModal}
                    getUboxCategories={this.getUboxCategories}
                />
            </Fragment >
        );
    }
}

export default injectIntl(EditUboxProducts);