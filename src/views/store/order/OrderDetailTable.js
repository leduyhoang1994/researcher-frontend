import React from 'react';
import { injectIntl } from 'react-intl';
import "./style.scss";
import { Row, Card, CardBody, Table } from "reactstrap";
import { Colxx } from "../../../components/common/CustomBootstrap";
import { numberWithCommas } from "../../../helpers/Utils";

const renderTable = (data) => {
    return data.map((item, index) => {
        const { featureImage, name, internalPrice, price, quantity, calculatedPrice } = item
        return (
            <tr key={index} className="border-bottom">
                <td className="vertical-align"><p className="mb-0"><img width="50" src={`${process.env.REACT_APP_MEDIA_BASE_PATH}${featureImage}`} alt="avatar-img"/></p></td>
                <td className="vertical-align"><p className="mb-0">{name}</p></td>
                <td className="vertical-align"><p className="mb-0">{numberWithCommas(parseFloat(internalPrice))} đ</p></td>
                <td className="vertical-align"><p className="mb-0">{numberWithCommas(parseFloat(price))} đ</p></td>
                <td className="vertical-align text-center"><p className="mb-0">{numberWithCommas(parseFloat(quantity))}</p></td>
                <td className="text-right vertical-align"><p className="mb-0">{numberWithCommas(parseFloat(calculatedPrice))} đ</p></td>
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
                                    <th className="mb-2"><p>Hình ảnh</p></th>
                                    <th className="mb-2"><p>Tên sản phẩm</p></th>
                                    <th className="mb-2"><p>Giá nội bộ</p></th>
                                    <th className="mb-2"><p>Giá ubox</p></th>
                                    <th className="mb-2 text-center"><p>Số lượng</p></th>
                                    <th className="text-right mb-2"><p>Thành tiền</p></th>
                                </tr>
                            </thead>
                            <tbody style={{minHeight: "450px"}}>
                                {renderTable(data)}
                            </tbody>
                        </Table>
                        <div className="d-flex flex-column text-right">
                            <p className="pr-3 font-weight-bold h6">{`Thành tiền: ${numberWithCommas(parseFloat(totalPrice))} đ`}</p>
                        </div>
                    </CardBody>
                </Card>
            </Colxx>
        </Row>
    );
};

export default injectIntl(OrderDetailTable);