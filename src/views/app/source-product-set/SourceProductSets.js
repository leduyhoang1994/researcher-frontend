import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import SourceProductTable from '../source-product/SourceProductTable';
import { SOURCE_PRODUCTS, PRODUCT_SETS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';

class SourceProductSets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setId: this.props.match.params.id,
      productSet: {
        products: [],
        keyState: "key"
      }
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    this.loadCurrentProductSet();
  }

  loadCurrentProductSet = () => {
    const { setId } = this.state;
    // this.getProductSet(setId);
  }

  exportData = async () => {
    const data = await ApiController.callAsync('get', `${PRODUCT_SETS.all}/${this.state.setId}/export`, {});
    const base64 = data.data.result.base64

    let anchor = document.createElement('a');
    anchor.setAttribute('id', 'id_export');
    anchor.href = base64;
    anchor.download = 'Sản phẩm nguồn.xlsx';
    anchor.click();
  }

  getProductSet = (id) => {
    ApiController.get(`${PRODUCT_SETS.all}/${id}`, {}, data => {
      data.productSets = data.productSets.map(d => {
        return {
          ...d.product,
          id: d.id
        };
      })
      this.setState({
        productSet: data,
        keyState: Math.random()
      });
    })
  }

  removeFromProductSet = (product) => {
    const setItem = product.productSets.find(s => {
      return s.setId == this.state.setId
    })
    ApiController.delete(`${SOURCE_PRODUCTS.removeFromSet}`, {
      ids: [setItem?.id]
    }, data => {
      this.loadCurrentProductSet();
    }, {

    });
  };

  render() {
    const { setId } = this.state;
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
                  <Colxx xxs="11">
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
                            // this.productSetList[this.indexOfSet] = productSet;
                            // localStorage.setItem('productSets', JSON.stringify(this.productSetList));
                          });
                        }}
                      />
                      <span>
                        {__(this.messages, "Tên bộ sản phẩm")}
                      </span>
                    </Label>
                  </Colxx>
                  <Colxx xxs="1">
                    <div className="text-right card-title">
                      <Button
                        className="mr-2"
                        color="primary"
                        onClick={() => {
                          this.exportData();
                        }}
                      >
                        {__(this.messages, "Export")}
                      </Button>
                    </div>
                  </Colxx>
                </Row>
                <Row>
                  <Colxx xxs="12">
                    <SourceProductTable
                      key={this.state.keyState}
                      component={this}
                      selectable={false}
                      removeFromSelectedProducts={this.removeFromProductSet}
                      filter={{
                        join: 'sourceProductSets||id,setId,sourceProductId',
                        s: {
                          'sourceProductSets.setId': {
                            "$eq": this.state.setId
                          }
                        }
                      }}
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

export default injectIntl(SourceProductSets);