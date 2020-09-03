import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { ReactTableAdvancedCard } from "../../../containers/ui/ReactTableCards";
import { CATEGORIES } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { Link } from 'react-router-dom';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    };
    this.messages = this.props.intl.messages;
  }

  render() {
    return (
      <div>
        <Fragment>
          <Row>
            <Colxx xxs="12">
              
            </Colxx>
          </Row>

        </Fragment>
      </div>
    );
  }
}

export default injectIntl(Product);