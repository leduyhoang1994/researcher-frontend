import React from 'react';
import { injectIntl } from 'react-intl';
import { Card, CardBody, Row } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import IntlMessages from '../../../helpers/IntlMessages';
import { Fragment } from 'react';
import { Colxx, Separator } from '../../../components/common/CustomBootstrap';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { Link } from 'react-router-dom';
import { CATEGORIES, PRODUCT_EDIT } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import Product from '../product/Product';

class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: new URLSearchParams(this.props.location.search),
            products: [],
        }
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts() {
        let search = this.state.search.get('s');
        let array = [];
        ApiController.post(PRODUCT_EDIT.filter, { productEditName: search, page: 0, size: 10 }, data => {
            console.log(data);
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
            <Row>
                {products[0] ? products.map((product, index) => {
                    return (
                        <Colxx xxs="3">
                            <Product key={index} product={product} />
                        </Colxx>
                    )
                }) : <h1 style={{textAlign: "center"}}>Nothing to show</h1>
                }
            </Row>
        );
    }
}

export default injectIntl(Filter);