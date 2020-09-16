import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import Select from 'react-select';
import { __ } from '../../../helpers/IntlMessages';
import { CATEGORIES, PRODUCTS, PRODUCT_EDIT } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { Link } from 'react-router-dom';
import ProductTable from './ProductTable';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionCategories: [],
            selectedCategory: "",
            products: [],
            filter: {
                productEditName: this.props.match.params.search || "",
                categoryEditNameLv3: new URLSearchParams(this.props.location.search) || "",
                page: 0,
                size: 20
            }
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getProducts();
        this.getAllCategories();
    }

    getProducts = () => {
        let filter = this.state.filter;
        const category = this.state.filter.categoryEditNameLv3.get("cate") || "";
        filter.categoryEditNameLv3 = category;
        this.setState({
            filter: filter,
            selectedCategory: { label: category, value: category }
        })
        this.filterProducts();
    }

    filterProducts = () => {
        let array = [];
        let filter = this.state.filter;

        ApiController.post(PRODUCT_EDIT.filter, filter, data => {
            this.setState({
                products: data.productEdits
            }, () => {
                this.state.products.forEach(item => {
                    if (!item.featureImage) item.featureImage = '/assets/img/default-image.png';
                    array.push(item);
                });
                this.setState({
                    products: array
                })
            })
        })
    }

    getAllCategories = () => {
        ApiController.get(CATEGORIES.allEdit, {}, data => {
            let options = [];
            let tempOptions = [];
            data.forEach(item => {
                if (!tempOptions.includes(item.nameLv3)) {
                    tempOptions.push(item.nameLv3);
                    options.push({ label: item.nameLv3, value: item.nameLv3 })
                }
            })
            this.setState({
                optionCategories: options
            });
        });
    }

    searchProducts = () => {
        let url = "/app/list-product";
        const { filter, selectedCategory } = this.state;
        const search = filter.productEditName;
        if (selectedCategory.label) {
            if (search.trim()) {
                url = url.concat(`/${search}`);
            }
            url = url.concat(`?cate=${selectedCategory.label}`)
        } else {
            url = url.concat(`/${search}`);
        }
        window.open(url, "_self")
    }

    handleClickRow = (row) => {
        window.open(`/app/list-product/edit/${row.id}`, "_self")
    }

    render() {
        const { filter } = this.state;
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
                                                    defaultValue={filter.productEditName}
                                                    onChange={e => {
                                                        this.setState({
                                                            filter: {
                                                                ...this.state.filter,
                                                                productEditName: e.target.value
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
                                                    options={this.state.optionCategories}
                                                    value={this.state.selectedCategory}
                                                    onChange={(value) =>
                                                        this.setState({
                                                            filter: {
                                                                ...this.state.filter,
                                                                categoryEditNameLv3: value.value
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
                                    <ProductTable
                                        products={this.state.products}
                                        handleClickRow={this.handleClickRow}
                                    />
                                    <div className="text-right card-title">
                                        <Link to="/app/list-product/add">
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

export default injectIntl(Product);