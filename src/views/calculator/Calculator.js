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
            optionOperators: [],
            optionFields: [],
            constants: [],
            formulas: [],
            formula: "",
            prevFormula: "",
            field: "",
            content: ""
        }
        this.handleChangeText = this.handleChangeText.bind(this);
    }

    componentDidMount() {
        this.getConstants();
        this.setState({
            optionFunctions: FUNCTIONS,
            optionOperators: OPERATORS,
            optionFields: FIELDS,
            // constants: CONSTANTS,
        })
    }

    getConstants = () => {
        let constants = [];
        let formulas = [];
        ApiController.call('get', CONSTANTS.all, {}, data => {
            data.forEach(item => {
                console.log(item);
                if (item.type === "FORMULA") {
                    formulas.push(item);
                } else if (item.type === "VARIABLE") {
                    constants.push(item);
                }

            })
            this.setState({
                formulas,
                constants
            })
        });
    }

    handleChangeFunc = (value) => {
        let { formula } = this.state;
        formula = formula.concat(`${value.value}`)
        this.setState({
            formula
        })
    }

    handleChangeField = (value) => {
        let { field } = this.state;
        field = field.concat(`${value.value}`)
        this.setState({
            field
        })
    }

    handleChangeText(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        })
    }

    onChangeEditor = (data) => {
        let content = this.state.content;
        content = content + "#" + data + "#";
        console.log(content);
        this.setState({
            content
        })
    }

    allowDrop = (ev) => {
        ev.preventDefault();
    }

    onDrop = (ev) => {
        ev.preventDefault();
        let data = ev.dataTransfer.getData("item-transfer");
        console.log("value: " + data);
        const node = document.createElement("span");                 // Create a <li> node
        const textNode = document.createTextNode(data);
        node.appendChild(textNode); 

        const content = document.querySelector(".ck-content");
        document.querySelector(".ck-content").appendChild(node);
        // content.appendChild(data);
        // let content = this.state.content;
        // content = content + "#" + data  + "#";
        console.log(content);
        // this.setState({
        //     content
        // })
    }

    onDrag = (ev) => {
        ev.dataTransfer.setData("item-transfer", ev.target.id);
    }

    render() {
        const { constants, formulas, formula } = this.state;
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
                                    className="react-select w-40 height-40"
                                    classNamePrefix="react-select"
                                    options={this.state.optionFields}
                                    onChange={this.handleChangeField}
                                />
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
                                                draggable="true"
                                                id={item.label}
                                                onDragStart={this.onDrag}
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
                                                    draggable="true"
                                                    id={item.label}
                                                    onDragStart={this.onDrag}
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
                        <Row className="mt-4">
                            <Colxx xxs="12">
                                <CkCalculator
                                    onDrop={this.onDrop}
                                    allowDrop={this.allowDrop}
                                    content={this.state.content}
                                    onChangeEditor={this.onChangeEditor}
                                />
                            </Colxx>
                        </Row>
                        {/* <div className="w-15">
                        <Select
                            outline
                            className="react-select pt-3 selection w-100"
                            classNamePrefix="react-select"
                            options={this.state.optionFunctions}
                            onChange={this.handleChangeFunc}
                        />
                    </div>
                    <div className="w-15">
                        <Select
                            outline
                            className="react-select pt-3 selection w-100"
                            classNamePrefix="react-select"
                            options={this.state.optionOperators}
                            onChange={this.handleChangeFunc}
                        />
                    </div> */}
                    </CardBody>
                </Card>
            </Fragment>
        )
    }
}

export default Calculator;