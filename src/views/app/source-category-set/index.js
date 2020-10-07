import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import SourceCategorySetTables from './SourceCategorySetTables';
import { CATEGORY_SETS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';

class SourceCategorySets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cateSetList : []
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    this.loadCateSets();
  }

  loadCateSets = () => {
    ApiController.get(CATEGORY_SETS.all, {}, data => {
      this.setState({ cateSetList: data });
    });
  }

  removeFromCategorySet = (original) => {
    const ids = { ids: [original.id] };
    if (window.confirm('Bạn có chắc chắn muốn xóa bộ ngành hàng này không?')) {
      ApiController.callAsync('delete', CATEGORY_SETS.all, ids)
        .then(data => {
          NotificationManager.success("Xóa bộ ngành hàng thành công", "Thành công", 1500);
          this.loadCateSets();
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
  }
  
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="Danh sách ngành hàng" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  {__(this.messages, 'Danh sách ngành hàng')}
                </CardTitle>
                <Row>
                  <Colxx xxs="12">
                    <SourceCategorySetTables
                      data={this.state.cateSetList}
                      component={this}
                      removeFromCategorySet={this.removeFromCategorySet}
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

export default injectIntl(SourceCategorySets);