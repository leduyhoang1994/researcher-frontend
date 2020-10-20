import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,  Label, Input } from 'reactstrap';
import IntlMessages from "../../../helpers/IntlMessages";
import Select from 'react-select';
import ApiController from '../../../helpers/Api';
import { GROUP_ORDERS } from '../../../constants/api';
import { NotificationManager } from '../../../components/common/react-notifications';

class GroupOrderModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioValue: "add-group-order",
      groupOrderName: "",
      selected: "",
      descriptions: "",
      optionGroupOrders: [],
    };
  }

  componentDidMount() {
    this.getGroupOrder()
  }

  getGroupOrder = () => {
    let optionGroupOrders = [];
    ApiController.get(GROUP_ORDERS.all, {}, data => {
      data.forEach(item => {
        optionGroupOrders.push({ label: item.name, value: item.id })
      })
      this.setState({
        optionGroupOrders
      })
    });
  }

  handleChange = (data) => {
    if (data === "add-group-order") {
      this.setState({
        selected: null
      });
    } else {
      this.setState({
        groupOrderName: ""
      });
    }
    this.setState({ radioValue: data });
  }

  setGroupOrderName = (event) => {
    this.setState({
      groupOrderName: event.target.value
    })
  }

  handleChangeGroupOrder = (data) => {
    this.setState({
      selected: data
    })
  };

  createGroupOrder = () => {
    if (this.state.radioValue === "update-group-order") {
      this.props.setGroupOrderId(this.state.selected.value);
    } else {
      const data = { name: this.state.groupOrderName, descriptions: this.state.descriptions }
      ApiController.callAsync('post', GROUP_ORDERS.all, data)
        .then(data => {
          if (data.data.statusCode === 200) {
            NotificationManager.success("Thêm lô hàng thành công", "Thành công", 1000);
            this.props.setGroupOrderId(data.data.result.id);
          }
        }).catch(error => {
          if (error.response.status === 401) {
            setTimeout(function () {
              NotificationManager.info("Yêu cầu đăng nhập tài khoản khách hàng!", "Thông báo", 2000);
              setTimeout(function () {
                window.open("/seller/login", "_self")
              }, 1500);
            }, 1500);
          } else {
            NotificationManager.warning("Thêm lô hàng thất bại", "Thất bại", 1000);
          }
        });
    }
  }

  ShowInputArea = () => {
    if (this.state.radioValue === "update-group-order") {
      return (
        <div>
          <Label className="form-group has-float-label mb-4">
            <Select
              className="react-select"
              classNamePrefix="react-select"
              options={this.state.optionGroupOrders}
              value={this.state.selected}
              onChange={this.handleChangeGroupOrder}
            />
            <IntlMessages id="Chọn lô hàng *" />
          </Label>
        </div>
      )
    } else {
      return (
        <div>
          <Label className="form-group has-float-label mb-4">
            <Input
              type="text"
              className="form-control"
              name="groupOrderName"
              value={this.state.groupOrderName}
              onChange={this.setGroupOrderName}
            />
            <IntlMessages id="Nhập tên lô hàng *" />
          </Label>
          <Label className="form-group has-float-label mb-3">
            <Input
              type="text"
              className="form-control"
              name="descriptions"
              value={this.state.descriptions}
              onChange={e => {
                this.setState({
                  descriptions: e.target.value
                })
              }}
            />
            <IntlMessages id="Mô tả" />
          </Label>
        </div>
      )
    }
  }

  render() {
    const { isOpen, toggleModal } = this.props;
    const { radioValue, selected, groupOrderName } = this.state;

    const update = "update-group-order";
    const isDisabled = radioValue === update ?
      !(radioValue === update && selected) :
      !(radioValue !== update && groupOrderName);

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggleModal}>
          <ModalHeader>
            <IntlMessages id="Tạo mới lô hàng" />
          </ModalHeader>
          <ModalBody>
            {/* <FormGroup row>
              <Label sm={2} className="pt-0">
                <IntlMessages id="Chọn" />
              </Label>
              <Colxx sm={10}>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="radio" defaultChecked onClick={() => this.handleChange("update-group-order")} />
                    <IntlMessages id="forms.first-radio" />
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="radio" onClick={() => this.handleChange("add-group-order")} />
                    <IntlMessages id="forms.second-radio" />
                  </Label>
                </FormGroup>
              </Colxx>
            </FormGroup> */}
            {
              this.ShowInputArea()
            }
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary"
              onClick={() => {
                toggleModal();
              }}
            >
              Close
            </Button>
            <Button variant="primary"
              disabled={isDisabled}
              onClick={() => {
                toggleModal();
                this.createGroupOrder()
              }}
            >Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default GroupOrderModals;