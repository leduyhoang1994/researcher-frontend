import React, { Component, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx } from "../../../components/common/CustomBootstrap";
import Select from 'react-select';
import ApiController from '../../../helpers/Api';
import { PRODUCTS } from '../../../constants/api';
import { arrayColumn } from '../../../helpers/Utils';
import { NotificationManager } from '../../../components/common/react-notifications';

class ProductSetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProducts: this.props.selectedProducts || [],
      radioValue: "update-product-set",
      listProductSet: [],
      options: [],
      productSetName: "",
      selected: ""
    };
    console.log(this.props.selectedProducts);
  }

  componentDidMount() {
    this.loadProductSets();
  }

  loadProductSets = () => {
    ApiController.call('get', PRODUCTS.set, {}, data => {
      let options = [];
      if (data) {
        data.forEach(element => {
          let option = {};
          option.label = element.setName;
          option.value = element.setName;
          options.push(option);
        });
      }
      this.setState({
        listProductSet: data,
        options: options
      })
    });
  }

  handleChange = (data) => {
    if (data === "add-new-product-set") {
      this.setState({
        selected: null
      });
    }
    this.setState({ radioValue: data });
  }

  createProductSet = () => {
    const { selectedProducts, listProductSet, selected } = this.state;

    const productSetName = this.state.productSetName;

    if (productSetName == null || productSetName === []) {
      return;
    }

    const productIds = arrayColumn(selectedProducts, "id");

    if (this.state.radioValue === "update-product-set") {
      let setId = null;
      listProductSet.forEach(product => {
        if (product.setName === selected.value) {
          setId = product.id;
        }
      })
      //Add to existed cateSet
      ApiController.post(PRODUCTS.addToSet, {
        setId: setId,
        itemId: productIds
      }, data => {
        NotificationManager.success("Thành công", "Thành công");
      });
    } else {
      //Create new cateSet
      ApiController.post(PRODUCTS.set, {
        setName: productSetName,
        ids: productIds
      }, data => {
        NotificationManager.success("Thành công", "Thành công");
      });
    }
  }

  // handleChangeProduct = (data) => {
  //   this.setState({
  //     selectedProducts: data
  //   })
  // }

  setProductSetName = (event) => {
    this.setState({
      productSetName: event.target.value
    })
  }

  handleChangeProduct = (data) => {
    this.setState({
      selected: data
    })
  };

  ShowInputArea = () => {
    

    if (this.state.radioValue === "update-product-set") {
      return (
        <div>
          <Label>
            Chọn bộ sản phẩm
                  </Label>
          <Select
            options={this.state.options}
            value={this.state.selected}
            onChange={this.handleChangeProduct}
          />
        </div>
      )
    } else {
      return (
        <div>
          <Label>
            {/* <IntlMessages id="user.email" /> */}
                      Nhập tên bộ sản phẩm
                  </Label>
          <Input
            type="text"
            className="form-control"
            name="name"
            value={this.state.productSetName}
            onChange={this.setProductSetName}
          />
        </div>
      )
    }
  }

  render() {
    const { isOpen, toggleModal } = this.props;
    const { handleChange, createProductSet, setProductSetName } = this;
    const { selectedProducts } = this.state;

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggleModal}>
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
                    <Input type="radio" name="radio" defaultChecked onClick={() => handleChange("update-product-set")} />
                    <IntlMessages id="forms.first-radio" />
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="radio" onClick={() => handleChange("add-new-product-set")} />
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
              onClick={() => {
                toggleModal();
                createProductSet();
              }}
            >Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default ProductSetModal;