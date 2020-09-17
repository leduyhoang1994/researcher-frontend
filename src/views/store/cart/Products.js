import React, { Component } from "react";
import { Card, CardBody } from "reactstrap";
import { NavLink } from "react-router-dom";
import { injectIntl } from 'react-intl';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { numberWithCommas } from "../../../helpers/Utils";


class Products extends Component {
    render() {
        const { item, increment, decrement, remove } = this.props;
        return (
            <Colxx xxs="12">
                <Card className="card d-flex flex-row mb-3">
                    <div className="d-flex flex-grow-1 min-width-zero">
                        <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center" style={{padding: "10px 28px"}}>
                            <NavLink
                                to={`/store/products/detail/${item.id}`}
                                className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
                            >
                                <span className="align-middle d-inline-block w-30 w-xs-100">
                                    <img width="70" style={{objectFit: "cover", height: "70px"}} src={item.featureImage} alt="" />
                                </span>
                                <span className="align-middle d-inline-block w-70 w-xs-100">{item.name}</span>
                            </NavLink>
                            <p className="mb-1 text-small w-15 w-xs-100">
                                {numberWithCommas(parseInt(item.priceMin))} VNĐ
                            </p>
                            <p className="mb-1 text-small w-15 w-xs-100">
                                {numberWithCommas(parseInt(item.priceMax))} VNĐ
                            </p>
                            <button className="mb-1 w-5 w-xs-100 btn btn-primary"
                                onClick={() => {
                                    decrement(item.id)
                                }}
                            >-</button>
                            <span>{parseInt(item.quantity)}</span>
                            <button className="mb-1 w-5 w-xs-100 btn btn-primary"
                                onClick={() => {
                                    increment(item.id)
                                }}
                            >+</button>
                            <button className="mb-1 w-5 w-xs-100 btn btn-primary text-right"
                                onClick={() => {
                                    remove(item.id)
                                }}
                            >X</button>
                            <p className="mb-1 w-5 w-xs-100">
                                {item.totalPrice}
                            </p>
                        </CardBody>

                    </div>
                </Card>
            </Colxx>
        );
    }
};

export default injectIntl(Products);
