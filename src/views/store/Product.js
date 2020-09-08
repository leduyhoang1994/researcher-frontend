import React from 'react';
import { injectIntl } from 'react-intl';
import { Card, CardBody, Badge, CardSubtitle, CardText, CardImg } from 'reactstrap';

class Product extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.props.intl.messages;
    }

    render() {
        const {product} = this.props;
        return (
            <Card className="mb-4">
              <div className="position-relative">
                <CardImg top src="/assets/img/card-thumb-1.jpg" alt="Card image cap" />
                {/* <Badge color="primary" pill className="position-absolute badge-top-left">NEW</Badge>
                <Badge color="secondary" pill className="position-absolute badge-top-left-2">TRENDING</Badge> */}
              </div>
              <CardBody>
                <CardSubtitle className="mb-4">Homemade Cheesecake with Fresh Berries and Mint</CardSubtitle>
                <CardText className="text-muted text-small mb-0 font-weight-light">09.04.2018</CardText>
              </CardBody>
            </Card>
        );
    }
}

export default injectIntl(Product);