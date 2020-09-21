import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Label, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import Select, { createFilter } from 'react-select';
import ProductTable from './ProductTable';
import ProductList from '../../../data/products';
import ApiController from '../../../helpers/Api';
import { CATEGORIES } from '../../../constants/api';
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
      productSetModalOpen: false,
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
    ApiController.call('get', CATEGORIES.all, {}, data => {
      this.setState({
        categoryOptions: data
      });
      this.searchProducts();
    })
  };

  searchProducts = () => {
    const { filter, categoriesFilter } = this.state;
    const s = categoriesFilter.length > 0 ? {
      categoryId: {
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

  allProductSelected = (datas) => {
    console.log(datas)
    if (Array.isArray(datas)) {
      for (const data of datas)
        if (this.existInSelectedProducts(data) === false) return false
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

  toggleProductSetModalOpen = () => {
    this.setState({
      productSetModalOpen: !this.state.productSetModalOpen
    });
  }

  handleCheckall = (checked, datas) => {
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
                <ProductTable
                  key={JSON.stringify(filter)}
                  component={this}
                  data={this.state.productList}
                  addToSelectedProducts={this.addToSelectedProducts}
                  removeFromSelectedProducts={this.removeFromSelectedProducts}
                  existInSelectedProducts={this.existInSelectedProducts}
                  filterCate={this.state.categoriesFilter}
                  filter={filter}
                  handleCheckall={this.handleCheckall}
                  allProductSelected={this.allProductSelected}
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