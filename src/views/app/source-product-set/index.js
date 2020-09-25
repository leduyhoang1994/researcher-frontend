import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import SourceProductSetTables from './SourceProductSetTables';
import { PRODUCT_SETS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';

class SourceProductSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceProductSetList : []
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