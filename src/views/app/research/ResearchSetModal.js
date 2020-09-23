import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx } from "../../../components/common/CustomBootstrap";
import Select from 'react-select';
import { SETS, SOURCE_CATEGORIES } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';

class ResearchSetModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCate: null,
            radioValue: "update-cate-set",
            cateSetList: []
        }
    }

    componentDidMount() {
        this.loadProductSets()
    }

    loadProductSets = () => {
        ApiController.callAsync('get', SETS.categories, {})
        .then(data => {
            this.setState({ cateSetList: data.data.result });
        }).catch(error => {
            console.log(error);
            NotificationManager.warning(error.response.data.message, "Thất bại", 1000);
            if(error.response.status === 401) {
                setTimeout(function(){ 
                    NotificationManager.info("Yêu cầu đăng nhập tài khoản researcher!", "Thông báo", 2000);
                    setTimeout(function(){ 
                        window.open("/user/login", "_self")
                    }, 1500);
                }, 1500);
            }
        });
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

    ShowInputArea = ({ cateSetName, handleChangeCate }) => {
        let setName = (event) => {
            cateSetName(event.target.value)
        };

        if (this.state.radioValue === "update-cate-set") {
            let options = [];
            const dataOptions = this.state.cateSetList;
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
                    <Label>
                        Chọn ngành hàng
                    </Label>
                    <Select
                        options={options}
                        value={this.state.selectedCate}
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

    render() {
        if (!this.props.isOpenRadio) {
            return null;
        }

        let { createCateSet } = this.props;
        let { handleChange } = this;
        let { selectedCate } = this.state;

        return (
            <div>
                <Modal isOpen={true} toggle={this.props.toggleResearchSetModal}>
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
                            this.ShowInputArea({
                                cateSetName: this.cateSetName,
                                handleChangeCate: this.handleChangeCate,
                            })
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="secondary"
                            onClick={() => {
                                this.props.toggleResearchSetModal();
                            }}
                        >
                            Close
                        </Button>
                        <Button variant="primary"
                            onClick={() => {
                                this.props.toggleResearchSetModal();
                                createCateSet(selectedCate);
                            }}
                        >Save</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

}

export default ResearchSetModal;