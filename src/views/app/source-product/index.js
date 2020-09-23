import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Label, CardFooter, Button } from 'reactstrap';
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
      categoriesFilter: [],
      categoryOptions: [],
      search: "",
      productList: JSON.parse(JSON.stringify(ProductList)),
      selectedProducts: [],
      isOpenSourceProductModal: false,
      filter: {}
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    if (localStorage.getItem('selectedItems')) {
      const categoriesFilter = JSON.parse(localStorage.getItem('selectedItems'));
      this.setState({
        categoriesFilter: categoriesFilter.map(cate => cate.category || cate)
      }, () => {
        // localStorage.removeItem('selectedItems');
        this.loadCategories();
      });
    } else {
      this.loadCategories();
    }
  }

  loadCategories = () => {
    ApiController.callAsync('get', SOURCE_CATEGORIES.all, {})
      .then(data => {
        this.setState({
          categoryOptions: data.data.result
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
    const { filter, categoriesFilter } = this.state;
    const s = categoriesFilter.length > 0 ? {
      sourceCategoryId: {
        "$in": arrayColumn(categoriesFilter, 'id')
      }
    } : {};

    filter.s = s;
    this.setState({ filter: filter });
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
    const { filter } = this.state;
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

                {/* <Row>
                  <Colxx xxs="12">
                    <Label className="form-group has-float-label">
                      <Input
                        type="text"
                        onChange={e => {
                          this.setState({
                            search: e.target.value
                          });
                        }}
                      />
                      <span>
                        {__(this.messages, "Tên sản phẩm")}
                      </span>
                    </Label>
                  </Colxx>
                </Row> */}

                <Row>
                  <Colxx xxs="12">
                    <Label className="form-group has-float-label">
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        isMulti
                        options={this.state.categoryOptions}
                        getOptionValue={option => option.id}
                        getOptionLabel={option => option.categoryNameViLevel3}
                        value={this.state.categoriesFilter}
                        onChange={e => {
                          this.setState({
                            categoriesFilter: e
                          });
                          this.searchProducts();
                        }}
                      />
                      <span>
                        {__(this.messages, "Thư mục")}
                      </span>
                    </Label>
                  </Colxx>
                </Row>
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
        </Row>
        <Row>
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <SourceProductTable
                  key={JSON.stringify(filter)}
                  component={this}
                  data={this.state.productList}
                  addToSelectedProducts={this.addToSelectedProducts}
                  removeFromSelectedProducts={this.removeFromSelectedProducts}
                  existInSelectedProducts={this.existInSelectedProducts}
                  filterCate={this.state.categoriesFilter}
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
      </Fragment>
    );
  }
}

export default injectIntl(CreateTrainingClass);