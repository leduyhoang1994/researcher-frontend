import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import Select, { Creatable } from 'react-select';
import { __ } from '../../../helpers/IntlMessages';
import { ReactTableAdvancedCard } from "../../../containers/ui/ReactTableCards";
import { CATEGORIES, PRODUCTS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { Link } from 'react-router-dom';
import ProductTable from './ProductTable';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            optionCategories: [],
            selectedCategory: "",
            products: [],
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        // this.getAllCategories();
        this.getProducts();
        // this.getProperties();
    }


    getProducts = (setId) => {
        ApiController.get(PRODUCTS.allEdit, {}, data => {
            let options = [];
            // data.forEach(item => {
            //     console.log(JSON.stringify(item));
            //     // let option = {};
            //     // option.label = item.label;
            //     // option.value = item.label;
            //     // options.push(option);
            // })
            this.setState({ products: data });
        });

    }
    getAllCategories = () => {
        ApiController.get(CATEGORIES.allEdit, {}, data => {
            let options = [];
            let tempOptions = [];
            data.forEach(item => {
                if (!tempOptions.includes(item.nameLv3)) tempOptions.push(item.nameLv3);
            })

            tempOptions.forEach(item => {
                options.push({ label: item, value: item });
            })

            this.setState({
                optionCategories: options
            });
        });
    }

    handleClickRow = (row) => {
        window.open(`/app/list-product/edit/${row.id}`, "_self")
    }

    render() {
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
                                                    onChange={e => {
                                                        this.setState({
                                                            search: e.target.value
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