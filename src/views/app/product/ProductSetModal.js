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
      productSetName: ""
    };
    console.log(this.props.selectedProducts);
  }

  componentDidMount() {
    this.loadProductSets();
  }

  loadProductSets = () => {
    ApiController.call('get', PRODUCTS.set, {}, data => {
      this.setState({
        listProductSet: data
      })
    });
  }

  handleChange = (data) => {
    if (data === "add-new-product-set") {
      this.setState({
        selectedProducts: null
      });
    }
    this.setState({ radioValue: data });
  }

  createProductSet = (productSet = null) => {
    const { selectedProducts } = this.props;

    console.log(selectedProducts);

    const productSetName = this.state.productSetName;

    if (productSetName == null || productSetName === []) {
        return;
    }
    const productIds = arrayColumn(selectedProducts, "id");

    if (productSet) {
        //Add to existed cateSet
        ApiController.post(PRODUCTS.addToSet, {
            setId: productSet.value,
            itemId: productIds
        }, data => {
            NotificationManager.success("Thành công", "Thành công");
        });
    } else {
        //Crate new cateSet
        ApiController.post(PRODUCTS.set, {
            setName: productSetName,
            ids: productIds
        }, data => {
            NotificationManager.success("Thành công", "Thành công");
        });
    }
  }

  setProductSetName = (value) => {
    this.setState({
      productSetName: value
    })
  }

  render() {
    const { isOpen, toggleModal } = this.props;
    const { handleChange, createProductSet, setProductSetName } = this;
    const { radioValue, listProductSet, selectedProducts, productSetName } = this.state;

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
              Show({
                radioValue,
                listProductSet,
                productSetName,
                setProductSetName: setProductSetName,
                handleChangeCate: this.handleChangeCate,
                selectedCate: this.state.selectedCate
              })
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
                createProductSet(selectedProducts);
              }}
            >Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}


const Show = ({ radioValue, listProductSet, setProductSetName, productSetName, handleChangeCate, selectedCate }) => {
  let setName = (event) => {
    setProductSetName(event.target.value)
  };

  if (radioValue === "update-product-set") {
    return (
      <div>
        <Label>
          Chọn bộ sản phẩm
                </Label>
        <Select
          options={listProductSet}
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
                    Nhập tên bộ sản phẩm
                </Label>
        <Input
          type="text"
          className="form-control"
          name="name"
          value={productSetName}
          onChange={setName}
        />
      </div>
    )
  }
}

export default ProductSetModal;