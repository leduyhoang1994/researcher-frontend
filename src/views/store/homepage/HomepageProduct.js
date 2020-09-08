import React from 'react';
import { injectIntl } from 'react-intl';
import { Card, CardBody, Badge, CardSubtitle, CardText, CardImg } from 'reactstrap';
import './HomepageProduct.scss';

class HomepageProduct extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.props.intl.messages;
    }

    render() {
        const { product } = this.props;
        return (
            <Card className="mb-4 product">
                <div className="position-relative">
                    <CardImg top src="/assets/img/card-thumb-4.jpg" alt="Card image cap" />
                    {
                        /* 
                            <Badge color="primary" pill className="position-absolute badge-top-left">NEW</Badge>
                            <Badge color="secondary" pill className="position-absolute badge-top-left-2">TRENDING</Badge> 
                        */
                    }
                </div>
                <CardBody className="product-body">
                    <CardSubtitle className="mb-2 product-subtitle">{product.title}</CardSubtitle>
                    <CardText className="product-price font-weight-bold text-right text-normal mb-0">{"500,000 VND"}</CardText>
                </CardBody>
            </Card>
        );
    }
}

export default injectIntl(HomepageProduct);