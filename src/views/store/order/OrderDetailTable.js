import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import "./style.scss";
import { Row, Card, CardBody, Table } from "reactstrap";
import { Colxx } from "../../../components/common/CustomBootstrap";
import { numberWithCommas } from "../../../helpers/Utils";

const renderTable = (data) => {
    return data.map((item, index) => {
        const { featureImage, name, priceMin, priceMax, quantity, calculatedPrice } = item
        return (
            <tr key={index}>
                <td><img width="50" src={`${process.env.MEDIA_BASE_PATH}${featureImage}`} alt="avatar-img"/></td>
                <td>{name}</td>
                <td>{numberWithCommas(parseInt(priceMin))} VNĐ</td>
                <td>{numberWithCommas(parseInt(priceMax))} VNĐ</td>
                <td>{numberWithCommas(parseInt(quantity))}</td>
                <td className="text-right">{numberWithCommas(parseInt(calculatedPrice))} VNĐ</td>
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
                            <p className="pr-3 font-weight-bold h6">{`Thành tiền: ${numberWithCommas(parseInt(totalPrice))} VNĐ`}</p>
                        </div>
                    </CardBody>
                </Card>
            </Colxx>
        </Row>
    );
};

export default injectIntl(OrderDetailTable);