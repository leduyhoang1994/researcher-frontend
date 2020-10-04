import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Label, CardFooter, Button, Input, Collapse } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import Select, { createFilter } from 'react-select';
import SourceProductTable from './SourceProductTable';
import ProductList from '../../../data/products';
import ApiController from '../../../helpers/Api';
import { SOURCE_CATEGORIES } from '../../../constants/api';
import SourceProductModal from './SourceProductModal';
import { arrayColumn } from '../../../helpers/Utils';
import { NotificationManager } from '../../../components/common/react-notifications';

class CreateTrainingClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryOptions: [],
      siteOptions: [],
      productList: JSON.parse(JSON.stringify(ProductList)),
      selectedProducts: [],
      isOpenSourceProductModal: false,
      filter: {
        categoriesFilter: [],
        sourceProductName: "",
        siteFilter: [],
        minMonthlySale: null,
        maxMonthlySale: null,
        minPriceMax: null,
        maxPriceMax: null,
        type: "non-relation"
      },
      collapse: false,
      keySearch: false,
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    this.loadSites();
    this.loadCategories();
  }

  loadSites = () => {
    ApiController.callAsync('get', SOURCE_CATEGORIES.site, {})
      .then(data => {
        let sites = [];
        data.data.result.forEach(item => {
          let val = item[Object.keys(item)[0]];
          sites.push({ label: val, value: val })
        })
        this.setState({
          siteOptions: sites
        });
        this.searchProducts();
      }).catch(error => {
        if (error.response) {
          NotificationManager.warning(error.response.data.message, "Thất bại", 1000);
          if (error.response.status === 401) {
            setTimeout(function () {
              NotificationManager.info("Yêu cầu đăng nhập tài khoản researcher!", "Thông báo", 2000);
              setTimeout(function () {
                window.open("/user/login", "_self")
              }, 1500);
            }, 1500);
          }
        }
      });
  }

  onChangeSites = (value) => {
    let { filter } = this.state;
    filter.siteFilter = value;
    this.setState({
      filter
    });
  }

  onChangeCategory = value => {
    console.log(value);
    let { filter } = this.state;
    filter.categoriesFilter = value;
    this.setState({
      filter
    });
  }

  toggleCollapse = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  loadCategories = () => {
    ApiController.callAsync('get', SOURCE_CATEGORIES.all, {})
      .then(data => {
        this.setState({
          categoryOptions: data.data.result
        }, () => {
          if (localStorage.getItem('selectedItems')) {
            const categoriesFilter = JSON.parse(localStorage.getItem('selectedItems'));
            this.onChangeCategory(categoriesFilter);
          }
        });
        this.searchProducts();
      }).catch(error => {
        if (error.response) {
          NotificationManager.warning(error.response.data.message, "Thất bại", 1000);
          if (error.response.status === 401) {
            setTimeout(function () {
              NotificationManager.info("Yêu cầu đăng nhập tài khoản researcher!", "Thông báo", 2000);
              setTimeout(function () {
                window.open("/user/login", "_self")
              }, 1500);
            }, 1500);
          }
        }
      });
  };

  searchProducts = () => {
    const { filter } = this.state;
    const s = filter.categoriesFilter.length > 0 ? {
      sourceCategoryId: {
        "$in": arrayColumn(filter.categoriesFilter, 'id')
      }
    } : {};

    filter.s = s;
    this.setState({
      filter: filter,
      keySearch: !this.state.keySearch
    });
  };

  existInSelectedProducts = (product) => {
    const { selectedProducts } = this.state;
    let exist = false;
    selectedProducts.forEach(selectedProduct => {
      if (JSON.stringify(selectedProduct) === JSON.stringify(product)) {
        exist = true;
        return false;
      }
    });
    return exist;
  }

  addToSelectedProducts = (products) => {
    let newProducts = []

    if (Array.isArray(products)) newProducts = [...products];
    else newProducts.push(products);

    const { selectedProducts } = this.state;

    for (const product of newProducts) {
      let exist = this.existInSelectedProducts(product);
      if (!exist) {
        selectedProducts.push(product);
      }
    }

    this.setState({
      selectedProducts: selectedProducts
    });
  };

  allProductSelected = (data) => {
    if (Array.isArray(data)) {
      for (const index of data)
        if (this.existInSelectedProducts(index) === false) return false
    }
    return true
  }

  removeFromSelectedProducts = (products) => {
    let { selectedProducts } = this.state;

    let newProducts = []

    if (Array.isArray(products)) newProducts = [...products]
    else newProducts.push(products)

    for (const product of newProducts) {
      selectedProducts = selectedProducts.filter(selectedProduct => {
        return JSON.stringify(selectedProduct) !== JSON.stringify(product);
      });
    }

    this.setState({
      selectedProducts: selectedProducts
    });
  };

  toggleOpenSourceProductModal = () => {
    this.setState({
      isOpenSourceProductModal: !this.state.isOpenSourceProductModal
    });
  }

  handleCheckAll = (checked, datas) => {
    const newDatas = datas.map(data => data._original)
    if (checked)
      this.addToSelectedProducts(newDatas)
    else this.removeFromSelectedProducts(newDatas)
  }

  render() {
    const { filter, collapse, keySearch } = this.state;
    const { siteFilter } = filter;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="Tìm kiếm sản phẩm" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  {__(this.messages, 'Bộ lọc')}
                </CardTitle>

                <Row>
                  <Colxx xxs="6">
                    <Label className="form-group has-float-label">
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        isMulti
                        className="react-select"
                        classNamePrefix="react-select"
                        options={this.state.categoryOptions}
                        getOptionValue={option => option.id}
                        getOptionLabel={option => option.categoryNameViLevel3}
                        value={filter.categoriesFilter}
                        onChange={(value) => {
                          this.onChangeCategory(value)
                          setTimeout(() => {
                            this.searchProducts();
                          }, 500);
                        }}
                      />
                      <span>
                        {__(this.messages, "Thư mục")}
                      </span>
                    </Label>
                  </Colxx>
                  <Colxx xxs="6">
                    <Label className="form-group has-float-label">
                      <Input
                        type="text"
                        className="form-control"
                        name="name"
                        defaultValue={filter.sourceProductName}
                        onChange={e => {
                          this.setState({
                            filter: {
                              ...this.state.filter,
                              sourceProductName: e.target.value
                            }
                          });
                        }}
                      />
                      <span>
                        {__(this.messages, "Tên sản phẩm")}
                      </span>
                    </Label>
                  </Colxx>
                </Row>

                <Collapse isOpen={collapse}>
                  <Row>
                    <Colxx xxs="6">
                      <Label className="form-group has-float-label">
                        <Select
                          filterOption={createFilter({ ignoreAccents: false })}
                          isMulti
                          className="react-select"
                          classNamePrefix="react-select"
                          options={this.state.siteOptions}
                          value={siteFilter.label}
                          onChange={(value) => {
                            this.onChangeSites(value)
                            setTimeout(() => {
                              this.searchProducts();
                            }, 500);
                          }}
                        />
                        <span>
                          {__(this.messages, "Nguồn sản phẩm")}
                        </span>
                      </Label>
                    </Colxx>
                    <Colxx xxs="6">

                    </Colxx>
                    <Colxx xxs="6">
                      <Label className="form-group has-float-label">
                        <Input
                          type="number"
                          min={0}
                          className="form-control"
                          name="minMonthlySale"
                          defaultValue={filter.minMonthlySale}
                          onChange={e => {
                            this.setState({
                              filter: {
                                ...this.state.filter,
                                minMonthlySale: e.target.value
                              }
                            });
                          }}
                        />
                        <span>
                          {__(this.messages, "Doanh số tháng từ")}
                        </span>
                      </Label>
                    </Colxx>
                    <Colxx xxs="6">
                      <Label className="form-group has-float-label">
                        <Input
                          type="number"
                          min={0}
                          className="form-control"
                          name="maxMonthlySale"
                          defaultValue={filter.maxMonthlySale}
                          onChange={e => {
                            this.setState({
                              filter: {
                                ...this.state.filter,
                                maxMonthlySale: e.target.value
                              }
                            });
                          }}
                        />
                        <span>
                          {__(this.messages, "Doanh số tháng đến")}
                        </span>
                      </Label>
                    </Colxx>
                    <Colxx xxs="6">
                      <Label className="form-group has-float-label">
                        <Input
                          type="number"
                          min={0}
                          className="form-control"
                          name="minPriceMax"
                          defaultValue={filter.minPriceMax}
                          onChange={e => {
                            this.setState({
                              filter: {
                                ...this.state.filter,
                                minPriceMax: e.target.value
                              }
                            });
                          }}
                        />
                        <span>
                          {__(this.messages, "Giá sản phẩm từ")}
                        </span>
                      </Label>
                    </Colxx>
                    <Colxx xxs="6">
                      <Label className="form-group has-float-label">
                        <Input
                          type="number"
                          min={0}
                          className="form-control"
                          name="maxPriceMax"
                          defaultValue={filter.maxPriceMax}
                          onChange={e => {
                            this.setState({
                              filter: {
                                ...this.state.filter,
                                maxPriceMax: e.target.value
                              }
                            });
                          }}
                        />
                        <span>
                          {__(this.messages, "Giá sản phẩm đến")}
                        </span>
                      </Label>
                    </Colxx>
                  </Row>
                </Collapse>
                <div className="text-right">
                  <Button color="primary" onClick={this.toggleCollapse} className="mb-1">
                    {__(this.messages, this.state.collapse ? "Thu nhỏ" : "Mở rộng")}
                  </Button>
                </div>

              </CardBody>
              <CardFooter className="text-right">
                <Button
                  onClick={this.searchProducts}
                >
                  {__(this.messages, "Tìm kiếm")}
                </Button>
              </CardFooter>
            </Card>
          </Colxx>
        </Row >
        <Row>
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <SourceProductTable
                  key={keySearch}
                  component={this}
                  data={this.state.productList}
                  addToSelectedProducts={this.addToSelectedProducts}
                  removeFromSelectedProducts={this.removeFromSelectedProducts}
                  existInSelectedProducts={this.existInSelectedProducts}
                  // filterCate={filter.categoriesFilter}
                  filter={filter}
                  handleCheckAll={this.handleCheckAll}
                  allProductSelected={this.allProductSelected}
                />
              </CardBody>
              <CardFooter className="text-right">
                <Button
                  onClick={e => {
                    this.toggleOpenSourceProductModal()
                  }}
                >
                  {__(this.messages, "Lưu bộ sản phẩm")}
                </Button>
              </CardFooter>
            </Card>
          </Colxx>
        </Row>
        <SourceProductModal
          isOpen={this.state.isOpenSourceProductModal}
          toggleModal={this.toggleOpenSourceProductModal}
          selectedProducts={this.state.selectedProducts}
        />
      </Fragment >
    );
  }
}

export default injectIntl(CreateTrainingClass);