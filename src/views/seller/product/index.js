import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { Colxx, Separator } from "../../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../../helpers/IntlMessages';
import ProductList from './ProductList';
import { PRODUCTS } from '../../../../constants/api';
import ApiController from '../../../../helpers/Api';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
        products : []
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts = () => {
    let array = [];
    ApiController.get(PRODUCTS.allEdit, {}, data => {
        this.setState({
            products: data
        }, () => {
            this.state.products.forEach(item => {
                if (!item.featureImage) item.featureImage = '/assets/img/default-image.png';
                array.push(item);
            });
            this.setState({
                products: array
            })
        })
    })
}
  
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
                  {__(this.messages, 'Danh sách bộ sản phẩm')}
                </CardTitle>
                <Row>
                  <Colxx xxs="12">
                    <ProductList
                      products={this.state.products}
                      component={this}
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

export default injectIntl(Product);