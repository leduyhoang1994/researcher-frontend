import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { ReactTableAdvancedCard } from "../../../containers/ui/ReactTableCards";
import { CATEGORIES } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { Link } from 'react-router-dom';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      redirect: false,
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    this.getCategories();
  }

  getCategories = () => {
    ApiController.get(CATEGORIES.allEdit, {}, data => {
      console.log("AAAAA" + data);
      this.setState({ categories: data });
    });
  }

  redirectTo = (url) => {
    this.setState({
      redirect: url
    })
  };

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
                <ReactTableAdvancedCard categories={this.state.categories} />
                <div className="text-right card-title">
                  <Link to="/app/list-cate/add">
                    <Button
                      className="mr-2"
                      color="warning"
                      onClick={e => {
                        // localStorage.setItem('selectedItems', JSON.stringify(this.state.cateSet.categorySets));

                      }}
                    >
                      {__(this.messages, "Thêm ngành hàng")}
                    </Button>
                  </Link>
                  <Button
                    className="mr-2"
                    color="primary"
                    onClick={e => {
                      // this.redirectTo("/app/products");
                    }}
                  >
                    {__(this.messages, "Tìm sản phẩm")}
                  </Button>
                </div>
              </Card>
            </Colxx>
          </Row>

        </Fragment>
      </div>
    );
  }
}

export default injectIntl(Category);