import React, { Component, Fragment } from 'react';
import { Row} from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { ORDERS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import OrderDetailTable from './OrderDetailTable';
import { defaultImg } from '../../../constants/defaultValues';

class OrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id || null,
            order: {},
            products: [],
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.loadCurrentOrder();
    }

    loadCurrentOrder = () => {
        const { id } = this.state;
        if (id)
            this.getOrder(id);
    }

    getOrder = (id) => {
        ApiController.get(`${ORDERS.details}/${id}`, {}, data => {
            this.setState({
                order: data,
                products: data.orderDetails
            });
        });
    }

    render() {
        let data = [];
        const order = this.state.order;
        const totalPrice = order.totalPrice;
        const products = this.state.products
        products.forEach(product => {
            let value = {};
            value.quantity = product.quantity;
            value.calculatedPrice = product.calculatedPrice;
            if (product.uboxProduct.featureImage) {
                value.featureImage = product.uboxProduct.featureImage;
            } else {
                value.featureImage = defaultImg
            }
            value.name = product.uboxProduct.name;
            value.price = product.uboxProduct.price;
            value.internalPrice = product.uboxProduct.internalPrice;

            data.push(value);
        })
        return (
            <div>
                <Fragment>
                    <Row>
                        <Colxx xxs="12">
                            <Breadcrumb heading="menu.order-detail" match={this.props.match} />
                            <Separator className="mb-5" />
                        </Colxx>
                    </Row>
                    <Row>
                        <Colxx xxs="12">
                            <OrderDetailTable
                                data={data}
                                totalPrice={totalPrice}
                                handleClickRow={this.handleClickRow}
                            />
                        </Colxx>
                    </Row>

                </Fragment>
            </div>
        );
    }
}

export default injectIntl(OrderDetail);