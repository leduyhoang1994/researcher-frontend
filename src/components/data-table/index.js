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
      pagination: {
        per_page: this.props.defaultPageSize || 25
      },
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
    let { url, query } = this.apiResource;
    const { pagination, filtered, sorted } = this.state;
    query.page = query.page || 1;
    query = {
      ...query,
      ...pagination,
      ...userQuery
    };

    if (filtered) {
      let searches = [];
      let getDataBy = {};
      filtered.forEach(f => {
        let qf = `${f.id}:${f.value}`;
        searches.push(qf);
        getDataBy[f.id] = f.value;
      });
      query = {
        ...query,
        search: searches.join(";"),
        getDataBy: {
          ...getDataBy,
          ...query
        }
      }
    }

    if (sorted && sorted.id) {
      query = {
        ...query,
        orderBy: sorted.id,
        sortedBy: sorted.desc === false ? "asc" : "desc"
      }
    }

    this.setState({ isLoading: true });

    ApiController.call("GET", url, query, response => {
      pagination.pages = Math.floor(response.total / response.count);
      pagination.current_page = response.page;
      pagination.defaultPageSize = response.count;
      pagination.per_page = response.count;
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
          sorted={[this.state.sorted]}
          onSortedChange={(column, sortDirection, event) => {
            const sort = column[0];

            localStorage.setItem('manager.students.sorted', JSON.stringify(sort));
            this.setState({ sorted: sort }, () => {
              this.loadData();
            });
          }}
          defaultFilterMethod={(filter, row) => {
            return true;
          }}
          filtered={this.state.filtered}
          onFilteredChange={filtered => {
            localStorage.setItem('manager.students.filtered', JSON.stringify(filtered));
            this.setState({ filtered: filtered }, () => {
              clearTimeout(this.filterTimer);
              this.filterTimer = setTimeout(() => {
                this.loadData();
              }, 1000);
            });
          }}
          loadData={this.loadData}
          onPageSizeChange={size => {
            this.loadData({
              per_page: size
            });
            this.setState({
              pagination: {
                ...this.state.pagination,
                per_page: size
              }
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
