import React from 'react';
import { injectIntl } from 'react-intl';
import { Card, CardBody, Row } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import IntlMessages from '../../../helpers/IntlMessages';
import { Fragment } from 'react';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import HomepageProduct from './HomepageProduct';
import { Link } from 'react-router-dom';
import { CATEGORIES, PRODUCT_SELLER } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { searchPathStore } from "../../../constants/defaultValues";
import ProductList from '../product/ProductList';
import Category from '../category/Category';

const apiUrl = searchPathStore;
class Homepage extends React.Component {

    constructor(props) {
        super(props);
        let cart = localStorage.getItem("cart");
        if (cart === null || cart.trim() === "") {
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
        } else cart = JSON.parse(cart);

        this.state = {
            categories: {},
            products: [],
            categoryLv1: "",
            categoryLv2: "",
            categoryLv3: "",
            search: "",
            cart: cart,
            // cate: new URLSearchParams(this.props.location.search),

        };
        this.messages = this.props.intl.messages;
        console.log(this.props.history);
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts = (category) => {
        let array = [];
        let categoryLv1, categoryLv2, categoryLv3;
        if (category) {
            categoryLv1 = category[0];
            categoryLv2 = category[1] || "";
            categoryLv3 = category[2] || "";
            console.log(categoryLv1, categoryLv2, categoryLv3);
        } else {
            categoryLv1 = this.state.categoryLv1;
            categoryLv2 = this.state.categoryLv2;
            categoryLv3 = this.state.categoryLv3;
        }

        ApiController.post(PRODUCT_SELLER.filter, {
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

    render() {
        const { products } = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="3">
                        <Row>
                            <Colxx xxs="12">
                                <Category getProductByCategory={this.getProducts} />
                            </Colxx>
                        </Row>
                    </Colxx>
                    <Colxx xxs="9">
                        <Row>
                            <Colxx xxs="12">
                                <ProductList products={products} />
                            </Colxx>
                        </Row>
                    </Colxx>
                </Row>


            </Fragment>
        );
    }
}

export default injectIntl(Homepage);