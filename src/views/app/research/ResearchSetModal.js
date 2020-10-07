import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx } from "../../../components/common/CustomBootstrap";
import Select from 'react-select';
import { CATEGORY_SETS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';
import { arrayColumn } from '../../../helpers/Utils';

class ResearchSetModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            radioValue: "update-cate-set",
            cateSetList: [],
            selectedCate: null,
            cateSetName: "",
        }
    }

    componentDidMount() {
        this.loadProductSets()
    }

    loadProductSets = () => {
        ApiController.callAsync('get', CATEGORY_SETS.all, {})
        .then(data => {
            this.setState({ cateSetList: data.data.result });
        }).catch(error => {
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
        this.setState({
            cateSetName: data
        })
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
                        Nhập tên ngành hàng
                    </Label>
                    <Input
                        type="text"
                        className="form-control"
                        name="name"
                        defaultValue={this.state.cateSetName}
                        onChange={setName}
                    />
                </div>
            )
        }
    }

    createCategoriesSet = () => {
        const { selectedCats } = this.props;
        const cateIds = arrayColumn(selectedCats, "id");
        const { radioValue } = this.state;

        if (radioValue === "update-cate-set") {
            //Add to existed cateSet
            const { selectedCate } = this.state;
            ApiController.post(CATEGORY_SETS.add, {
                setId: selectedCate.value,
                itemId: cateIds
            }, data => {
                NotificationManager.success("Xem chi tiết tại đây", "Thành công", 3000, () => {
                    window.open(`/app/source-category-sets/${selectedCate.value}`);
                });
            });
        } else {
            //Create new cateSet
            const { cateSetName } = this.state;
            ApiController.post(CATEGORY_SETS.all, {
                setName: cateSetName,
                ids: cateIds
            }, data => {
                console.log(data);
                NotificationManager.success("Xem chi tiết tại đây", "Thành công", 1500, () => {
                    window.open(`/app/source-category-sets/${data.id}`);
                });
            });
        }
    }

    render() {
        if (!this.props.isOpenRadio) {
            return null;
        }

        let { radioValue, selectedCate, cateSetName } = this.state;
        const updateCateSet = "update-cate-set";

        const isDisabled = radioValue === updateCateSet ? 
        !(radioValue === updateCateSet && selectedCate) : 
        !(radioValue !== updateCateSet && cateSetName);
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
                                        <Input type="radio" name="radio" defaultChecked onClick={() => this.handleChange("update-cate-set")} />
                                        <IntlMessages id="forms.first-radio" />
                                    </Label>
                                </FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input type="radio" name="radio" onClick={() => this.handleChange("add-new-cate-set")} />
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
                            disabled={isDisabled}
                            onClick={() => {
                                this.createCategoriesSet()
                                this.props.toggleResearchSetModal();
                            }}
                        >Save</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ResearchSetModal;