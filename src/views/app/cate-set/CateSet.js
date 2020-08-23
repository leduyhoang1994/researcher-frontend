import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { Redirect } from 'react-router-dom';

class ProductSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setId: this.props.match.params.id,
      cateSet: {
        cates: []
      }
    };
    this.messages = this.props.intl.messages;

    this.cateSetList = JSON.parse(localStorage.getItem('cateSets')) || [];
  }

  componentDidMount() {
    const { setId } = this.state;

    const cateSet = this.cateSetList.find((set, index) => {
      this.indexOfSet = set.setId == setId ? index : null;
      return set.setId == setId
    });

    this.setState({
      cateSet: cateSet
    });
  }

  removeFromProductSet = (cate) => {
    let { cateSet } = this.state;

    let cateSetCates = cateSet.cates;

    cateSetCates = cateSetCates.filter(selectedProduct => {
      return JSON.stringify(selectedProduct) !== JSON.stringify(cate);
    });

    cateSet.cates = cateSetCates;

    this.setState({
      cateSet: cateSet
    }, () => {
      this.cateSetList[this.indexOfSet] = cateSet;
      localStorage.setItem('cateSets', JSON.stringify(this.cateSetList));
    });
  };

  catTableColumn = () => [
    {
      Header: __(this.messages, "Tên ngành hàng tầng 1"),
      accessor: "categoryName",
      sortable: false,
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "Tên ngành hàng tầng 2"),
      sortable: false,
      accessor: "categoryName",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "Tên ngành hàng tầng 3"),
      sortable: false,
      accessor: "categoryName",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "Sàn"),
      accessor: "site",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "Tổng sale"),
      accessor: "topSale",
      Cell: props => <p className="text-muted">{props.value}</p>
    }
  ];

  redirectTo = (url) => {
    this.setState({
      redirect: url
    })
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to={`${this.state.redirect}`} />;
    }
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="Bộ ngành hàng" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>
                  {__(this.messages, 'Bộ ngành hàng')} <b>{this.state.cateSet.setName}</b>
                </CardTitle>
                <Row>
                  <Colxx xxs="12">
                    <Label className="form-group has-float-label">
                      <Input
                        type="text"
                        value={this.state.cateSet.setName}
                        onChange={e => {
                          let { cateSet: cateSet } = this.state;

                          cateSet.setName = e.target.value;

                          this.setState({
                            cateSet: cateSet
                          }, () => {
                            this.cateSetList[this.indexOfSet] = cateSet;
                            localStorage.setItem('cateSets', JSON.stringify(this.cateSetList));
                          });
                        }}
                      />
                      <span>
                        {__(this.messages, "Tên danh sách ngành hàng")}
                      </span>
                    </Label>
                  </Colxx>
                </Row>
                <Row>
                  <Colxx xxs="12">
                    <ReactTable
                      data={this.state.cateSet.cates}
                      columns={this.catTableColumn()}
                      defaultPageSize={10}
                      className="mb-4"
                      PaginationComponent={DataTablePagination}
                    />
                  </Colxx>
                </Row>
              </CardBody>
              <CardFooter className="text-right">
                <Button
                  color="primary"
                  onClick={e => {
                    localStorage.setItem('selectedItems', JSON.stringify(this.state.cateSet.cates));
                    this.redirectTo("/app/products");
                  }}
                >
                  {__(this.messages, "Tìm sản phẩm")}
                </Button>
              </CardFooter>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

export default injectIntl(ProductSet);