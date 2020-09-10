import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Label, Input, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ApiController from '../../../helpers/Api';
import { CATEGORIES, PRODUCT_EDIT } from '../../../constants/api';
import { arrayColumn } from '../../../helpers/Utils';
import Product from './Product';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            categoryLv1: "",
            categoryLv2: "",
            categoryLv3: "",

        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts = () => {
        let array = [];
        const { categoryLv1, categoryLv2, categoryLv3 } = this.state;
        ApiController.post(PRODUCT_EDIT.filter, {
            categoryEditNameLv1: categoryLv1,
            categoryEditNameLv2: categoryLv2,
            categoryEditNameLv3: categoryLv3,
            page: 0,
            size: 10
        }, data => {
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

    handleClick = (id) => {
        window.open(`/store/products/detail/${id}`, "_self")
    }

    render() {
        const { products } = this.state;
        return (
            <Row>
                {products.map((product, index) => {
                    return (
                        <Colxx xxs="3" style={{ padding: "10px 2px" }}>
                            <Product
                                key={index}
                                product={product}
                                handleClick={this.handleClick}
                            />
                        </Colxx>
                    )
                })}


            </Row>
        )
    }
}
export default injectIntl(ProductList);