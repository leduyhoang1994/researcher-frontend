import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { Redirect } from 'react-router-dom';
import ApiController from '../../../helpers/Api';
import { SETS, SOURCE_CATEGORIES } from '../../../constants/api';

class SourceCategorySets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setId: this.props.match.params.id,
      sourceCategorySet: {
        setName: "",
        sourceCategorySets: []
      }
    };
    this.messages = this.props.intl.messages;
  }

  componentDidMount() {
    this.loadCurrentSourceCategorySet();
  }

  loadCurrentSourceCategorySet = () => {
    const { setId } = this.state;
    this.getSourceCategorySet(setId);
  }

  getSourceCategorySet = (id) => {
    ApiController.get(`${SETS.categories}/${id}`, {}, data => {
      this.setState({
        sourceCategorySet: data
      });
    })
  }

  removeFromProductSet = (cate) => {
    ApiController.delete(`${SETS.category_delete}`, {
      ids: [cate?.categoryId]}, data => {
      this.loadCurrentSourceCategorySet();
    }, {});
  };

  catTableColumn = () => [
    {
      Header: __(this.messages, "Tên ngành hàng tầng 1"),
      accessor: "categoryNameViLevel1",
      sortable: false,
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "Tên ngành hàng tầng 2"),
      sortable: false,
      accessor: "categoryNameViLevel2",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "Tên ngành hàng tầng 3"),
      sortable: false,
      accessor: "categoryNameViLevel3",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "Sàn"),
      accessor: "site",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "#"),
      accessor: null,
      width: 150,
      Cell: props => {
        return (
          <div>
            <Button
              color="danger"
              size="xs"
              onClick={() => {
                this.removeFromProductSet(props.original)
              }}
            >
              X
            </Button>
          </div>
        )
      }
    },
    // {
    //   Header: __(this.messages, "Tổng sale"),
    //   accessor: "monthlySale",
    //   Cell: props => <p className="text-muted">{props.value}</p>
    // }
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

    const { sourceCategorySet } = this.state;
    let source = [];
    
    sourceCategorySet.sourceCategorySets.forEach(item => {
      let category = {};
      category = item.sourceCategory;
      category.categoryId = item.id;
      source.push(category)
    })

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
                  {__(this.messages, 'Bộ ngành hàng')} <b>{sourceCategorySet.setName}</b>
                </CardTitle>
                <Row>
                  <Colxx xxs="12">
                    <Label className="form-group has-float-label">
                      <Input
                        type="text"
                        value={sourceCategorySet.setName}
                        onChange={e => {
                          sourceCategorySet.setName = e.target.value;
                          this.setState({
                            sourceCategorySet: sourceCategorySet
                          }, () => {
                            this.cateSetList[this.indexOfSet] = sourceCategorySet;
                            localStorage.setItem('sourceCategorySets', JSON.stringify(this.cateSetList));
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
                      data={source}
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
                    localStorage.setItem('selectedItems', JSON.stringify(this.state.sourceCategorySet.sourceCategorySets));
                    this.redirectTo("/app/source-products");
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

export default injectIntl(SourceCategorySets);