import React, { Component, Fragment } from "react";
import { FUNCTIONS, OPERATORS, FIELDS } from "../../constants/operator";
import { Row, Card, CardBody, Input, Label, Button } from 'reactstrap';
import { Colxx } from "../../components/common/CustomBootstrap";
import CkCalculator from "./CkCalculator";
import ApiController from "../../helpers/Api";
import Select from "react-select";
import { CONSTANTS } from "../../constants/api";
import { validateName } from '../../helpers/Validate';
import { NotificationManager } from '../../components/common/react-notifications';
import { failed, notify_add_success, success, notify_syntax_error, notify_add_failed, info, required_field } from "../../constants/constantTexts";
import "./style.scss";
import { getIndexTagOnKeyDown } from "../../helpers/Utils";


class Calculator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            optionFunctions: [],
            optionFields: [],
            constants: [],
            formulas: [],
            fields: {},
            detailFields: {},
            formula: "",
            field: "",
            content: "abc",
            index: 0,
        }
        this.handleChangeText = this.handleChangeText.bind(this);
        // this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getConstantsByType();
        this.getConstants();
        this.getFunctionsMathjs();
    }

    getConstantsByType = () => {
        let optionFields = [];
        ApiController.call('get', `${CONSTANTS.all}/field`, {}, data => {
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
                if (item.type === "FORMULA") {
                    formulas.push(item);
                } else if (item.type === "CUSTOM_VARIABLE" || "SYSTEM_VARIABLE") {
                    constants.push(item);
                }
            })
            this.setState({
                formulas,
                constants
            })
        });
    }

    getFunctionsMathjs = () => {
        let arrMath = []
        Object.getOwnPropertyNames(Math).forEach(item => {
            arrMath.push({ label: item, value: item });
        })
        this.setState({
            optionFunctions: arrMath,
        })
    }

    handleChangeFunc = (value) => {
        const { index } = this.state;
        let element = document.getElementById('editor');
        let inputText = element.innerText;

        let result = inputText.slice(0, index) + "<article contenteditable='false'>" + value.value + "</article>()" + inputText.slice(index, inputText.length);
        this.setState({
            content: result
        })
        element.focus();
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
        console.log(e);
        this.setState({
            content: e.target.value
        })
    }

    onBlurEditor = () => {
        let element = document.getElementById("editor");
        let index = getIndexTagOnKeyDown(element);
        this.setState({
            index
        })
    }

    onClick = (ev) => {
        const { index } = this.state;
        let data = ev.target.id;
        let element = document.getElementById('editor');
        let inputText = element.innerText;
        let result = inputText.slice(0, index) + "<article contenteditable='false'>" + data + "</article>" + inputText.slice(index, inputText.length);
        this.setState({
            content: result
        })
        element.focus();
    }

    // onDrop = (ev) => {
    //     ev.preventDefault();
    //     let data = ev.dataTransfer.getData("item-transfer");
    //     console.log("value: " + data);
    //     const node = document.createElement("span");
    //     const textNode = document.createTextNode(data);
    //     node.appendChild(textNode);

    //     const content = document.querySelector(".ck-content");
    //     document.querySelector(".ck-content").appendChild(node);
    //     // content.appendChild(data);
    //     // let content = this.state.content;
    //     // content = content + "#" + data  + "#";
    //     console.log(content);
    //     // this.setState({
    //     //     content
    //     // })
    // }

    // onDrag = (ev) => {
    //     ev.dataTransfer.setData("item-transfer", ev.target.id);
    // }

    createFormula = () => {
        let flag = true;
        const { formula, content, formulas, constants } = this.state;
        var value = content.trim();
        formulas.forEach(item => {
            if (value.indexOf(item.code) !== -1) {
                if (value.indexOf(`${item.code}()`) === -1) {
                    NotificationManager.warning(notify_syntax_error, failed);
                    flag = false;
                }
            }
        })
        constants.forEach(item => {
            if (value.indexOf(item.label) !== -1) {
                if (value.indexOf(`"${item.label}"`) !== -1) {
                    value = value.replaceAll(`"${item.label}"`, `${item.code}`);
                } else {
                    NotificationManager.warning(notify_syntax_error, failed);
                    flag = false;
                }
            }
        })
        console.log(value);
        const data = { label: formula, value: value, viewValue: content.trim(), type: "FORMULA" };
        console.log(data);
        if (flag) {
            if (data.value && data.label) {
                ApiController.callAsync('post', CONSTANTS.all, data)
                    .then(data => {
                        console.log(data);
                        if (data.data.statusCode === 200) {
                            NotificationManager.success(notify_add_success, success, 2000);
                        }
                    }).catch(error => {
                        NotificationManager.warning(notify_add_failed, failed, 2000);
                        setTimeout(() => {
                            NotificationManager.info(error.response.data.message, info, 2000);
                        }, 2500);
                    });
            } else {
                NotificationManager.warning(required_field, failed);
            }
        }

    }

    render() {
        const { constants, formulas, formula, detailFields } = this.state;
        const key = Object.keys(detailFields).toString() || "";
        return (
            <Fragment >
                <Card>
                    <CardBody className="pl-5 pr-5 pt-4 pb-4">
                        <Row className="mt-4">
                            <Colxx xxs="2" >
                                <span className="vertical-align-middle">FORMULA NAME *</span>
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
                                <span className="vertical-align-middle">FIELD</span>
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
                                                className="constants height-40 align-middle"
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
                                <span className="vertical-align-middle">Constants:</span>
                            </Colxx>
                            <Colxx xxs="10">
                                {
                                    constants && constants.map((item, index) => {
                                        return (
                                            <span key={item + index}
                                                // draggable="true"
                                                id={`"${item.label}"`}
                                                onClick={this.onClick}
                                                // onDragStart={this.onDrag}
                                                className="constants height-40 align-middle"
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
                                <span className="vertical-align-middle">Formulas:</span>
                            </Colxx>
                            <Colxx xxs="10" id="constant-list">
                                {
                                    formulas && formulas.map((item, index) => {
                                        if (index < 5) {
                                            return (
                                                <span key={item + index}
                                                    // draggable="true"
                                                    onClick={this.onClick}
                                                    id={`${item.label}()`}
                                                    // onDragStart={this.onDrag}
                                                    className="constants height-40 align-middle"
                                                >
                                                    {item.label}
                                                </span>
                                            )
                                        }
                                    })
                                }
                            </Colxx>
                        </Row>
                        <Row>
                            <Colxx xxs="2" className="">
                                <span className="vertical-align-middle">Functions:</span>
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
                                <CkCalculator
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
                                className="mr-0"
                                color="primary"
                                onClick={() => {
                                    this.createFormula();
                                }}
                            >
                                Thêm mới
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Fragment>
        )
    }
}

export default Calculator;