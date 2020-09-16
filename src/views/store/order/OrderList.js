import React, { Component, Fragment } from 'react';
import { Row } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import ApiController from '../../../helpers/Api';
import { ORDERS } from '../../../constants/api';
import OrderTable from './OrderTable';

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setId: 1,
            orders: [],
        };
        this.messages = this.props.intl.messages;
    }
    // this.props.match.params.id ||
    componentDidMount() {
        this.getProducts();
    }

    getProducts = () => {
        const id = this.state.setId;
        ApiController.get(`${ORDERS.getBySellerId}/${id}`, {}, data => {
            this.setState({
                orders: data
            })
        })
    }

    handleClickRow = (row) => {
        window.open(`/store/orders/detail/${row.id}`, "_self")
    }

    render() {
        const { orders } = this.state;
        return (
            <div>
                <Fragment>
                    <Row>
                        <Colxx xxs="12">
                            <Breadcrumb heading="Danh sách đơn hàng" match={this.props.match} />
                            <Separator className="mb-5" />
                        </Colxx>
                    </Row>
                    <OrderTable
                        orders={orders}
                        handleClickRow={this.handleClickRow}
                    />

                </Fragment>
            </div>
        )
    }
}
export default injectIntl(OrderList);