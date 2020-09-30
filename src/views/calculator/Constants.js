import React, { Component } from "react";
import "./style.scss";
import { Row, Card, CardBody, Input, Label, Button, CardTitle } from 'reactstrap';
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from '../../helpers/IntlMessages';
import { removeVietnameseTones } from "../../helpers/Utils";
import ApiController from "../../helpers/Api";
import { CONSTANTS } from '../../constants/api';
import ConstantModals from './ConstantModals'
import { NotificationManager } from "../../components/common/react-notifications";

class Constants extends Component {
    constructor(props) {
        super(props)
        this.state = {
            variable: [],
            formula: [],
            isLoading: true,
            temp: "",
            isConstantModalOpen: false,
            constantEdit: null
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.handleChangeText = this.handleChangeText.bind(this)
        // this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getData()
    }

    getVariable = () => {
        ApiController.get(`${CONSTANTS.all}/variable`, {}, data => {
            this.setState({
                variable: data,
            })
        })
    }

    getFormula = () => {
        ApiController.get(`${CONSTANTS.all}/formula`, {}, data => {
            this.setState({
                formula: data,
                isLoading: false,
            })
        })
    }

    getData = () => {
        this.getVariable()
        this.getFormula()
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

    clearConstantEdit = () => {
        this.setState({
            constantEdit: null
        })
    }

    handleEdit = (item) => {
        this.setState({
            constantEdit: item
        })
        this.toggleConstantModal()
    }

    handleRemove = (item) => {
        if (window.confirm(`Bạn thực sự muốn xóa tham số ${item.label} chứ?`)) {
            ApiController.callAsync('delete', `${CONSTANTS.all}/${item?.id}`, {})
                .then(data => {
                    NotificationManager.success("Xóa tham số thành công!", "Thành công");
                    if (item.type === "FORMULA") this.getFormula()
                    else this.getVariable()
                }).catch(error => {
                    NotificationManager.warning("Xóa tham số thất bại!", "Thất bại", 1000);
                });
        }
    }

    renderLoading = () => {
        return (
            <div className="loading"></div>
        );
    }

    toggleConstantModal = () => {
        this.setState({
            isConstantModalOpen: !this.state.isConstantModalOpen
        });
        if (this.state.isConstantModalOpen === false) this.getData()
    }

    render() {
        const { variable, formula, isLoading } = this.state;

        if (isLoading) {
            return this.renderLoading();
        }

        return (
            <>
                <Card>
                    <CardTitle className="mb-0">
                        <h1 className="p-3 ml-4 xxs-10">Variable</h1>
                        <button className="mt-4 mr-3 btn btn-primary float-right" onClick={() => {
                            this.toggleConstantModal()
                        }}>Thêm mới</button>
                    </CardTitle>
                    <CardBody >
                        <Row >
                            <Colxx xxs="12">
                                {variable.map((item) => {
                                    return (
                                        <Row key={item.id}>
                                            <Colxx xxs="9">
                                                <Row>
                                                    <Colxx xxs="3">
                                                        <span className="w-100">
                                                            <Label className="has-float-label pl-3 pb-3">
                                                                <Input
                                                                    disabled={true}
                                                                    className=""
                                                                    type="text"
                                                                    value={item.label}
                                                                    name="key"
                                                                />
                                                                <span className="ml-3">
                                                                    <IntlMessages id="Từ khóa" />
                                                                </span>
                                                            </Label>
                                                        </span>
                                                    </Colxx>
                                                    <Colxx xxs="9 pl-0">
                                                        <span className="w-100">
                                                            <Label className="has-float-label pb-3">
                                                                <Input
                                                                    disabled={true}
                                                                    className=""
                                                                    type="text"
                                                                    value={item.value}
                                                                    name="value"
                                                                />
                                                                <span className="ml-3">
                                                                    <IntlMessages id="Giá trị" />
                                                                </span>
                                                            </Label>
                                                        </span>
                                                    </Colxx>
                                                </Row>
                                            </Colxx>
                                            <Colxx xxs="3 pl-0">
                                                <Row>
                                                    <Colxx xxs="8 pr-1" >
                                                        <span className="w-100">
                                                            <Label className="has-float-label pb-3">
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
                                                    <Colxx xxs="4 pl-0">
                                                        {
                                                            item.type === "CUSTOM_VARIABLE" ?
                                                                (
                                                                    <Row>
                                                                        <Colxx xxs="5">
                                                                            <span className="w-100">
                                                                                <Button
                                                                                    outline
                                                                                    className="pr-1 mr-1"
                                                                                    color="primary"
                                                                                    onClick={() => {
                                                                                        this.handleEdit(item)
                                                                                    }}
                                                                                >
                                                                                    <i className="simple-icon-options pr-0 mr-2" />
                                                                                </Button>
                                                                            </span>
                                                                        </Colxx>
                                                                        <Colxx xxs="5">
                                                                            <span className="w-100">
                                                                                <Button
                                                                                    outline
                                                                                    className="pr-1 ml-1"
                                                                                    color="primary"
                                                                                    onClick={() => {
                                                                                        this.handleRemove(item)
                                                                                    }}
                                                                                >
                                                                                    <i className="simple-icon-close pr-0 mr-2" />
                                                                                </Button>
                                                                            </span>
                                                                        </Colxx>
                                                                        <Colxx xxs="2"></Colxx>
                                                                    </Row>
                                                                )
                                                                : <></>
                                                        }
                                                    </Colxx>
                                                </Row>
                                            </Colxx>
                                        </Row>
                                    )
                                })}
                            </Colxx>
                        </Row>
                    </CardBody>
                </Card>
                <hr />
                <Card>
                    <CardTitle className="mb-0">
                        <h1 className="p-3 ml-4 xxs-10">Formula</h1>
                        <button className="mt-4 mr-3 btn btn-primary float-right" onClick={() => {
                            // this.toggleConstantModal()
                        }}>Thêm mới</button>
                    </CardTitle>
                    <CardBody >
                        <Row >
                            <Colxx xxs="12">
                                {formula.map((item) => {
                                    return (
                                        <Row key={item.id}>
                                            <Colxx xxs="9">
                                                <Row>
                                                    <Colxx xxs="3">
                                                        <span className="w-100">
                                                            <Label className="has-float-label pl-3 pb-3">
                                                                <Input
                                                                    disabled={true}
                                                                    className=""
                                                                    type="text"
                                                                    value={item.label}
                                                                    name="key"
                                                                />
                                                                <span className="ml-3">
                                                                    <IntlMessages id="Từ khóa" />
                                                                </span>
                                                            </Label>
                                                        </span>
                                                    </Colxx>
                                                    <Colxx xxs="9 pl-0">
                                                        <span className="w-100">
                                                            <Label className="has-float-label pb-3">
                                                                <Input
                                                                    disabled={true}
                                                                    className=""
                                                                    type="text"
                                                                    value={item.value}
                                                                    name="value"
                                                                />
                                                                <span className="ml-3">
                                                                    <IntlMessages id="Giá trị" />
                                                                </span>
                                                            </Label>
                                                        </span>
                                                    </Colxx>
                                                </Row>
                                            </Colxx>
                                            <Colxx xxs="3 pl-0">
                                                <Row>
                                                    <Colxx xxs="8 pr-1" >
                                                        <span className="w-100">
                                                            <Label className="has-float-label pb-3">
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
                                                    <Colxx xxs="4 pl-0">
                                                        {
                                                            item.type === "FORMULA" ?
                                                                (
                                                                    <Row>
                                                                        <Colxx xxs="5">
                                                                            <span className="w-100">
                                                                                <Button
                                                                                    outline
                                                                                    className="pr-1 mr-1"
                                                                                    color="primary"
                                                                                    onClick={() => {
                                                                                        // this.handleEdit(item)
                                                                                    }}
                                                                                >
                                                                                    <i className="simple-icon-options pr-0 mr-2" />
                                                                                </Button>
                                                                            </span>
                                                                        </Colxx>
                                                                        <Colxx xxs="5">
                                                                            <span className="w-100">
                                                                                <Button
                                                                                    outline
                                                                                    className="pr-1 ml-1"
                                                                                    color="primary"
                                                                                    onClick={() => {
                                                                                        this.handleRemove(item)
                                                                                    }}
                                                                                >
                                                                                    <i className="simple-icon-close pr-0 mr-2" />
                                                                                </Button>
                                                                            </span>
                                                                        </Colxx>
                                                                        <Colxx xxs="2"></Colxx>
                                                                    </Row>
                                                                )
                                                                : <></>
                                                        }
                                                    </Colxx>
                                                </Row>
                                            </Colxx>
                                        </Row>
                                    )
                                })}
                            </Colxx>
                        </Row>
                    </CardBody>
                </Card>
                <ConstantModals
                    isOpen={this.state.isConstantModalOpen}
                    toggle={this.toggleConstantModal}
                    getData={this.getData}
                    clearConstantEdit={this.clearConstantEdit}
                    constantEdit={this.state.constantEdit}
                />
            </>
        )
    }
}

export default Constants;