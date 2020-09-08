import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Label, Input, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../../helpers/IntlMessages';
import ApiController from '../../../../helpers/Api';
import { CATEGORIES, PRODUCTS } from '../../../../constants/api';
import { arrayColumn } from '../../../../helpers/Utils';
import Order from './Order';

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts = () => {
        let array = [];
        ApiController.get(PRODUCTS.allEdit, {}, data => {
            this.setState({
                orders: data
            }, () => {
                this.state.orders.forEach(item => {
                    if (!item.featureImage) item.featureImage = '/assets/img/default-image.png';
                    array.push(item);
                });
                this.setState({
                    orders: array
                })
            })
        })
    }

    render() {
        const { orders } = this.state;
        return (
            <div>
                <Fragment>
                    <Row>
                        <Colxx xxs="12">
                            <Breadcrumb heading="Danh sách sản phẩm" match={this.props.match} />
                            <Separator className="mb-5" />
                        </Colxx>
                    </Row>
                    <Row >
                        {orders.map((order, index) => {
                            return (
                                <Colxx xxs="3">
                                    <Order key={index} order={order} />
                                </Colxx>
                            )
                        })}

                    </Row>

                </Fragment>
            </div>
        )
    }
}
export default injectIntl(OrderList);