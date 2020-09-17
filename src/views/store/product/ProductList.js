import React, { Component } from 'react';
import { Row} from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import Product from './Product';

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
            <Row>
                {products.map((product, index) => {
                    return (
                        <Colxx key={index} xxs="3" style={{ padding: "0 2px" }}>
                            <Product
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