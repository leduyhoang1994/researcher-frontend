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
import { CATEGORIES, PRODUCTS } from '../../../constants/api';
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
            search: "",
            cart: cart,
        };
        this.messages = this.props.intl.messages;
    }

    // componentDidMount() {
    //     this.getProducts();
    // }

    getProducts = () => {
        let array = [];
        ApiController.get(PRODUCTS.allEdit, {}, data => {
            this.setState({
                products: data
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
                                <Category />
                            </Colxx>
                        </Row>
                    </Colxx>
                    <Colxx xxs="9">
                        <Row>
                            <Colxx xxs="12">
                                <ProductList />
                            </Colxx>
                        </Row>
                    </Colxx>
                </Row>


            </Fragment>
        );
    }
}

export default injectIntl(Homepage);