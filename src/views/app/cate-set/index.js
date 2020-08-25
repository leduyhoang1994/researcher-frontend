import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import CateSeListTable from './CateSetTable';
import { CATEGORIES } from '../../../constants/api';
import ApiController from '../../../helpers/Api';

class CateSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cateSetList : []
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount()
  {
    this.loadCateSets();
  }

  loadCateSets = () => {
    ApiController.get(CATEGORIES.set, {}, data => {
      this.setState({ cateSetList: data });
    });
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
                    <CateSeListTable
                      data={this.state.cateSetList}
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

export default injectIntl(CateSet);