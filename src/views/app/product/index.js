import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Label, Input, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import Select, { createFilter } from 'react-select';
import categoriesData from '../../../data/categories';
import ProductTable from './ProductTable';
import ProductList from '../../../data/products';
import ApiController from '../../../helpers/Api';
import { CATEGORIES, PRODUCTS } from '../../../constants/api';
import ProductSetModal from './ProductSetModal';
import { arrayColumn } from '../../../helpers/Utils';

class CreateTrainingClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoriesFilter: [],
      categoryOptions: [],
      search: "",
      productList: JSON.parse(JSON.stringify(ProductList)),
      selectedProducts: [],
      productSetModalOpen: false
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
      });
    };
    this.loadCategories();
  }

  loadCategories = () => {
    ApiController.call('get', CATEGORIES.all, {}, data => {
      this.setState({
        categoryOptions: data
      });
      this.searchProducts();
    })
  };

  searchProducts = () => {
    const { search, categoriesFilter } = this.state;
    const s = {
      categoryId: {
        "in": arrayColumn(this.state.categoriesFilter, 'id')
      }
    };
    
    ApiController.call('get', PRODUCTS.all, {
      page: 1,
      size: 10,
      s: JSON.stringify(s)
    }, data => {
      this.setState({
        productList: data.data
      });
    })
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

  addToSelectedProducts = (product) => {
    const { selectedProducts } = this.state;
    let exist = this.existInSelectedProducts(product);
    if (!exist) {
      selectedProducts.push(product);
    }

    this.setState({
      selectedProducts: selectedProducts
    });
  };

  removeFromSelectedProducts = (product) => {
    let { selectedProducts } = this.state;

    selectedProducts = selectedProducts.filter(selectedProduct => {
      return JSON.stringify(selectedProduct) !== JSON.stringify(product);
    });

    this.setState({
      selectedProducts: selectedProducts
    });
  };

  toggleProductSetModalOpen = () => {
    this.setState({
      productSetModalOpen: !this.state.productSetModalOpen
    });
  }

  render() {
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
                </Row>

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
                <ProductTable
                  component={this}
                  data={this.state.productList}
                  addToSelectedProducts={this.addToSelectedProducts}
                  removeFromSelectedProducts={this.removeFromSelectedProducts}
                  existInSelectedProducts={this.existInSelectedProducts}
                  filterCate={this.state.categoriesFilter}
                />
              </CardBody>
              <CardFooter className="text-right">
                <Button
                  onClick={e => {
                    this.toggleProductSetModalOpen()
                  }}
                >
                  {__(this.messages, "Lưu bộ sản phẩm")}
                </Button>
              </CardFooter>
            </Card>
          </Colxx>
        </Row>
        <ProductSetModal  
          isOpen={this.state.productSetModalOpen}
          toggleModal={this.toggleProductSetModalOpen}
          selectedProducts={this.state.selectedProducts}
        />
      </Fragment>
    );
  }
}

export default injectIntl(CreateTrainingClass);