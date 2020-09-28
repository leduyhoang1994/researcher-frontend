import React, { Component, Fragment } from "react";
import Select from "react-select";
import { FUNCTIONS, OPERATORS, FIELDS, CONSTANTS } from "../../constants/operator";
import "./style.scss";
import { Row, Card, CardBody, Input, Label, Button } from 'reactstrap';
import { Colxx } from "../../components/common/CustomBootstrap";
import CkCalculator from "./CkCalculator";

class Calculator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            optionFunctions: [],
            optionOperators: [],
            optionFields: [],
            constants: [],
            formula: "",
            prevFormula: "",
            field: "",
            content: ""
        }
        this.handleChangeText = this.handleChangeText.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            optionFunctions: FUNCTIONS,
            optionOperators: OPERATORS,
            optionFields: FIELDS,
            constants: CONSTANTS,
        })
    }

    handleChangeFunc = (value) => {
        let { formula, prevFormula } = this.state;
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

    updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }

    onChange(evt) {
        console.log("onChange fired with event info: ", evt);
        var newContent = evt.editor.getData();
        this.setState({
            content: newContent
        })
    }

    onBlur(evt) {
        console.log("onBlur event called with event info: ", evt);
    }

    afterPaste(evt) {
        console.log("afterPaste event called with event info: ", evt);
    }

    allowDrop = (ev) => {
        ev.preventDefault();
    }

    drop = (ev) => {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("item-transfer");
        ev.target.appendChild(document.getElementById(data));
        console.log(document.getElementById(data));
    }

    drag = (ev) => {
        console.log(ev.target.id);
        ev.dataTransfer.setData("item-transfer", ev.target.id);
    }

    render() {
        const { constants, formula } = this.state;
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
                                    constants.map((item, index) => {
                                        return (
                                            <span key={item + index}
                                                draggable="true"
                                                className="constants height-40 align-middle"
                                            >
                                                {item.key}
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
                                    constants.map((item, index) => {
                                        if (index < 5) {
                                            return (
                                                <span key={item + index}
                                                    draggable="true"
                                                    id={item.key}
                                                    onDragStart={this.drag}
                                                    className="constants height-40 align-middle"
                                                >
                                                    {item.key}
                                                </span>
                                            )
                                        }
                                    })
                                }
                            </Colxx>
                        </Row>
                        <Row className="mt-4">
                            <Colxx xxs="12" onDrop={this.drop}>
                                {/* <Label className="form-group has-float-label w-100"> */}
                                <CkCalculator
                                    content={this.state.content}
                                    ckOptions={{
                                        activeClass: "p10",
                                        data: this.state.content,
                                        // events: {
                                        //     "blur": this.onBlur,
                                        //     "afterPaste": this.afterPaste,
                                        //     "change": this.onChange
                                        // }
                                    }}
                                />
                                {/* <Input
                                type="textarea"
                                name="formula"
                                rows="5"
                                className="input-tag"
                                value={this.state.formula}
                                onChange={() => {
                                    // this.handleChangeFunc()
                                }}
                            /> */}
                                {/* <span>
                                        {"Formula"}
                                    </span> */}
                                {/* </Label> */}
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