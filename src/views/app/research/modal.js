import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx } from "../../../components/common/CustomBootstrap";
import Select from 'react-select';

class RadioButton extends Component {

    cateSetName = (data) => {
        this.props.cateSetName(data)
    }

    handleChangeCate = (data) => {
        this.props.handleChangeCate(data)
    }

    render() {
        if (!this.props.isOpenRadio) {
            return null;
        }

        let options = [];
        let { handleChange, createCateSet, dataOptions, radioValue } = this.props;


        if (dataOptions) {
            console.log(dataOptions);
            dataOptions.forEach(data => {
                let temp = {};
                temp.value = data.setName;
                temp.label = data.setName;
                options.push(temp);
            })
        }

        return (
            <div>
                <Modal isOpen={true}>
                    <ModalHeader>
                        <IntlMessages id="forms.title" />
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup row>
                            <Label sm={2} className="pt-0">
                                <IntlMessages id="forms.radios" />
                            </Label>
                            <Colxx sm={10}>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="radio" defaultChecked onClick={() => handleChange("first-radio")} />
                                        <IntlMessages id="forms.first-radio" />
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="radio" onClick={() => handleChange("second-radio")} />
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
                                handleChangeCate: this.handleChangeCate
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
                                createCateSet();
                            }}
                        >Save</Button>
                    </ModalFooter>
                </Modal>

            </div>
        )
    }

}


const Show = ({ radioValue, options, cateSetName, handleChangeCate }) => {

    let selected = "";
    let setName = (event) => {
        cateSetName(event.target.value)
    };

    let setCate = selected => {
        handleChangeCate(selected);
    };

    if (radioValue === "first-radio") {
        return (
            <div>
                <Label>
                    Chọn ngành hàng
                </Label>
                <Select options={options} value={selected} onChange={setCate}/>
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