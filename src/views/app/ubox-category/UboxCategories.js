import React, { Component, Fragment } from 'react';
import { Row, Card, Button } from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
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
              <Card>
                <ReactTableAdvancedCard
                  categories={this.state.categories}
                  handleClickRow={this.handleClickRow}
                />

                <div className="text-right card-title">
                  <Link to="/app/ubox-categories/add">
                    <Button
                      className="mr-2"
                      color="warning"
                    >
                      {__(this.messages, "Thêm ngành hàng")}
                    </Button>
                  </Link>
                </div>
              </Card>
            </Colxx>
          </Row>

        </Fragment>
      </div>
    );
  }
}

export default injectIntl(UboxCategories);