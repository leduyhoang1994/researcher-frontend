import React, { Component, Fragment } from 'react';
import { Row, Card, Button, CardBody, CardTitle } from 'reactstrap';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import IntlMessages, { __ } from '../../../helpers/IntlMessages';
import { ReactTableAdvancedCard } from "../../../containers/ui/ReactTableCards";
import { UBOX_CATEGORIES } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { Link } from 'react-router-dom';

class UboxCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    this.getCategories();
  }

  getCategories = () => {
    ApiController.get(UBOX_CATEGORIES.all, {}, data => {
      this.setState({ categories: data });
    });
  }

  handleClickRow = (row) => {
    window.open(`/app/ubox-categories/edit/${row.id}`, "_self")
  }

  render() {
    return (
      <div>
        <Fragment>
          {/* {
          this.renderCategories()
        } */}
          <Row>
            <Colxx xxs="12">
              <Breadcrumb heading="Ngành hàng" match={this.props.match} />
              <Separator className="mb-5" />
            </Colxx>
          </Row>
          <Row>
            <Colxx xxs="12">
              <Card>
                <CardBody>
                  <CardTitle>
                    <IntlMessages id="table.react-advanced" />
                  </CardTitle>
                  <ReactTableAdvancedCard
                    categories={this.state.categories}
                    handleClickRow={this.handleClickRow}
                  />

                  <div className="text-right">
                    <Link to="/app/ubox-categories/add">
                      <Button
                        className=""
                        color="warning"
                      >
                        {__(this.messages, "Thêm ngành hàng")}
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Colxx>
          </Row>

        </Fragment>
      </div>
    );
  }
}

export default injectIntl(UboxCategories);