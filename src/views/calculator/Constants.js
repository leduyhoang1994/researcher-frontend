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
import ContentEditable from "react-contenteditable";

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
        ApiController.get(`${CONSTANTS.type}/variable`, {}, data => {
            this.setState({
                variable: data,
            })
        })
    }

    getFormula = () => {
        ApiController.get(`${CONSTANTS.type}/formula`, {}, data => {
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
                    if (item.type === "CUSTOM_FORMULA" || item.type === "SYSTEM_FORMULA") this.getFormula()
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
                        <h1 className="p-3 ml-4 xxs-10">Tham số mặc định</h1>
                    </CardTitle>
                    <CardBody className="constant">
                        <Row >
                            <Colxx xxs="12">
                                {variable && variable.map((item) => {
                                    return (
                                        <Row key={item.id}>
                                            <Colxx xxs="8">
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
                                                                    value={item.viewValue}
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
                                            <Colxx xxs="4 pl-0">
                                                <Row>
                                                    <Colxx xxs="6 " >
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
                                                    <Colxx xxs="6 ">
                                                        <Row>
                                                            <Colxx xxs="6">
                                                                <span className="w-100">
                                                                    <Button
                                                                        outline
                                                                        className="button"
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            this.handleEdit(item)
                                                                        }}
                                                                    >
                                                                        <i className="iconsminds-gear-2 align-middle" />
                                                                    </Button>
                                                                </span>
                                                            </Colxx>
                                                            <Colxx xxs="6 pl-0">
                                                                <span className="w-100">
                                                                    {
                                                                        item.type === "CUSTOM_VARIABLE" ?
                                                                            (
                                                                                <Button
                                                                                    outline
                                                                                    className="button"
                                                                                    color="primary"
                                                                                    onClick={() => {
                                                                                        this.handleRemove(item)
                                                                                    }}
                                                                                >
                                                                                    <i className="simple-icon-close align-middle" />
                                                                                </Button>
                                                                            )
                                                                            : <></>
                                                                    }
                                                                </span>
                                                            </Colxx>
                                                            {/* <Colxx xxs="2"></Colxx> */}
                                                        </Row>
                                                    </Colxx>
                                                </Row>
                                            </Colxx>
                                        </Row>
                                    )
                                })}
                            </Colxx>
                        </Row>
                        <div className="text-right mt-2">
                            <Button
                                className="mr-0"
                                color="primary"
                                onClick={() => {
                                    this.toggleConstantModal();
                                }}
                            >
                                Thêm mới
                            </Button>
                        </div>
                    </CardBody>
                </Card>
                <hr />
                <Card>
                    <CardTitle className="mb-0">
                        <h1 className="p-3 ml-4 xxs-10">Công thức</h1>
                    </CardTitle>
                    <CardBody className="constant">
                        <Row >
                            <Colxx xxs="12">
                                {formula.map((item) => {
                                    return (
                                        <Row key={item.id}>
                                            <Colxx xxs="8">
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
                                                                <ContentEditable
                                                                    id="editor_calculator"
                                                                    disabled={true}
                                                                    html={item.viewValue}
                                                                />
                                                                <span className="ml-3">
                                                                    <IntlMessages id="Giá trị" />
                                                                </span>
                                                            </Label>
                                                        </span>
                                                    </Colxx>
                                                </Row>
                                            </Colxx>
                                            <Colxx xxs="4">
                                                <Row>
                                                    <Colxx xxs="6 pl-0" >
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
                                                    <Colxx xxs="6 ">
                                                        <Row>
                                                            <Colxx xxs="6">
                                                                <span className="w-100">
                                                                    <Button
                                                                        outline
                                                                        className="button"
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            window.open(`/calculator/edit/${item.id}`)
                                                                        }}
                                                                    >
                                                                        <i className="iconsminds-gear-2 align-middle" />
                                                                    </Button>
                                                                </span>
                                                            </Colxx>
                                                            <Colxx xxs="6 pl-0">
                                                                <span className="w-100">
                                                                    {
                                                                        item.type === "CUSTOM_FORMULA" ?
                                                                            (
                                                                                <Button
                                                                                    outline
                                                                                    className="button"
                                                                                    color="primary"
                                                                                    onClick={() => {
                                                                                        this.handleRemove(item)
                                                                                    }}
                                                                                >
                                                                                    <i className="simple-icon-close align-middle" />
                                                                                </Button>
                                                                            )
                                                                            : <></>
                                                                    }
                                                                </span>
                                                            </Colxx>
                                                        </Row>

                                                    </Colxx>
                                                </Row>
                                            </Colxx>
                                        </Row>
                                    )
                                })}
                            </Colxx>
                        </Row>
                        <div className="text-right mt-2">
                            <Button
                                className="mr-0"
                                color="primary"
                                onClick={() => {
                                    window.open("/calculator/edit", "_self");
                                }}
                            >
                                Thêm mới
                            </Button>
                        </div>
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