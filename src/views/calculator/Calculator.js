import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, Input, Button, CardTitle } from 'reactstrap';
import { Colxx } from "../../components/common/CustomBootstrap";
import Editor from "./Editor";
import ApiController from "../../helpers/Api";
import Select from "react-select";
import { CONSTANTS } from "../../constants/api";
import { NotificationManager } from '../../components/common/react-notifications';
import { failed, notify_add_success, success, notify_syntax_error, required_field, notify_update_success } from "../../constants/constantTexts";
import "./style.scss";
import { getIndexTagOnKeyDown } from "../../helpers/Utils";
import ConstantModals from "./ConstantModals";
import { isFunction } from "formik";
const math = require('mathjs')


class Calculator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id || null,
            optionFunctions: [],
            optionFields: [],
            constants: [],
            formulas: [],
            fields: {},
            detailFields: {},
            formula: "",
            field: "",
            content: "",
            index: 0,
            isConstantModalOpen: false,
        }
        this.handleChangeText = this.handleChangeText.bind(this);
        // this.messages = this.props.intl.messages;

    }

    componentDidMount() {
        this.getCurrentFormula();
        this.getConstantsByType();
        this.getConstants();
        this.getFunctionsMathjs();
    }

    reCallApi = () => {
        this.getConstants();
    }

    getCurrentFormula = () => {
        const { id } = this.state;
        if (id) {
            ApiController.call('get', `${CONSTANTS.all}/${id}`, {}, data => {
                this.setState({
                    formula: data.label,
                    content: data.viewValue
                })
            });
        }
    }

    getConstantsByType = () => {
        let optionFields = [];
        ApiController.call('get', `${CONSTANTS.type}/field`, {}, data => {
            for (let index in data) {
                optionFields.push({ label: index, value: index })
            }
            this.setState({
                fields: data,
                optionFields
            })
        });
    }

    getConstants = () => {
        let constants = [];
        let formulas = [];
        ApiController.call('get', CONSTANTS.all, {}, data => {
            data.forEach(item => {
                if ((item.type === "SYSTEM_FORMULA") || (item.type === "CUSTOM_FORMULA")) {
                    formulas.push(item);
                } else if ((item.type === "CUSTOM_VARIABLE") || ("SYSTEM_VARIABLE")) {
                    constants.push(item);
                }
            })
            this.setState({
                formulas,
                constants
            })
        });
    }

    toggleConstantModal = () => {
        this.setState({
            isConstantModalOpen: !this.state.isConstantModalOpen
        });
    }

    clearConstantEdit = () => { }

    getFunctionsMathjs = () => {
        let arrMath = []
        Object.getOwnPropertyNames(math).forEach(item => {
            if (isFunction(math[item])) {
                arrMath.push({ label: item, value: item, code: item.toUpperCase() });
            }
        })
        this.setState({
            optionFunctions: arrMath,
        })
    }

    handleChangeField = (value) => {
        let listFields = [];
        let { fields } = this.state;
        const field = value.value;
        for (let index in fields) {
            if (field === index) {
                fields[index].forEach(item => {
                    listFields.push(item);
                })
            }
        }
        const data = {};
        data[field] = listFields;

        this.setState({
            detailFields: data
        })
    }

    handleChangeText(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        })
    }

    onChangeEditor = (e) => {
        this.setState({
            content: e.target.value
        })
    }

    getIndex = (i) => {
    }

    onBlurEditor = () => {
        let element = document.getElementById("editor_calculator");
        let index = getIndexTagOnKeyDown(element);
        this.setState({
            index
        })
    }

    formatContentEditor = (data, isFunction) => {
        const { index, detailFields, optionFunctions, formulas } = this.state;
        let constant = [...this.state.constants];
        constant.reverse();
        optionFunctions.reverse();
        const key = Object.keys(detailFields).toString() || "";

        

        let element = document.getElementById('editor_calculator');
        let inputText = element.innerText;
        let leftResult = inputText.slice(0, index);
        let rightResult = inputText.slice(index, inputText.length);
        let middleResult = "";
        if (isFunction) {
            middleResult = `<a style="color: #5e99e6;" contenteditable="false">${data}</a>()`.concat("&nbsp;");
        } else {
            if(data.includes("()")) {
                middleResult = `<a style="color: #d64f5d;" contenteditable="false">${data}</a>`.concat("&nbsp;");
            } else if(data.includes(".")) {
                middleResult = `<a style="color: #a112cc;" contenteditable="false">${data}</a>`.concat("&nbsp;");
            } else {
                middleResult = `<a style="color: #4acc3d;" contenteditable="false">${data}</a>`.concat("&nbsp;");
            }
        }

        constant.forEach(item => {
            const regex = new RegExp(`${item.label}\\b`, 'g');
            leftResult = leftResult.replace(regex, `<a style="color: #4acc3d;" contenteditable="false">${item.label}</a>`);
            rightResult = rightResult.replace(regex, `<a style="color: #4acc3d;" contenteditable="false">${item.label}</a>`);
        })

        if (key) {
            let arrFields = [];
            const fields = detailFields[key];
            fields.forEach(item => {
                arrFields.push({ label: `${key}.${item}`, code: `${key}.${item}` })
            })
            arrFields.forEach(item => {
                const regex = new RegExp(`${item.label}\\b`, 'g');
                leftResult = leftResult.replace(regex, `<a style="color: #a112cc;" contenteditable="false">${item.label}</a>`);
                rightResult = rightResult.replace(regex, `<a style="color: #a112cc;" contenteditable="false">${item.label}</a>`);
            })
        }

        optionFunctions.forEach(item => {
            const regex = new RegExp(`\\b${item.label}\\b`, 'g');
            leftResult = leftResult.replace(regex, `<a style="color: #5e99e6;" contenteditable="false">${item.label}</a>`);
            rightResult = rightResult.replace(regex, `<a style="color: #5e99e6;" contenteditable="false">${item.label}</a>`);
        })

        formulas.forEach(item => {
            const label = `${item.label}()`;
            if (leftResult.indexOf(label) !== -1) {
                leftResult = leftResult.replaceAll(label, `<a style="color: #d64f5d;" contenteditable="false">${label}</a>`);
            }
            if (rightResult.indexOf(label) !== -1) {
                rightResult = rightResult.replaceAll(label, `<a style="color: #d64f5d;" contenteditable="false">${label}</a>`);
            }
        })

        return (leftResult + middleResult + rightResult);
    }

    handleChangeFunc = (value) => {
        const element = document.getElementById('editor_calculator');
        let result = this.formatContentEditor(value.value, true);
        this.setState({
            content: result
        })
        element.focus();
    }

    onClick = (ev) => {
        let data = ev.target.id;
        const element = document.getElementById('editor_calculator');
        let result = this.formatContentEditor(data, false);
        this.setState({
            content: result
        })
        element.focus();
    }

    createFormula = () => {
        let flag = true;
        const { formula, content, formulas, constants } = this.state;
        let element = document.getElementById('editor_calculator');
        let value = element.innerText;
        formulas.forEach(item => {
            // const regex = new RegExp(`${item.label}\\b`, 'g');
            if (value.indexOf(item.label) !== -1) {
                if (value.indexOf(`${item.label}()`) !== -1) {
                    value = value.replaceAll(`${item.label}()`, `${item.code}()`);
                } else {
                    NotificationManager.warning(notify_syntax_error, failed);
                    flag = false;
                }
            }
        })
        constants.forEach(item => {
            // const regex = new RegExp(`${item.label}\\b`, 'g');
            if (value.indexOf(item.label) !== -1) {
                if (value.indexOf(`${item.label}`) !== -1) {
                    value = value.replaceAll(`${item.label}`, `${item.code}`);
                } else {
                    NotificationManager.warning(notify_syntax_error, failed);
                    flag = false;
                }
            }
        })
        let data = { label: formula, value: value, viewValue: content, type: "CUSTOM_FORMULA" };
        if (flag) {
            if (data.value && data.label) {
                if (this.state.id) {
                    data.id = this.state.id;
                    ApiController.callAsync('put', CONSTANTS.all, data)
                        .then(data => {
                            if (data.data.statusCode === 200) {
                                NotificationManager.success(notify_update_success, success, 2000);
                                setTimeout(() => {
                                    window.open(`/calculator/edit/${this.state.id}`, "_self");
                                }, 2500);
                            }
                        }).catch(error => {
                            NotificationManager.warning(error.response.data.message, failed, 2000);
                        });
                } else {
                    ApiController.callAsync('post', CONSTANTS.all, data)
                        .then(data => {
                            if (data.data.statusCode === 200) {
                                NotificationManager.success(notify_add_success, success, 1000);
                                setTimeout(() => {
                                    window.open(`/calculator/edit/${data.data.result.id}`, "_self");
                                }, 1500);
                            }
                        }).catch(error => {
                            NotificationManager.warning(error.response.data.message, failed, 2000);
                        });
                }
            } else {
                if (!data.label) {
                    NotificationManager.warning(`${required_field} tên công thức`, failed, 3000);
                }
                if (!data.value) {
                    NotificationManager.warning(`${required_field} nội dung công thức`, failed, 3000);
                }
            }
        }

    }

    render() {
        const { constants, formulas, formula, detailFields } = this.state;
        const key = Object.keys(detailFields).toString() || "";

        return (
            <Fragment >
                <div className="text-right card-title mt-2">
                    <Button
                        className="mr-0"
                        color="primary"
                        onClick={() => {
                            this.toggleConstantModal();
                        }}
                    >
                        Thêm mới trường
                            </Button>
                </div>
                <Card>
                    <CardTitle className="mb-0">
                        <h1 className="pl-3 mt-4 mb-0 pb-0 ml-4 xxs-10">Công thức</h1>
                    </CardTitle>
                    <CardBody className="pl-5 pr-5 pt-4 pb-4">
                        <Row className="mt-4">
                            <Colxx xxs="2" >
                                <span className="vertical-align-middle">Tên công thức *</span>
                            </Colxx>
                            <Colxx xxs="10">
                                <Input
                                    type="text"
                                    value={formula}
                                    name="formula"
                                    className="p-2 height-40"
                                    onChange={this.handleChangeText}
                                />
                            </Colxx>
                        </Row>
                        <Row className="mt-4">
                            <Colxx xxs="2" className="">
                                <span className="vertical-align-middle">Trường giá trị</span>
                            </Colxx>
                            <Colxx xxs="10">
                                <Select
                                    outline
                                    className="react-select w-40 height-40 mb-3"
                                    classNamePrefix="react-select"
                                    options={this.state.optionFields}
                                    onChange={this.handleChangeField}
                                />
                                {
                                    detailFields[key] ? detailFields[key].map((item, index) => {
                                        return (
                                            <span key={item + index}
                                                id={`${key}.${item}`}
                                                onClick={this.onClick}
                                                className="constants height-40 align-middle field-color"
                                            >
                                                {item}
                                            </span>
                                        )
                                    }) : <></>

                                }
                            </Colxx>
                        </Row>
                        <Row className="mt-4">
                            <Colxx xxs="2" className="">
                                <span className="vertical-align-middle">Tham số mặc định:</span>
                            </Colxx>
                            <Colxx xxs="10">
                                {
                                    constants && constants.map((item, index) => {
                                        return (
                                            <span key={item + index}
                                                // draggable="true"
                                                id={`${item.label}`}
                                                onClick={this.onClick}
                                                // onDragStart={this.onDrag}
                                                className="constants height-40 align-middle constant-color
                                                "
                                            >
                                                {item.label}
                                            </span>
                                        )
                                    })
                                }
                            </Colxx>
                        </Row>
                        <Row className="mt-4">
                            <Colxx xxs="2" className="">
                                <span className="vertical-align-middle">Công thức:</span>
                            </Colxx>
                            <Colxx xxs="10" id="constant-list">
                                {
                                    formulas && formulas.map((item, index) => {
                                        return (
                                            <span key={item + index}
                                                // draggable="true"
                                                onClick={this.onClick}
                                                id={`${item.label}()`}
                                                // onDragStart={this.onDrag}
                                                className="constants height-40 align-middle formula-color"
                                            >
                                                {item.label}
                                            </span>
                                        )
                                    })
                                }
                            </Colxx>
                        </Row>
                        <Row>
                            <Colxx xxs="2" className="">
                                <span className="vertical-align-middle">Hàm toán học:</span>
                            </Colxx>
                            <Colxx xxs="10">
                                <div className="w-15">
                                    <Select
                                        outline
                                        className="react-select selection w-100"
                                        classNamePrefix="react-select"
                                        options={this.state.optionFunctions}
                                        onChange={this.handleChangeFunc}
                                    />
                                </div>
                            </Colxx>
                        </Row>
                        <Row className="mt-4">
                            <Colxx xxs="12">
                                <Editor
                                    // onDrop={this.onDrop}
                                    // allowDrop={this.allowDrop}
                                    content={this.state.content}
                                    onChangeEditor={this.onChangeEditor}
                                    onBlurEditor={this.onBlurEditor}
                                />
                            </Colxx>
                        </Row>

                        <div className="text-right card-title mt-2">
                            <Button
                                className="mr-3"
                                color="info"
                                onClick={() => {
                                    window.open("/calculator", "_self")
                                }}
                            >
                                Quay lại
                            </Button>
                            <Button
                                className="mr-0"
                                color="primary"
                                onClick={() => {
                                    this.createFormula();
                                }}
                            >
                                {this.state.id ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </div>
                    </CardBody>
                </Card>
                <ConstantModals
                    isOpen={this.state.isConstantModalOpen}
                    toggle={this.toggleConstantModal}
                    getData={this.reCallApi}
                    clearConstantEdit={this.clearConstantEdit}
                />
            </Fragment>
        )
    }
}

export default Calculator;