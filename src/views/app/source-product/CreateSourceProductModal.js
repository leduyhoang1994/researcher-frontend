import React, { Fragment } from 'react';
import { Button, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { Creatable } from 'react-select';
import { __ } from '../../../helpers/IntlMessages';
import { injectIntl } from 'react-intl';
import './style.scss';
import ApiController from '../../../helpers/Api';
import { SOURCE_CATEGORIES, SOURCE_PRODUCTS } from '../../../constants/api';
import { NotificationManager } from '../../../components/common/react-notifications';

class CreateSourceProductModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sourceProduct: {
                numberOfComments: null,
                procurementRepetitionRate: null,
                logisticFee: null,
                crossBorderWeight: null,
                shopName: null,
                shopLink: null,
                shopLocation: null,
                site: null,
                siteId: null,
                productTitleCn: null,
                productTitleVi: null,
                productImage: null,
                productLink: null,
                productLink2: null,
                productCategoryCn: null,
                productCategoryVi: null,
                priceStr: null,
                minPrice: null,
                maxPrice: null,
                monthlySale: null,
                sourceCategoryId: null,
                countrySite: null,
            },
            listSite: [],
            listCountry: [
                { label: 'Trung', value: 'Trung' },
                { label: 'Việt', value: 'Viet' },
            ],
            listCategoryCn: [],
            listCategoryVi: []
        }

        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.loadData()
    }

    handleCreateOptions = async (value, type) => {
        this.setDataSourceProduct(type, value)
    }

    handleChangeOption = (event, type) => {
        this.setDataSourceProduct(type, event?.value)
    }

    handleChangeText = (event) => {
        const name = event.target.name
        const value = event.target.value
        this.setDataSourceProduct(name, value)
    }

    setDataSourceProduct = (name, value) => {
        const { sourceProduct } = this.state
        sourceProduct[name] = value
        this.setState({
            sourceProduct: sourceProduct
        })
    }

    loadData = () => {
        ApiController.callAsync('get', SOURCE_CATEGORIES.site, {})
            .then(data => {
                let sites = [];
                data.data.result.forEach(item => {
                    let val = item['site'];
                    sites.push({ label: val, value: val })
                })
                this.setState({
                    listSite: sites
                });
            }).catch(error => {
                if (error.response) {
                    NotificationManager.warning(error.response.data.message, "Thất bại", 1000);
                }
            });

        ApiController.callAsync('get', SOURCE_CATEGORIES.all, {})
            .then(data => {
                let listCategoryCn = [];
                let listCategoryVi = [];
                data.data.result.forEach(item => {
                    let categoryCn = item['categoryNameCnLevel3'];
                    let categoryVi = item['categoryNameViLevel3'];
                    listCategoryCn.push({ label: categoryCn, value: categoryCn })
                    listCategoryVi.push({ label: categoryVi, value: categoryVi })
                })
                this.setState({
                    listCategoryCn: listCategoryCn,
                    listCategoryVi: listCategoryVi
                });
            }).catch(error => {
                if (error.response) {
                    NotificationManager.warning(error.response.data.message, "Thất bại", 1000);
                }
            });
    }

    createSourceProduct = () => {
        ApiController.callAsync('post', SOURCE_PRODUCTS.all, this.state.sourceProduct)
            .then(data => {
                NotificationManager.success('Thêm mới sản phẩm nguồn thành công!', "Thành công");
                // this.props.
                this.props.createdCallBack()
                this.props.toggle();
            }).catch(error => {
                if (error.response) {
                    NotificationManager.warning(error.response.data.message, "Thất bại", 1000);
                }
            });
    }

    render() {
        const { siteId, shopLocation, shopName, procurementRepetitionRate, productLink, numberOfComments, logisticFee, crossBorderWeight, shopLink, site, monthlySale, productTitleVi, countrySite, productTitleCn, productCategoryCn, productCategoryVi, productImage, minPrice, maxPrice } = this.state.sourceProduct
        const { listSite, listCountry, listCategoryVi, listCategoryCn } = this.state
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
                <ModalBody>
                    <ModalHeader>
                        Thêm mới sản phẩm nguồn
                    </ModalHeader>
                    <br />
                    <Fragment>
                        <Row>
                            <Colxx xxs="4">
                                <Label className="form-group has-float-label">
                                    <Creatable
                                        isClearable
                                        value={{ label: countrySite, value: countrySite }}
                                        options={listCountry}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        onChange={e => {
                                            this.handleChangeOption(e, 'countrySite')
                                        }}
                                        onCreateOption={e => {
                                            this.handleCreateOptions(e, 'countrySite')
                                        }}
                                    />
                                    <span>
                                        {__(this.messages, "Loại sàn")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Creatable
                                        isClearable
                                        value={{ label: productCategoryCn, value: productCategoryCn }}
                                        options={listCategoryCn}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        onChange={e => {
                                            this.handleChangeOption(e, 'productCategoryCn')
                                        }}
                                        onCreateOption={e => {
                                            this.handleCreateOptions(e, 'productCategoryCn')
                                        }}
                                    />
                                    <span>
                                        {__(this.messages, "Tên ngành hàng - Tiếng Trung")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="text"
                                        value={productTitleCn || ""}
                                        name="productTitleCn"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Tên sản phẩm - Tiếng Trung")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="text"
                                        value={productLink || ""}
                                        name="productLink"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Link sản phẩm")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="text"
                                        value={shopLocation || ""}
                                        name="shopLocation"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Địa chỉ phát hàng")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="number"
                                        value={Number.parseFloat(logisticFee) || ""}
                                        name="logisticFee"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Phí giao hàng nội địa")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="number"
                                        value={Number.parseFloat(numberOfComments).toFixed(0) || ""}
                                        name="numberOfComments"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Số lượng Comments")}
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="4">
                                <Label className="form-group has-float-label">
                                    <Creatable
                                        isClearable
                                        value={{ label: site, value: site }}
                                        options={listSite}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        onChange={e => {
                                            this.handleChangeOption(e, 'site')
                                        }}
                                        onCreateOption={e => {
                                            this.handleCreateOptions(e, 'site')
                                        }}
                                    />
                                    <span>
                                        {__(this.messages, "Sàn")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Creatable
                                        isClearable
                                        value={{ label: productCategoryVi, value: productCategoryVi }}
                                        options={listCategoryVi}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        onChange={e => {
                                            this.handleChangeOption(e, 'productCategoryVi')
                                        }}
                                        onCreateOption={e => {
                                            this.handleCreateOptions(e, 'productCategoryVi')
                                        }}
                                    />
                                    <span>
                                        {__(this.messages, "Tên ngành hàng - Tiếng Việt")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="text"
                                        value={productTitleVi || ""}
                                        name="productTitleVi"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Tên sản phẩm - Tiếng Việt")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="text"
                                        value={productImage || ""}
                                        name="productImage"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Link ảnh sản phẩm")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="number"
                                        value={crossBorderWeight || ""}
                                        name="crossBorderWeight"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Cân nặng")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="number"
                                        value={Number.parseFloat(minPrice) || ""}
                                        name="minPrice"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Giá min")}
                                    </span>
                                </Label>
                            </Colxx>
                            <Colxx xxs="4">
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="text"
                                        value={shopLink || ""}
                                        name="shopLink"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Link Shop")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="text"
                                        value={shopName || ""}
                                        name="shopName"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Tên Shop")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="number"
                                        value={procurementRepetitionRate || ""}
                                        name="procurementRepetitionRate"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Tỷ lệ khách quay lại")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="text"
                                        value={siteId || ""}
                                        name="siteId"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "ID sản phẩm trên trang nguồn")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="number"
                                        value={Number.parseFloat(monthlySale).toFixed(0) || ""}
                                        name="monthlySale"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Số lượng bán ra hàng tháng")}
                                    </span>
                                </Label>
                                <Label className="form-group has-float-label">
                                    <Input
                                        type="number"
                                        value={Number.parseFloat(maxPrice) || ""}
                                        name="maxPrice"
                                        onChange={this.handleChangeText}
                                    />
                                    <span>
                                        {__(this.messages, "Giá max")}
                                    </span>
                                </Label>

                            </Colxx>
                        </Row>

                        <div className="text-right card-title">
                            {
                                <Button
                                    className="mr-2"
                                    color="primary"
                                    onClick={() => {
                                        console.log(this.state.sourceProduct)
                                        this.props.toggle();
                                    }}
                                >Đóng</Button>
                            }
                            <Button
                                className="mr-2"
                                color="primary"
                                onClick={() => {
                                    this.createSourceProduct();
                                }}
                            >
                                {__(this.messages, "Thêm mới")}
                            </Button>
                        </div>

                    </Fragment>
                </ModalBody>
            </Modal>
        )
    }
}

export default injectIntl(CreateSourceProductModal);