import React, { Component } from "react";
import { Row, Card, CardBody } from "reactstrap";
import { Colxx } from "../../../components/common/CustomBootstrap";
import "../style.scss";

class AddressStatistic extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    render() {
        const { interCity, store } = this.props;

        return (
            <Card className="mt-4">
                <CardBody >
                    <h2 className="">Thống kê</h2>
                    <Row>
                        <Colxx xxs="2" className="mt-3">
                            <span className="vertical-align-middle">Kho: </span>
                        </Colxx>
                        <Colxx xxs="10" className="mt-3">
                            {
                                store && store.map((item, index) => {
                                    return (
                                        <span key={item + index}
                                            id={`${item.label}`}
                                            onClick={() => {
                                                this.props.handleChangeCity(item)
                                            }}
                                            className="constants height-40 align-middle"
                                        >
                                            {item.label}
                                        </span>
                                    )
                                })
                            }
                        </Colxx>
                        <Colxx xxs="2" className="mt-3">
                            <span className="vertical-align-middle">Liên tỉnh: </span>
                        </Colxx>
                        <Colxx xxs="10" className="mt-3">
                            {
                                interCity && interCity.map((item, index) => {
                                    return (
                                        <span key={item + index}
                                            id={`${item.label}`}
                                            onClick={() => {
                                                this.props.handleChangeCity(item)
                                            }}
                                            className="constants height-40 align-middle"
                                        >
                                            {item.label}
                                        </span>
                                    )
                                })
                            }
                        </Colxx>
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

export default AddressStatistic;
