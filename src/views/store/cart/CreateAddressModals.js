import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Row } from 'reactstrap';
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx } from "../../../components/common/CustomBootstrap";
import Select from 'react-select';
import ApiController from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';
import { ADDRESS, ADDRESS_ORDER } from '../../../constants/api';

class CreateAddressModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: [],
      selectedCity: null,
      selectedDistrict: null,
      selectedCommune: null,
      optionsCity: [],
      optionsDistrict: [],
      optionsCommune: [],
      name: "",
      recipient: "",
      phone: "",
      country: "",
      street: "",
      description: ""
    };
  }

  componentDidMount() {
    this.getAddress();
  }

  getAddress = () => {
    ApiController.get(ADDRESS.all, {}, data => {
      let address = data;
      delete address["city"];
      this.setState({
        address
      })
      this.getCities();
    });
  }

  getCities = () => {
    let options = [];
    const { address } = this.state;
    address.forEach((item, index) => {
      let value = Object.keys(item)[0];
      options.push({ label: value, value: index });
    })
    this.setState({
      optionsCity: options
    })
  }

  handleChangeCity = city => {
    let options = [];
    this.setState({
      optionsDistrict: [],
      optionsCommune: [],
      selectedDistrict: null,
      selectedCommune: null,
      selectedCity: city
    })

    const index = city.value;
    const selectedCity = this.state.address[index];
    const district = Object.values(selectedCity)[0];

    district.forEach((item, index) => {
      let value = Object.keys(item)[0];
      options.push({ label: value, value: index });
    })

    this.setState({
      optionsDistrict: options,
    })
  };

  handleChangeDistrict = district => {
    this.setState({
      optionsCommune: [],
      selectedCommune: null
    })

    let options = [];

    this.setState({
      selectedDistrict: district
    });

    const index = this.state.selectedCity.value;
    const selectedCity = this.state.address[index];
    const selectedDistrict = Object.values(selectedCity)[0];
    let temp = [];
    selectedDistrict.forEach(item => {
      if (Object.keys(item)[0] === district.label) {
        temp = Object.values(item)[0];
      }
    })

    temp.forEach((value, index) => {
      options.push({ label: value, value: index });
    })

    this.setState({
      optionsCommune: options,
    })
  };

  handleChangeCommune = commune => {
    this.setState({
      selectedCommune: commune
    });
  };

  handleChangeInput = (e) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    })
  }

  createAddressOrder = () => {
    const { name, recipient, phone, selectedCity, selectedDistrict, selectedCommune, street, description } = this.state;
    const city = selectedCity.label;
    const district = selectedDistrict.label;
    const town = selectedCommune.label;
    const data = { name, recipient, phone, country: "Viet Nam", city, district, town, address: street, description }
    ApiController.callAsync('post', ADDRESS_ORDER.all, data)
      .then(data => {
        if (data.data.statusCode === 200) {
          this.props.getSellerAddress()
          NotificationManager.success("Thêm địa chỉ thành công", "Thành công", 1000);
        }
      }).catch(error => {
        console.log(error);
        if (error.response.httpStatus === 401) {
          setTimeout(function () {
            NotificationManager.info("Yêu cầu đăng nhập tài khoản khách hàng!", "Thông báo", 2000);
            setTimeout(function () {
              window.open("/seller/login", "_self")
            }, 1500);
          }, 1500);
        } else {
          NotificationManager.warning("Thêm địa chỉ thất bại", "Thất bại", 1000);
        }
      });
  }

  render() {
    const { isOpen, toggleModalCreateAddress } = this.props;
    const { name, recipient, phone, selectedCity, selectedDistrict, selectedCommune,
      optionsCity, optionsDistrict, optionsCommune, street, description } = this.state;
    let isDisabled = true;
    if (name && recipient && phone && selectedCity && selectedDistrict && selectedCommune && street) {
      isDisabled = false;
    }

    return (
      <div>
        <Modal isOpen={isOpen} toggle={toggleModalCreateAddress}>
          <ModalHeader>
            <IntlMessages id="Thông tin địa điểm nhận hàng" />
          </ModalHeader>
          <ModalBody>
            <Row>
              <Colxx xxs="6">
                <Label className="has-float-label ">
                  <Input
                    type="text"
                    value={name}
                    name="name"
                    onChange={(e) => {
                      this.handleChangeInput(e)
                    }}
                  />
                  <span >
                    <IntlMessages id="Loại địa chỉ *" />
                  </span>
                </Label>
              </Colxx>
              <Colxx xxs="6">
                <Label className="has-float-label ">
                  <Input
                    type="text"
                    value={recipient}
                    name="recipient"
                    onChange={(e) => {
                      this.handleChangeInput(e)
                    }}
                  />
                  <span >
                    <IntlMessages id="Tên người nhận *" />
                  </span>
                </Label>
              </Colxx>
              <Colxx xxs="6">
                <Label className="has-float-label ">
                  <Input
                    type="text"
                    value={phone}
                    name="phone"
                    onChange={(e) => {
                      this.handleChangeInput(e)
                    }}
                  />
                  <span >
                    <IntlMessages id="Số điện thoại *" />
                  </span>
                </Label>
              </Colxx>
              <Colxx xxs="6">
                <Label className="form-group has-float-label mb-4">
                  <Select
                    className="react-select"
                    classNamePrefix="react-select"
                    value={selectedCity}
                    onChange={this.handleChangeCity}
                    options={optionsCity}
                  />
                  <IntlMessages id="Tỉnh / Thành phố *" />
                </Label>
              </Colxx>

              <Colxx xxs="6">
                <Label className="form-group has-float-label mb-4">
                  <Select
                    className="react-select"
                    classNamePrefix="react-select"
                    value={selectedDistrict}
                    onChange={this.handleChangeDistrict}
                    options={optionsDistrict}
                  />
                  <IntlMessages id="Quận / Huyện *" />
                </Label>
              </Colxx>
              <Colxx xxs="6">
                <Label className="form-group has-float-label mb-4">
                  <Select
                    className="react-select"
                    classNamePrefix="react-select"
                    value={selectedCommune}
                    onChange={this.handleChangeCommune}
                    options={optionsCommune}
                  />
                  <IntlMessages id="Phường / Xã" />
                </Label>
              </Colxx>
              <Colxx xxs="6">
                <Label className="has-float-label ">
                  <Input
                    type="text"
                    value={street}
                    name="street"
                    onChange={(e) => {
                      this.handleChangeInput(e)
                    }}
                  />
                  <span >
                    <IntlMessages id="Địa chỉ *" />
                  </span>
                </Label>
              </Colxx>
              <Colxx xxs="6">
                <Label className="has-float-label ">
                  <Input
                    type="text"
                    value={description}
                    name="description"
                    onChange={(e) => {
                      this.handleChangeInput(e)
                    }}
                  />
                  <span >
                    <IntlMessages id="Mô tả" />
                  </span>
                </Label>
              </Colxx>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary"
              onClick={() => {
                toggleModalCreateAddress();
              }}
            >
              Close
            </Button>
            <Button variant="primary"
              disabled={isDisabled}
              onClick={() => {
                toggleModalCreateAddress();
                this.createAddressOrder()
              }}
            >Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default CreateAddressModals;