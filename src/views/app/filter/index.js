import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';

class CreateTrainingClass extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.messages = this.props.intl.messages;
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.create-training-class" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  {__(this.messages, 'Thông tin buổi tập')}
                </CardTitle>
                <Row>
                  <Colxx xxs="12">
                    
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

export default injectIntl(CreateTrainingClass);