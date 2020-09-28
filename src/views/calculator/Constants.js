import React, { Component } from "react";
import { CONSTANTS } from "../../constants/operator";
import "./style.scss";
import { Row, Card, CardBody, Input, Label, Button, CardTitle } from 'reactstrap';
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from '../../helpers/IntlMessages';
import { removeVietnameseTones } from "../../helpers/Utils";

class Constants extends Component {
    constructor(props) {
        super(props)
        this.state = {
            constants: [],
            isLoading: true,
            temp: ""
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.handleChangeText = this.handleChangeText.bind(this)
        // this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.setState({
            constants: CONSTANTS,
            isLoading: false,
        })
    }

    handleChangeText(e, index) {
        let constants = this.state.constants;
        let item = constants[index];
        if (e.target.name === "key") {
            item.code = removeVietnameseTones(e.target.value).toLowerCase();
            item.key = e.target.value
        } else {
            item.value = e.target.value
        }
        constants.splice(index, 1, item);
        this.setState({
            constants
        })
    }

    handleAddRow = () => {
        let constants = this.state.constants;
        constants.push({ key: "", value: "", code: "", isFlag: true })
        this.setState({
            constants
        })
    }

    handleRemove = (index) => {
        let constants = this.state.constants;
        constants.splice(index, 1);
        this.setState({
            constants
        })
    }

    renderLoading = () => {
        return (
            <div className="loading"></div>
        );
    }

    render() {
        const { constants, isLoading } = this.state;

        if (isLoading) {
            return this.renderLoading();
        }

        return (
            <Card>
                <CardTitle className="mb-0">
                    <h1 className="p-3 ml-4">Constants</h1>
                </CardTitle>
                <CardBody >
                    <Row >
                        <Colxx xxs="12">
                            {constants.map((item, index) => {
                                return (
                                    <Row key={index}>
                                        <Colxx xxs="7">
                                            <Row>
                                                <Colxx xxs="6">
                                                    <span className="w-100">
                                                        <Label className="has-float-label pl-3 pb-3 pr-3">
                                                            <Input
                                                                className=""
                                                                type="text"
                                                                value={item.key}
                                                                name="key"
                                                                onChange={(e) => {
                                                                    this.handleChangeText(e, index)
                                                                }}
                                                            />
                                                            <span className="ml-3">
                                                                <IntlMessages id="Từ khóa" />
                                                            </span>
                                                        </Label>
                                                    </span>
                                                </Colxx>
                                                <Colxx xxs="6">
                                                    <span className="w-100">
                                                        <Label className="has-float-label pl-3 pb-3 pr-3">
                                                            <Input
                                                                className=""
                                                                type="text"
                                                                value={item.value}
                                                                name="value"
                                                                onChange={(e) => {
                                                                    this.handleChangeText(e, index)
                                                                }}
                                                            />
                                                            <span className="ml-3">
                                                                <IntlMessages id="Giá trị" />
                                                            </span>
                                                        </Label>
                                                    </span>
                                                </Colxx>
                                            </Row>
                                        </Colxx>
                                        <Colxx xxs="5">
                                            <Row>
                                                <Colxx xxs="9">
                                                    <span className="w-100">
                                                        <Label className="has-float-label pl-3 pb-3 pr-3">
                                                            <Input
                                                                disabled={true}
                                                                type="text"
                                                                value={item.code}
                                                                name="code"
                                                            />
                                                            <span className="ml-3">
                                                                <IntlMessages id="CODE" />
                                                            </span>
                                                        </Label>
                                                    </span>
                                                </Colxx>
                                                <Colxx xxs="3">
                                                    {
                                                        item.isFlag ? (
                                                            <span className="w-25 card-title">
                                                                <Button
                                                                    outline
                                                                    className="mr-2"
                                                                    color="primary"
                                                                    onClick={() => {
                                                                        this.handleRemove(index)
                                                                    }}
                                                                >
                                                                    <i className="simple-icon-close font-12" />
                                                                </Button>
                                                            </span>
                                                        ) : (<></>)
                                                    }
                                                </Colxx>
                                            </Row>
                                        </Colxx>
                                    </Row>
                                )
                            })}
                        </Colxx>
                        <Colxx xxs="12">
                            <div className="text-center">
                                <span className="w-10 card-title">
                                    <Button
                                        outline
                                        className="mr-2 pl-4 pr-4 pt-1 pb-1"
                                        color="primary"
                                        onClick={() => {
                                            this.handleAddRow()
                                        }}
                                    >
                                        <i className="iconsminds-add font-20" />
                                    </Button>
                                </span>
                            </div>
                        </Colxx>
                    </Row>

                </CardBody>
            </Card>
        )
    }
}

export default Constants;