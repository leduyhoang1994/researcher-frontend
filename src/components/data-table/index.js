import React, { Component } from "react";
import ReactTable from "react-table";
import ResourceTablePagination from "./ResourceTablePagination";
import { injectIntl } from "react-intl";
import ApiController from "../../helpers/Api";

class ResourceTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      isLoading: true,
      filtered: [],
      sorted: [],
    };
    this.filterTimer = null;
    this.apiResource = props.apiResource || {};
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = (userQuery) => {
    let { url, query } = this.props.apiResource;
    const { pagination, filtered, sorted } = this.state;
    let newQuery = {};
    newQuery.page = query.page || 1;
    newQuery = {
      ...query,
      ...pagination,
      ...userQuery,
    };

    if (sorted && sorted.id) {
      const orderBy = sorted.id;
      const orderDirection = sorted.desc === false ? "ASC" : "DESC";
      newQuery.sort = `${orderBy},${orderDirection}`;
    }

    newQuery.s = {};
    if (filtered) {
      filtered.forEach(filter => {
        if (filter.value) {
          newQuery.s[filter.id] = {
            "$cont": `%${filter.value}%`
          };
        }
      });
    }

    newQuery.s = {
      ...newQuery.s || {},
      ...query.s
    };

    if (newQuery.s) {
      newQuery.s = JSON.stringify(newQuery.s);
    } else {
      delete newQuery.s;
    }

    this.setState({ isLoading: true });

    ApiController.call("GET", url, newQuery, response => {
      pagination.pages = Math.floor(response.total / response.count);
      pagination.current_page = response.page;
      pagination.defaultPageSize = response.count;
      this.setState({
        data: response.data,
        pagination: pagination,
        isLoading: false
      });
    });
  }

  render() {
    const {
      columns
    } = this.props;
    const {
      data,
      pagination
    } = this.state;

    return (
      <>
        <ReactTable
          loading={this.state.isLoading}
          data={data}
          columns={columns}
          filterable={true}
          showPageJump={true}
          PaginationComponent={ResourceTablePagination}
          showPageSizeOptions={true}
          onSortedChange={(column, sortDirection, event) => {
            const sort = column[0];
            this.setState({ sorted: sort }, () => {
              this.loadData();
            });
          }}
          defaultFilterMethod={(filter, row) => {
            return true;
          }}
          // filtered={this.state.filtered}
          onFilteredChange={filtered => {
            clearTimeout(this.filterTimer);
            this.filterTimer = setTimeout(() => {
              this.setState({ filtered: filtered }, () => {
                this.loadData();
              });
            }, 1000);
            return filtered;
          }}
          loadData={this.loadData}
          onPageSizeChange={size => {
            this.setState({
              pagination: {
                ...this.state.pagination,
                per_page: size
              }
            }, () => {
              this.loadData();
            });
          }}
          onPageChange={page => {
            this.loadData({
              page: page
            });
          }}
          {...pagination}
          page={0}
          {...this.props}
          defaultPageSize={this.state.pagination.per_page || this.props.defaultPageSize}
        />
      </>
    );
  }
};

export default injectIntl(ResourceTable);
