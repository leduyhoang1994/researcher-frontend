import React from 'react';
import { Input, Label, Button, ModalBody } from 'reactstrap';
import { Modal } from 'reactstrap';
import { NotificationManager } from '../../components/common/react-notifications';
import { CONSTANTS } from '../../constants/api';
import ApiController from '../../helpers/Api';
import IntlMessages from '../../helpers/IntlMessages';

class ConstantModals extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            constant: {
                label: "",
                value: "",
                viewValue: "",
                type: 'CUSTOM_VARIABLE'
            },
        }
    }

    componentWillReceiveProps(nextProps) {
        const { constantEdit } = nextProps
        if (constantEdit) {
            this.setState({
                id: constantEdit.id,
                constant: {
                    ...this.state.constant,
                    label: constantEdit.label,
                    value: constantEdit.value,
                    viewValue: constantEdit.viewValue,
                }
            })
        }
    }

    onHandleChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        this.setState({
            constant: { ...this.state.constant, [name]: value }
        })
    }

    clearConstantEdit = () => {
        this.props.clearConstantEdit()
        this.setState({
            id: null,
            constant: {
                label: "",
                value: "",
                viewValue: "",
                type: 'CUSTOM_VARIABLE'
            },
        })
    }

    onFormSubmit = (e) => {
        const { constant } = this.state
        constant['value'] = constant.viewValue

        let flag = true
        if (constant.label?.trim() === "") {
            NotificationManager.warning("Trường \"Từ Khóa\" không được để trống!", "Lưu ý");
            flag = false
        }
        if (constant.viewValue?.trim() === "") {
            NotificationManager.warning("Trường \"Giá Trị\" không được để trống!", "Lưu ý");
            flag = false
        }
        if (flag === false) return

        const { constantEdit } = this.props

        if (constantEdit) {
            constant['id'] = constantEdit.id
            ApiController.callAsync('put', CONSTANTS.all, constant)
                .then(data => {
                    NotificationManager.success("Sửa tham số thành công!", "Thành công");
                    this.props.getData()
                }).catch(error => {
                    NotificationManager.warning("Sửa tham số thất bại!", "Thất bại", 1000);
                });
        } else {
            ApiController.callAsync('post', CONSTANTS.all, constant)
                .then(data => {
                    NotificationManager.success("Thêm tham số thành công!", "Thành công");
                    this.props.getData()
                }).catch(error => {
                    NotificationManager.warning("Tham số đã tồn tại!", "Thất bại", 1000);
                });
        }
    }

    renderMedia = () => {
        const { constant, id } = this.state
        return (
            <>
                <Label className="mr-2">
                    <span>
                        <IntlMessages id="Từ khóa" />
                    </span>
                    <Input
                        value={constant.label}
                        onChange={this.onHandleChange}
                        type="text"
                        name="label"
                    />
                </Label>
                <Label className="mr-2">
                    <span>
                        <IntlMessages id="Giá trị" />
                    </span>
                    <Input
                        value={constant.viewValue}
                        onChange={this.onHandleChange}
                        type="text"
                        name="viewValue"
                    />
                </Label>
                <Label>
                    <Button onClick={this.onFormSubmit}>{id ? "Sửa" : "Tạo"}</Button>
                </Label>
            </>
        )
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} onClosed={this.clearConstantEdit}>
                <ModalBody>
                    <form>
                        {this.renderMedia()}
                    </form>
                </ModalBody>
            </Modal>
        )
    }
}

export default ConstantModals;