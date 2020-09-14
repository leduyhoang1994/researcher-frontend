import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import "./style.scss";
import { Row, Card, CardBody, Table } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";

const renderTable = (data) => {
    return data.map((item, index) => {
        const { featureImage, name, priceMin, priceMax, quantity, calculatedPrice } = item
        return (
            <tr key={index}>
                <td><img width="50" src={featureImage} alt="avatar-img"/></td>
                <td>{name}</td>
                <td>{priceMin}</td>
                <td>{priceMax}</td>
                <td>{quantity}</td>
                <td className="text-right">{calculatedPrice}</td>
            </tr>
        )
    })
}

const OrderDetailTable = (props) => {
    let data = props.data;
    const totalPrice = props.totalPrice;

    return (
        <Row className="invoice-react">
            <Colxx xxs="12" className="mb-4">
                <Card>
                    <CardBody className="d-flex flex-column justify-content-between">
                        <Table borderless>
                            <thead>
                                <tr>
                                    <th className="text-muted text-extra-normal mb-2">Hình ảnh</th>
                                    <th className="text-muted text-extra-normal mb-2">Tên sản phẩm</th>
                                    <th className="text-muted text-extra-normal mb-2">Giá gốc Min</th>
                                    <th className="text-muted text-extra-normal mb-2">Giá gốc Max</th>
                                    <th className="text-muted text-extra-normal mb-2">Số lượng</th>
                                    <th className="text-right text-muted text-extra-normal mb-2">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody style={{minHeight: "450px"}}>
                                {renderTable(data)}
                            </tbody>
                        </Table>
                        <div className="d-flex flex-column text-extra-normal text-right">
                            <span style={{paddingRight: "12px"}}>{`Thành tiền: ${totalPrice}`}</span>
                        </div>
                    </CardBody>
                </Card>
            </Colxx>
        </Row>
    );
};

export default injectIntl(OrderDetailTable);