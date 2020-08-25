import React, { Component, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx } from "../../../components/common/CustomBootstrap";
import Select from 'react-select';

class RadioButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCate: null,
            radioValue: "update-cate-set"
        }
    }

    handleChange = (data) => {
        if (data === "add-new-cate-set") {
            this.setState({
                selectedCate: null
            });
        }
        this.setState({ radioValue: data });
    }

    cateSetName = (data) => {
        this.props.cateSetName(data)
    }

    handleChangeCate = (data) => {
        this.setState({
            selectedCate: data
        })
    }

    render() {
        if (!this.props.isOpenRadio) {
            return null;
        }

        let options = [];
        let { createCateSet, dataOptions  } = this.props;
        let { handleChange } = this;
        let { radioValue, selectedCate } = this.state;


        if (dataOptions) {
            dataOptions.forEach(data => {
                let temp = {};
                temp.value = data.id;
                temp.label = data.setName;
                options.push(temp);
            })
        }

        return (
            <div>
                <Modal isOpen={true} toggle={this.props.toggleRadioModal}>
                    <ModalHeader>
                        <IntlMessages id="forms.title" />
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                            <Label sm={2} className="pt-0">
                                <IntlMessages id="Chọn" />
                            </Label>
                            <Colxx sm={10}>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="radio" defaultChecked onClick={() => handleChange("update-cate-set")} />
                                        <IntlMessages id="forms.first-radio" />
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="radio" onClick={() => handleChange("add-new-cate-set")} />
                                        <IntlMessages id="forms.second-radio" />
                                    </Label>
                                </FormGroup>
                            </Colxx>
                        </FormGroup>
                        {
                            Show({
                                radioValue,
                                options,
                                cateSetName: this.cateSetName,
                                handleChangeCate: this.handleChangeCate,
                                selectedCate: this.state.selectedCate
                            })
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="secondary"
                            onClick={() => {
                                this.props.toggleRadioModal();
                            }}
                        >
                            Close
                        </Button>
                        <Button variant="primary"
                            onClick={() => {
                                this.props.toggleRadioModal();
                                createCateSet(selectedCate);
                            }}
                        >Save</Button>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }

}


const Show = ({ radioValue, options, cateSetName, handleChangeCate, selectedCate }) => {

    let selected = "";
    let setName = (event) => {
        cateSetName(event.target.value)
    };

    if (radioValue === "update-cate-set") {
        return (
            <div>
                <Label>
                    Chọn ngành hàng
                </Label>
                <Select
                    options={options}
                    value={selectedCate}
                    onChange={handleChangeCate}
                />
            </div>
        )
    } else {
        return (
            <div>
                <Label>
                    {/* <IntlMessages id="user.email" /> */}
                    Nhập tên ngành hàng
                </Label>
                <Input
                    type="text"
                    className="form-control"
                    name="name"
                    onChange={setName}
                />
            </div>
        )
    }
}
export default RadioButton;