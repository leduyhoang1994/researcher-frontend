import React, { Component } from 'react';
import { Row, Collapse, Input } from 'reactstrap';
import ReactTable from "react-table";
import { Colxx } from "../../../components/common/CustomBootstrap";
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

  handleCheckAll = (e) => {
    this.props.setSelectAll(e.target.id, e.target.checked)
  }

  catTableColumn = (siteCode) => [
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
      Header: __(this.messages, "Tổng sale"),
      accessor: "monthlySale",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: (e) => {
        return (
          <div className="text-center">
            <input id={siteCode} type="checkbox" onChange={this.handleCheckAll} checked={this.props.isSiteCodeCheckAll[siteCode] ? true : false} />
          </div>
        );
      },
      accessor: null,
      sortable: false,
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
            columns={this.catTableColumn(site.code)}
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
            {this.renderCats(countrySite, true, '')}
          </div>
        );
      }
      if (countrySite.sites) {
        for (const site of countrySite.sites) {
          if (categorySets[site.code]) {
            render.push(
              <div key={site.code}>
                {this.renderCats(site, null, '')}
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