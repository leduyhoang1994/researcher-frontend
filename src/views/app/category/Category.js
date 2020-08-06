import React, { Component, Fragment } from 'react';
import { Row, Collapse, Button, Input } from 'reactstrap';
import ReactTable from "react-table";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { SITE_LIST } from '../../../constants/data';
import DataTablePagination from '../../../components/DatatablePagination';
import './style.scss';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: props.categories,
      siteList: SITE_LIST,
      collapse: {}
    };
    this.messages = this.props.intl.messages;
  }

  catTableColumn = () => [
    {
      Header: __(this.messages, "Tên thư mục tầng 1"),
      accessor: "categoryName",
      sortable: false,
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "Tên thư mục tầng 2"),
      sortable: false,
      accessor: "categoryName",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "Tên thư mục tầng 3"),
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
    },
    {
      Header: __(this.messages, "Thao tác"),
      accessor: null,
      maxWidth: 100,
      Cell: props => (
        <div className="text-center">
          <Input
            type="checkbox"
            checked={this.props.existInSelectedCats(props.original)}
            onChange={e => {
              if (e.target.checked) {
                this.props.addToSelectedCats(props.original);
              } else {
                this.props.removeFromSelectedCats(props.original);
              }
            }}
          />
        </div>
      )
    },
  ];

  renderCats = (site, isCountryCat) => {
    const { categories: categorySets } = this.props;
    const cats = categorySets[site.code];
    return (
      <>
        <div className={`cat-header ${isCountryCat ?? "country-cat-header"}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); this.toggle(site.code) }}>
            <b>Sàn {site.name} ({categorySets[site.code].length})</b>
          </a>
        </div>
        <Collapse
          isOpen={this.state.collapse[site.code] === undefined ? true : this.state.collapse[site.code]}
        >
          <ReactTable
            getTrProps={(state, rowInfo) => {
              if (rowInfo && rowInfo.row) {
                return {
                  onClick: (e) => {
                    if (this.props.existInSelectedCats(rowInfo.original)) {
                      this.props.removeFromSelectedCats(rowInfo.original);
                    } else {
                      this.props.addToSelectedCats(rowInfo.original);
                    }
                  },
                  style: {
                    cursor: "pointer"
                  }
                }
              } else {
                return {}
              }
            }}
            data={cats}
            columns={this.catTableColumn()}
            defaultPageSize={10}
            className="mb-4"
            PaginationComponent={DataTablePagination}
          />
        </Collapse>
      </>
    );
  }

  toggle = (code) => {
    const { collapse } = this.state;
    collapse[code] = !collapse[code];
    this.setState({ collapse });
  }

  renderCategories = () => {
    const { siteList } = this.state;
    const { categories: categorySets } = this.props;
    const render = [];

    for (const countrySite of siteList) {
      if (categorySets[countrySite.code]) {
        render.push(
          <div key={countrySite.code}>
            {this.renderCats(countrySite, true)}
          </div>
        );
      }
      if (countrySite.sites) {
        for (const site of countrySite.sites) {
          if (categorySets[site.code]) {
            render.push(
              <div key={site.code}>
                {this.renderCats(site)}
              </div>
            );
          }
        }
      }
    }

    return render;
  }

  render() {
    return (
      <div>
        {
          this.renderCategories()
        }
        <Row>
          <Colxx xxs="12">

          </Colxx>
        </Row>
      </div>
    );
  }
}

export default injectIntl(Category);