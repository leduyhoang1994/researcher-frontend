import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx } from "../../../components/common/CustomBootstrap";
import Select from 'react-select';
import ApiController from '../../../helpers/Api';
import { PRODUCT_SETS } from '../../../constants/api';
import { arrayColumn } from '../../../helpers/Utils';
import { NotificationManager } from '../../../components/common/react-notifications';

class SourceProductModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProducts: this.props.selectedProducts || [],
      radioValue: "update-source-product-set",
      listSourceProductSets: [],
      options: [],
      sourceProductSetName: "",
      selected: ""
    };
  }

  componentDidMount() {
    this.loadProductSets();
  }

  loadProductSets = () => {
    ApiController.call('get', PRODUCT_SETS.all, {}, data => {
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
        listSourceProductSets: data,
        options: options
      })
    });
  }

  handleChange = (data) => {
    if (data === "add-new-source-product-set") {
      this.setState({
        selected: null
      });
    }
    this.setState({ radioValue: data });
  }

  createSourceProductSet = () => {
    const { selectedProducts, listSourceProductSets, selected } = this.state;

    const sourceProductSetName = this.state.sourceProductSetName;

    if (sourceProductSetName == null || sourceProductSetName === []) {
      return;
    }

    const productIds = arrayColumn(selectedProducts, "id");

    if (this.state.radioValue === "update-source-product-set") {
      let setId = null;
      listSourceProductSets.forEach(product => {
        if (product.setName === selected.value) {
          setId = product.id;
        }
      })
      //Add to existed cateSet
      ApiController.post(PRODUCT_SETS.add, {
        setId: setId,
        itemId: productIds
      }, data => {
        NotificationManager.success("Xem chi tiết tại đây", "Thành công", 5000, () => {
          window.open(`/app/source-product-sets/${setId}`)
        });
      });

    } else {
      //Create new cateSet
      ApiController.post(PRODUCT_SETS.all, {
        setName: sourceProductSetName,
        ids: productIds
      }, data => {
        NotificationManager.success("Xem chi tiết tại đây", "Thành công", 5000, () => {
          window.open(`/app/source-product-sets/${data.id}`)
        });
      });
    }
  }

  // handleChangeProduct = (data) => {
  //   this.setState({
  //     selectedProducts: data
  //   })
  // }

  setSourceProductSetName = (event) => {
    this.setState({
      sourceProductSetName: event.target.value
    })
  }

  handleChangeProduct = (data) => {
    this.setState({
      selected: data
    })
  };

  ShowInputArea = () => {
    if (this.state.radioValue === "update-source-product-set") {
      return (
        <div>
          <Label>Chọn bộ sản phẩm</Label>
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
          <Label>Nhập tên bộ sản phẩm</Label>
          <Input
            type="text"
            className="form-control"
            name="name"
            value={this.state.sourceProductSetName}
            onChange={this.setSourceProductSetName}
          />
        </div>
      )
    }
  }

  render() {
    const { isOpen, toggleModal } = this.props;
    const { handleChange, createSourceProductSet } = this;
    const { radioValue, selected, sourceProductSetName } = this.state;

    const update = "update-source-product-set";
    const isDisabled = radioValue === update ? 
    !(radioValue === update && selected) : 
    !(radioValue !== update && sourceProductSetName);

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
                    <Input type="radio" name="radio" defaultChecked onClick={() => handleChange("update-source-product-set")} />
                    <IntlMessages id="forms.first-radio" />
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="radio" onClick={() => handleChange("add-new-source-product-set")} />
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
                createSourceProductSet();
              }}
            >Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default SourceProductModal;