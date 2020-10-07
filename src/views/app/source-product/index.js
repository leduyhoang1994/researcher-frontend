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
import { SOURCE_CATEGORIES, SOURCE_PRODUCTS } from '../../../constants/api';
import SourceProductModal from './SourceProductModal';
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
      },
      data: [],
      pagination: {
        page: 0,
        pages: 0,
        size: 25,
      },
      sorted: [],
      collapse: false,
      keySearch: null,
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    this.loadSites();
    this.loadCategories();
    this.prepareQuery();
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
    let { filter } = this.state;
    filter.categoriesFilter = value;
    this.setState({
      filter
    });
  }

  toggleCollapse = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  prepareQuery = (orderBy = null, desc) => {
    const { pagination } = this.state;
    const { sourceProductName, categoriesFilter, siteFilter, minMonthlySale, maxMonthlySale, minPriceMax, maxPriceMax, type } = this.state.filter;
    let site = [];
    let sourceCategoryId = [];
    siteFilter.forEach(item => {
      site.push(item.value);
    })
    categoriesFilter.forEach(item => {
      sourceCategoryId.push(item.id)
    })
    const arrFilter = { sourceProductName, sourceCategoryId, site, minMonthlySale, maxMonthlySale, minPriceMax, maxPriceMax, type };
    let data = {};
    for (let key in arrFilter) {
      const value = arrFilter[key] || null;
      if (value != null && value.length > 0) {
        data[key] = value;
      }
    }
    let apiResource = {};
    if (orderBy?.length) {
      apiResource = {
        url: SOURCE_PRODUCTS.all,
        query: {
          ...data,
          orderBy,
          desc,
          page: pagination.page,
          size: pagination.size
        }
      }
    } else {
      apiResource = {
        url: SOURCE_PRODUCTS.all,
        query: {
          ...data,
          page: pagination.page,
          size: pagination.size
        }
      }
    }
    this.loadData(apiResource);
  }

  loadData = (apiResource) => {
    let { url, query } = apiResource;
    this.setState({ isLoading: true });

    const { pagination } = this.state;

    ApiController.call("GET", url, query, response => {
      pagination.pages = Number(response.pageCount);
      pagination.current_page = Number(response.page);
      pagination.page = Number(response.page);
      pagination.defaultPageSize = Number(response.count);
      this.setState({
        data: response.data,
        pagination: pagination,
        isLoading: false
      });
    });
  }

  onPageChange = (page) => {
    let { pagination } = this.state;
    pagination.page = page;
    if (page > 1) {
      pagination.canPrevious = true;
    } else {
      pagination.canPrevious = false;
    }
    if (page < pagination.pages - 1) {
      pagination.canNext = true;
    } else {
      pagination.canNext = false;
    }
    this.setState({
      pagination: pagination
    })
    this.prepareQuery();
  }

  onPageSizeChange = (size) => {
    const { pagination } = this.state;
    pagination.size = size;
    pagination.pages = Math.ceil(this.props.data?.length / size)
    this.setState({
      pagination: pagination
    })
    this.prepareQuery();
  }

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
    const { filter, collapse, keySearch, data, pagination } = this.state;
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
                        }}
                      />
                      <span>
                        {__(this.messages, "Ngành hàng")}
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
                          {__(this.messages, "Giá sản phẩm max từ")}
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
                          {__(this.messages, "Giá sản phẩm max đến")}
                        </span>
                      </Label>
                    </Colxx>
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
                          }}
                        />
                        <span>
                          {__(this.messages, "Nguồn sản phẩm")}
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
                  onClick={this.prepareQuery}
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
                  component={this}
                  data={data}
                  pagination={pagination}
                  prepareQuery={this.prepareQuery}
                  addToSelectedProducts={this.addToSelectedProducts}
                  removeFromSelectedProducts={this.removeFromSelectedProducts}
                  existInSelectedProducts={this.existInSelectedProducts}
                  handleCheckAll={this.handleCheckAll}
                  allProductSelected={this.allProductSelected}
                  onPageChange={this.onPageChange}
                  onPageSizeChange={this.onPageSizeChange}
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
          key={this.state.isOpenSourceProductModal}
          isOpen={this.state.isOpenSourceProductModal}
          toggleModal={this.toggleOpenSourceProductModal}
          selectedProducts={this.state.selectedProducts}
        />
      </Fragment >
    );
  }
}

export default injectIntl(CreateTrainingClass);