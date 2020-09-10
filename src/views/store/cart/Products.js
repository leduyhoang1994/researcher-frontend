import React from "react";
import { Card, CardBody } from "reactstrap";
import { NavLink } from "react-router-dom";
import { injectIntl } from 'react-intl';
import { Colxx } from "../../../components/common/CustomBootstrap";

const Products = (props) => {
    const item = props.item;
    
    return (
        <Colxx xxs="12">
            <Card className="card d-flex flex-row mb-3">
                <div className="d-flex flex-grow-1 min-width-zero">
                    <CardBody className="align-self-center d-flex flex-column flex-md-row justify-content-between min-width-zero align-items-md-center">
                        <NavLink
                            to={`/app/applications/survey/${item.id}`}
                            className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1"
                        >
                            <span className="align-middle d-inline-block w-30 w-xs-100">
                                <img width="50" src={item.featureImage} alt="" />
                            </span>
                            <span className="align-middle d-inline-block w-70 w-xs-100">{item.name}</span>
                        </NavLink>
                        <p className="mb-1 text-small w-15 w-xs-100">
                            {item.priceMin}
                        </p>
                        <p className="mb-1 text-small w-15 w-xs-100">
                            {item.priceMax}
                        </p>
                        <button className="mb-1 w-5 w-xs-100 btn btn-primary" onClick={props.decrement(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button className="mb-1 w-5 w-xs-100 btn btn-primary" onClick={props.increment(item.id)}>+</button>
                        <p className="mb-1 w-15 w-xs-100">
                            {item.totalPrice}
                        </p>
                    </CardBody>

                </div>
            </Card>
        </Colxx>
    );
};


export default injectIntl(Products);
