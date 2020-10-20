import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx } from "../../../components/common/CustomBootstrap";
import Select from 'react-select';

class OrderModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radioValue: "update-order",
      listOrders: [],
      orderName: "",
      selected: "",
      selectedTransportation: ""
    };
  }

  componentDidMount() {
    let value = this.createUUID();
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = "-" + dd + '/' + mm + '/' + yyyy;
    this.setState({
      orderName: value + today
    })
  }

  handleChange = (data) => {
    if (data === "add-order") {
      this.setState({
        selected: null
      });
    } else {
      this.setState({
        selectedTransportation: null
      });
    }
    this.setState({ radioValue: data });
  }

  createUUID = () => {
    const pattern = 'xxxxxxxx-xxxx-4xxx-yxxx';
    return pattern.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16).toUpperCase();
    });
  }

  handleChangeOrder = (data) => {
    this.setState({
      selected: data
    })
  };

  handleChangeTransportation = (data) => {
    this.setState({
      selectedTransportation: data
    })
  };

  createOrder = () => {
    if (this.state.radioValue === "update-order") {
      this.props.addToOrder("update", this.state.selected.label);
    } else {
      this.props.addToOrder("add", this.state.orderName, this.state.selectedTransportation?.label);
    }
  }

  ShowInputArea = () => {
    if (this.state.radioValue === "update-order") {
      return (
        <div>
          <Label className="form-group has-float-label mb-4">
            <Select
              className="react-select"
              classNamePrefix="react-select"
              options={this.props.optionOrders}
              value={this.state.selected}
              onChange={this.handleChangeOrder}
            />
            <IntlMessages id="Chọn đơn hàng" />
          </Label>
        </div>
      )
    } else {
      return (
        <div>
          <Label className="form-group has-float-label mb-4 mt-3">
            <Select
              className="react-select"
              classNamePrefix="react-select"
              value={this.state.selectedTransportation}
              onChange={this.handleChangeTransportation}
              options={this.props.optionTrans}
            />
            <IntlMessages id="Hình thức vận chuyển *" />
          </Label>
          <Label className="form-group has-float-label mb-4">
            <Input
              disabled
              type="text"
              className="form-control"
              name="name"
              value={this.state.orderName}
            // onLoad={this.setOrderName}
            // onChange={this.setOrderName}
            />
            <IntlMessages id="Tên đơn hàng" />
          </Label>
        </div>
      )
    }
  }

  render() {
    const { isOpen, toggleModal } = this.props;
    const { radioValue, selected, orderName, selectedTransportation } = this.state;

    const update = "update-order";
    const isDisabled = radioValue === update ?
      !(radioValue === update && selected) :
      !(radioValue !== update && orderName && selectedTransportation);

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggleModal}>
          <ModalHeader>
            <IntlMessages id="forms.title-order" />
          </ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Label sm={2} className="pt-0">
                <IntlMessages id="Chọn" />
              </Label>
              <Colxx sm={10}>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="radio" defaultChecked onClick={() => this.handleChange("update-order")} />
                    <IntlMessages id="forms.first-radio" />
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="radio" onClick={() => this.handleChange("add-order")} />
                    <IntlMessages id="forms.second-radio" />
                  </Label>
                </FormGroup>
              </Colxx>
            </FormGroup>
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
                this.createOrder()
              }}
            >Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default OrderModals;