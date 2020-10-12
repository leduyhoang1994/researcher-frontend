import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import SourceProductSetTables from './SourceProductSetTables';
import { PRODUCT_SETS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';

class SourceProductSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceProductSetList: []
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    this.loadProductSets();
  }

  loadProductSets = () => {
    ApiController.get(PRODUCT_SETS.all, {}, data => {
      this.setState({ sourceProductSetList: data });
    });
  }

  removeFromProductSet = (original) => {
    const ids = { ids: [original.id] };
    ApiController.callAsync('delete', PRODUCT_SETS.all, ids)
      .then(data => {
        NotificationManager.success("Xóa bộ sản phẩm thành công", "Thành công", 1500);
        this.loadProductSets();
      }).catch(error => {
        NotificationManager.warning(error.response.data.message, "Thất bại", 1000);
        if (error.response.status === 401) {
          setTimeout(function () {
            NotificationManager.info("Yêu cầu đăng nhập tài khoản researcher!", "Thông báo", 2000);
            setTimeout(function () {
              window.open("/user/login", "_self")
            }, 1500);
          }, 1500);
        }
      });
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
                    <SourceProductSetTables
                      data={this.state.sourceProductSetList}
                      component={this}
                      removeFromProductSet={this.removeFromProductSet}
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

export default injectIntl(SourceProductSet);