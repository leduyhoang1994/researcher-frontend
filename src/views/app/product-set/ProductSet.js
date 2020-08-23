import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ProductTable from '../product/ProductTable';

class ProductSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setId: this.props.match.params.id,
      productSet: {
        products: []
      }
    };
    this.messages = this.props.intl.messages;

    this.productSetList = JSON.parse(localStorage.getItem('productSets')) || [];
  }

  componentDidMount() {
    const { setId } = this.state;

    const productSet = this.productSetList.find((set, index) => {
      this.indexOfSet = set.setId == setId ? index : null;
      return set.setId == setId
    });

    this.setState({
      productSet: productSet
    });
  }

  removeFromProductSet = (product) => {
    let { productSet } = this.state;

    let productSetProducts = productSet.products;

    productSetProducts = productSetProducts.filter(selectedProduct => {
      return JSON.stringify(selectedProduct) !== JSON.stringify(product);
    });

    productSet.products = productSetProducts;

    this.setState({
      productSet: productSet
    }, () => {
      this.productSetList[this.indexOfSet] = productSet;
      localStorage.setItem('productSets', JSON.stringify(this.productSetList));
    });
  };

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="Bộ sản phẩm" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  {__(this.messages, 'Bộ sản phẩm')} <b>{this.state.productSet.setName}</b>
                </CardTitle>
                <Row>
                  <Colxx xxs="12">
                    <Label className="form-group has-float-label">
                      <Input
                        type="text"
                        value={this.state.productSet.setName}
                        onChange={e => {
                          let { productSet } = this.state;

                          productSet.setName = e.target.value;

                          this.setState({
                            productSet: productSet
                          }, () => {
                            this.productSetList[this.indexOfSet] = productSet;
                            localStorage.setItem('productSets', JSON.stringify(this.productSetList));
                          });
                        }}
                      />
                      <span>
                        {__(this.messages, "Tên bộ sản phẩm")}
                      </span>
                    </Label>
                  </Colxx>
                </Row>
                <Row>
                  <Colxx xxs="12">
                    <ProductTable
                      component={this}
                      data={this.state.productSet.products}
                      selectable={false}
                      removeFromSelectedProducts={this.removeFromProductSet}
                    />
                  </Colxx>
                </Row>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

export default injectIntl(ProductSet);