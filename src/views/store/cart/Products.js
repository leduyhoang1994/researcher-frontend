import React, { Component } from "react";
import { Card, CardBody } from "reactstrap";
import { NavLink } from "react-router-dom";
import { injectIntl } from 'react-intl';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { numberWithCommas } from "../../../helpers/Utils";

import "./style.scss"

class Products extends Component {
    render() {
        const { item, increment, decrement, remove } = this.props;
        const product_price = {
            fontSize: "1.0rem",
            color: "rgb(255, 52, 37)",
        }
        return (
            <Colxx xxs="12">
                <Card className="card d-flex flex-row mb-3">
                    <div className="d-flex flex-grow-1 min-width-zero">
                        <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center row-product" >
                            <NavLink
                                to={`/store/products/detail/${item.id}`}
                                className="list-item-heading mb-0 truncate w-50 w-xs-100  mb-1 mt-1"
                            >
                                <span className="align-middle d-inline-block w-25 w-xs-100">
                                    <img width="70" style={{ objectFit: "cover", height: "70px" }} src={`${process.env.REACT_APP_MEDIA_BASE_PATH}${item.featureImage}`} alt="" />
                                </span>
                                <span className="align-left d-inline-block w-75 w-xs-100 text-small">
                                    <p className="d-block">
                                        {item.name}
                                        {
                                            item.property.map((value, index) => {
                                                return (
                                                    <span key={index}> - {value}</span>
                                                )
                                            })
                                        }
                                    </p>
                                </span>
                            </NavLink>
                            {/* <p className="mb-1 text-small w-15 w-xs-100">
                                {numberWithCommas(parseFloat(item.internalPrice).toFixed(0))} đ
                            </p> */}
                            <p className="mb-1 text-small w-10 w-xs-100 text-right pr-3" style={product_price}>
                                {numberWithCommas(parseFloat(item.price).toFixed(0))} đ
                            </p>
                            <button className="mb-1 w-5 w-xs-100 btn btn-primary"
                                disabled={parseInt(item.quantity) <= 1 ? true : false}
                                onClick={() => {
                                    decrement(item)
                                }}
                            >-</button>
                            <span>{parseInt(item.quantity)}</span>
                            <button className="mb-1 w-5 w-xs-100 btn btn-primary"
                                onClick={() => {
                                    increment(item)
                                }}
                            >+</button>
                            <button className="mb-1 w-5 w-xs-100 btn btn-primary text-right"
                                onClick={() => {
                                    remove(item)
                                }}
                            >
                                <i className="simple-icon-close"></i>
                            </button>
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
