import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import SourceProductTable from './SourceProductTables';
import { PRODUCT_SETS, UBOX_PRODUCTS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';
import { failed, success, notify_update_success } from "../../../constants/constantTexts";

class SourceProductSets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setId: this.props.match.params.id,
      filter: {
        categoriesFilter: [],
      },
      productSet: {
        setName: "",
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
    this.getProductSet(setId);
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
      let products = [];
      data.sourceProductSets.forEach(item => {
        item.sourceProduct.setId = item.id;
        products.push(item.sourceProduct)
      })

      this.setState({
        productSet: {
          setName: data.setName,
          products: products
        },
        keyState: Math.random()
      });
    })
  }

  removeFromProductSet = (product) => {
    const ids = [product.setId];
    ApiController.delete(`${PRODUCT_SETS.delete}`, {
      ids: ids
    }, () => {
      this.loadCurrentProductSet();
    });
  };

  publishUboxProduct = (status) => {
    const { productSet } = this.state;
    let isPublish = false, ids = [];
    productSet.products.forEach(item => {
      if (item.uboxProduct === null) {
        isPublish = true;
      } else {
        ids.push(item.uboxProduct.id);
      }
    })
    if (status) {
      if (!isPublish) {
        ApiController.callAsync('put', UBOX_PRODUCTS.publish, {
          ids: ids,
          status: status
        })
          .then(data => {
            if (data.data.statusCode === 200) {
              NotificationManager.success(notify_update_success, success, 2000);
            }
          }).catch(error => {
            NotificationManager.warning(error.response.data.message, failed, 2000);
          });
      } else {
        NotificationManager.warning("Còn sản phẩm chưa được biên tập. Yêu cầu biên tập trước", failed, 2000);
      }
    } else {
      ApiController.callAsync('put', UBOX_PRODUCTS.publish, {
        ids: ids,
        status: status
      })
        .then(data => {
          if (data.data.statusCode === 200) {
            NotificationManager.success(notify_update_success, success, 2000);
          }
        }).catch(error => {
          NotificationManager.warning(error.response.data.message, failed, 2000);
        });
    }
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
                  {__(this.messages, 'Bộ sản phẩm')}
                </CardTitle>
                <Row>
                  <Colxx xxs="11">
                    <Label className="form-group has-float-label">
                      <Input
                        type="text"
                        disabled={true}
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
                      data={this.state.productSet.products}
                      component={this}
                      // onPageChange={this.onPageChange}
                      // onPageSizeChange={this.onPageSizeChange}
                      removeFromSelectedProducts={this.removeFromProductSet}
                    />
                  </Colxx>
                </Row>
                <div className="text-right ">
                  <Button
                    color="success"
                    className="mr-2"
                    onClick={() => {
                      this.publishUboxProduct(true);
                    }}
                  >
                    {__(this.messages, "Xuất bản tất cả")}
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      this.publishUboxProduct(false);
                    }}
                  >
                    {__(this.messages, "Ngừng xuất bản tất cả")}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

export default injectIntl(SourceProductSets);