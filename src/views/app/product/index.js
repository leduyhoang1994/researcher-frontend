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

class CreateTrainingClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoriesFilter: [],
      categoryOptions: [],
      search: "",
      productList: JSON.parse(JSON.stringify(ProductList))
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    if (localStorage.getItem('selectedItems')) {
      const categoriesFilter = JSON.parse(localStorage.getItem('selectedItems'));
      this.setState({
        categoriesFilter: categoriesFilter
      }, () => {
        // localStorage.removeItem('selectedItems');
      });
    };
    let categoryOptionsKey = {};
    let categoryOptions = [];
    // let listCate = [];
    categoriesData.forEach(cate => {
      if (!categoryOptionsKey[cate.site]) {
        categoryOptionsKey[cate.site] = [];
      }
      categoryOptionsKey[cate.site].push(cate);
      // listCate.push(cate.categoryName);
    });
    // console.log(JSON.stringify(listCate));
    Object.keys(categoryOptionsKey).map(key => {
      categoryOptions.push({
        label: key,
        options: categoryOptionsKey[key]
      });
    });
    this.setState({
      categoryOptions: categoryOptions
    }, () => {
      this.searchProducts();
    });
  }

  searchProducts = () => {
    const { search, categoriesFilter } = this.state;
    let result = ProductList.filter(p => {
      if (search) {
        if (p.productName.toLowerCase().includes(search.toLowerCase())) {
          return true;
        }
      }
      if (categoriesFilter.length > 0) {
        let found = false;
        categoriesFilter.forEach(cate => {
          if (cate.categoryName === p.categoryName) {
            found = true;
            return false;
          }
        });
        if (found) {
          return true;
        }
      }
      
      if (categoriesFilter.length === 0 && !search) { 
        return true;
      }
      return false;
    });
    console.log(result);
    this.setState({
      productList: result
    });
  };

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
                        getOptionValue={option => option.categoryName}
                        getOptionLabel={option => option.categoryName}
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
                />
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

export default injectIntl(CreateTrainingClass);