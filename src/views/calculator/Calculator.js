import React, { Component, Fragment } from "react";
import Select from "react-select";
import { FUNCTIONS, OPERATORS, FIELDS } from "../../constants/operator";
import "./style.scss";
import { Row, Card, CardBody, Input, Label, Button } from 'reactstrap';
import { Colxx } from "../../components/common/CustomBootstrap";
import CkCalculator from "./CkCalculator";
import ApiController from "../../helpers/Api";
import { CONSTANTS } from "../../constants/api";

class Calculator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            optionFunctions: [],
            optionFields: [],
            constants: [],
            formulas: [],
            fields: {},
            detailFields: [],
            formula: "",
            field: "",
            content: ""
        }
        this.handleChangeText = this.handleChangeText.bind(this);
        // this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getConstantsByType();
        this.getConstants();
        this.getFunctionsMathjs();
        this.setState({
            // optionFields: FIELDS,
        })
    }

    getConstantsByType = () => {
        let optionFields = [];
        ApiController.call('get', `${CONSTANTS.all}/field`, {}, data => {
            for(let index in data) {
                optionFields.push({label: index, value: index})
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
        let element = document.getElementById('editor');

        let startPosition = element.selectionStart;
        let endPosition = element.selectionEnd;
        let inputText = element.value;

        let result = inputText.slice(0, startPosition) + value.value + "() " + inputText.slice(endPosition, inputText.length);
        this.setState({
            content: result
        })
        element.focus();
    }

    handleChangeField = (value) => {
        console.log(value);
        let listFields = [];
        let { fields } = this.state;
        for(let index in fields) {
            if(value.value === index) {
                fields[index].forEach(item => {
                    listFields.push(item);
                })
            }
        }

        this.setState({
            detailFields: listFields
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

    onClick = (ev) => {
        let data = ev.target.id;
        let element = document.getElementById('editor');

        let startPosition = element.selectionStart;
        let endPosition = element.selectionEnd;
        let inputText = element.value;

        let result = inputText.slice(0, startPosition) + data + inputText.slice(endPosition, inputText.length) + " ";
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

    render() {
        const { constants, formulas, formula, detailFields } = this.state;
        return (
            <Fragment >
                <Card>
                    <CardBody className="pl-5 pr-5 pt-4 pb-4">
                        <Row className="mt-4">
                            <Colxx xxs="2" >
                                <span className="vertical-align-middle">FORMULA</span>
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
                                    detailFields && detailFields.map((item, index) => {
                                        return (
                                            <span key={item + index}
                                                // draggable="true"
                                                id={item}
                                                onClick={this.onClick}
                                                // onDragStart={this.onDrag}
                                                className="constants height-40 align-middle"
                                            >
                                                {item}
                                            </span>
                                        )
                                    })
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
                                                id={item.label}
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
                                                    id={item.label}
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
                                />
                            </Colxx>
                        </Row>
                        <div className="text-right card-title mt-2">
                            <Button
                                className="mr-0"
                                color="primary"
                                onClick={() => {
                                    // this.add();
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