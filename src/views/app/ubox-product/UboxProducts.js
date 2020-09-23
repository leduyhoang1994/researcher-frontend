import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import Select from 'react-select';
import { __ } from '../../../helpers/IntlMessages';
import { UBOX_CATEGORIES, UBOX_PRODUCTS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { Link } from 'react-router-dom';
import UboxProductTables from './UboxProductTables';
import { NotificationManager } from '../../../components/common/react-notifications';

class UboxProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionCategories: [],
            selectedCategory: "",
            products: [],
            filter: {
                uboxProductName: this.props.match.params.search || "",
                uboxCategoryNameLv3: new URLSearchParams(this.props.location.search) || [],
                page: 0,
                size: 999
            },
        };
        this.messages = this.props.intl.messages;
    }

    async componentDidMount() {
        await this.getProducts();
        await this.getAllCategories();
    }

    getProducts = () => {
        let filter = this.state.filter;
        const category = this.state.filter.uboxCategoryNameLv3.get("cate") || "";
        if(category !== "") {
            const listCategory = category.split(",");
            filter.uboxCategoryNameLv3 = listCategory;

            let selectedCategory = [];
            listCategory.forEach(category => {
                selectedCategory.push({label: category, value: category})
            })
            this.setState({
                filter: filter,
                selectedCategory: selectedCategory
            })
        } else {
            this.setState({
                filter: filter,
            })
        }
        
        this.filterProducts();
    }

    filterProducts = () => {
        let array = [];
        let filter = this.state.filter;
        console.log(filter);

        ApiController.callAsync('post', UBOX_PRODUCTS.search, filter)
            .then(data => {
                this.setState({
                    products: data.data.result.uboxProducts
                }, () => {
                    if (this.state)
                        this.state.products.forEach(item => {
                            if (!item.featureImage) item.featureImage = '/assets/products/default-image.png';
                            array.push(item);
                        });
                    this.setState({
                        products: array
                    })
                })
            }).catch(error => {
                console.log(JSON.stringify(error.response));
                NotificationManager.warning(error.response.data.message, "Thất bại", 1000);
                if (error.response.status === 401) {
                    setTimeout(function () {
                        NotificationManager.info("Yêu cầu đăng nhập tài khoản researcher!", "Thông báo", 2000);
                        setTimeout(function () {
                            window.open("/user/login", "_self")
                        }, 1500);
                    }, 1500);
                }
            });

        // ApiController.post(UBOX_PRODUCTS.filter, filter, data => {
        //     this.setState({
        //         products: data.uboxProducts || this.state.products
        //     }, () => {
        //         if (this.state)
        //         this.state.products.forEach(item => {
        //             if (!item.featureImage) item.featureImage = '/assets/products/default-image.png';
        //             array.push(item);
        //         });
        //         this.setState({
        //             products: array
        //         })
        //     })
        // })
    }

    getAllCategories = () => {
        ApiController.get(UBOX_CATEGORIES.all, {}, data => {
            let options = [];
            let tempOptions = [];
            data.forEach(item => {
                if (!tempOptions.includes(item.nameLv3)) {
                    tempOptions.push(item.nameLv3);
                    options.push({ label: item.nameLv3, value: item.nameLv3, id: item.id })
                }
            })
            this.setState({
                optionCategories: options
            });
        });
    }

    searchProducts = () => {
        let url = "/app/ubox-products";
        const { filter, selectedCategory } = this.state;
        const search = filter.uboxProductName;
        if (selectedCategory) {
            let listCategory = [];
            selectedCategory.forEach(category => {
                listCategory.push(category.label);
            })
            console.log(listCategory);
            if (search.trim()) {
                url = url.concat(`/${search}`);
            }
            url = url.concat(`?cate=${listCategory}`)
        } else {
            url = url.concat(`/${search}`);
        }
        window.open(url, "_self")
    }

    handleClickRow = (row) => {
        window.open(`/app/ubox-products/edit/${row.id}`, "_self")
    }

    render() {
        const { filter, products, optionCategories } = this.state;
        let listProducts = [];
        if (products && optionCategories) {
            products.forEach(product => {
                optionCategories.forEach(option => {
                    if (product.uboxCategoryId === option.id) {
                        product.nameLv3 = option.label;
                    }
                })
                listProducts.push(product)
            })
        }

        return (
            <div>
                <Fragment>
                    <Row>
                        <Colxx xxs="12">
                            <Breadcrumb heading="Sản phẩm" match={this.props.match} />
                            <Separator className="mb-5" />
                        </Colxx>
                    </Row>
                    <Row className="mb-4">
                        <Colxx xxs="12">
                            <Card>
                                <CardBody>
                                    <CardTitle>
                                        {__(this.messages, 'Bộ lọc')}
                                    </CardTitle>

                                    <Row>
                                        <Colxx xxs="12">
                                            <Label className="form-group has-float-label">
                                                <Input
                                                    type="text"
                                                    defaultValue={filter.uboxProductName}
                                                    onChange={e => {
                                                        this.setState({
                                                            filter: {
                                                                ...this.state.filter,
                                                                uboxProductName: e.target.value
                                                            }
                                                        });
                                                    }}
                                                />
                                                <span>
                                                    {__(this.messages, "Tên sản phẩm")}
                                                </span>
                                            </Label>
                                        </Colxx>
                                    </Row>

                                    <Row>
                                        <Colxx xxs="12">
                                            <Label className="form-group has-float-label">
                                                <Select
                                                    isMulti
                                                    options={this.state.optionCategories}
                                                    value={this.state.selectedCategory}
                                                    onChange={(value) =>
                                                        this.setState({
                                                            filter: {
                                                                ...this.state.filter,
                                                                uboxCategoryNameLv3: value.value
                                                            },
                                                            selectedCategory: value
                                                        })
                                                    }
                                                />
                                                <span>
                                                    {__(this.messages, "Thư mục")}
                                                </span>
                                            </Label>
                                        </Colxx>
                                    </Row>
                                    <div className="text-right">
                                        <Button
                                            onClick={this.searchProducts}
                                        >
                                            {__(this.messages, "Tìm kiếm")}
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Colxx>
                    </Row>
                    <Row>
                        <Colxx xxs="12">
                            <Card>
                                <CardBody>
                                    <CardTitle>
                                        {__(this.messages, 'Danh sách sản phẩm')}
                                    </CardTitle>
                                    <UboxProductTables
                                        products={listProducts}
                                        handleClickRow={this.handleClickRow}
                                    />
                                    <div className="text-right card-title">
                                        <Link to="/app/ubox-products/add">
                                            <Button
                                                className="mr-2"
                                                color="warning"
                                            >
                                                {__(this.messages, "Thêm sản phẩm")}
                                            </Button>
                                        </Link>
                                    </div>
                                </CardBody>

                            </Card>

                        </Colxx>
                    </Row>
                </Fragment>
            </div>
        );
    }
}

export default injectIntl(UboxProducts);