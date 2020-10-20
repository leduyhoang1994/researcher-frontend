import React, { Component } from 'react';
import { Row } from "reactstrap";
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Product from './Product';
import LazyLoad from 'react-lazyload';
import "./style.scss";

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.messages = this.props.intl.messages;
    }

    handleClick = (id) => {
        window.open(`/store/products/detail/${id}`, "_self")
    }

    render() {
        const { products } = this.props;
        return (
            <LazyLoad>
                <Row>
                    {products.map((product, index) => {
                        return (
                            <Colxx key={index} xxs="2" id="column-each-product">
                                <Product
                                    product={product}
                                    handleClick={this.handleClick}
                                />
                            </Colxx>
                        )
                    })}
                </Row>
            </LazyLoad>
        )
    }
}
export default injectIntl(ProductList);