import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { Input, Button } from 'reactstrap';
import { isFunction } from 'formik';
import Select from 'react-select';
import "./style.scss";
import { SOURCE_PRODUCTS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { Link } from 'react-router-dom';

class SourceProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {
        page: 0,
        pages: 0,
        size: this.props.defaultPageSize || 25,
      },
      isLoading: true,
      sorted: [],
    };
    this.messages = this.props.component.props.intl.messages;
  }

  columns = (allProductSelected, handleCheckAll,
    existInSelectedProducts, addToSelectedProducts,
    removeFromSelectedProducts, selectable, filterCate) => [
      {
        Header: __(this.messages, "Hành động"),
        accessor: 'id',
        sortable: false,
        width: this.state.selectable ? undefined : 150,
        filterable: false,
        Cell: props => (
          <div className="text-left">
            {
              selectable &&
              <Input
                type="checkbox"
                checked={existInSelectedProducts(props.original)}
                onChange={e => {
                  if (e.target.checked) {
                    addToSelectedProducts(props.original);
                  } else {
                    removeFromSelectedProducts(props.original);
                  }
                }}
              />
            }
            {
              !selectable &&
              <>
                <Button
                  className="mr-2"
                  size="xs"
                  onClick={() => {
                    if (isFunction(removeFromSelectedProducts)) {
                      removeFromSelectedProducts(props.original);
                    }
                  }}
                >
                  {__(this.messages, "Xóa")}
                </Button>
                <Button
                  size="xs"
                  color="success"
                  href={`/app/ubox-products/edit?product-id=${props.value}`}
                >
                  {__(this.messages, "Biên tập")}
                </Button>
              </>
            }
          </div>
        )
      },
      {
        Header: __(this.messages, "Ảnh"),
        sortable: false,
        filterable: false,
        width: 100,
        accessor: "productImage",
        Cell: props => <img width="50" src={props.value} alt="" />
      },
      {
        Header: __(this.messages, "Tên ngành hàng tầng 3"),
        width: 150,
        accessor: "productCategoryVi",
        Cell: props => <p className="text-muted">{props.value}</p>,
        Filter: ({ filter, onChange }) => {
          return (
            <Select
              isClearable
              className="react-select"
              classNamePrefix="react-select"
              options={filterCate}
              onChange={event => onChange(event ? event.categoryNameViLevel3 : undefined)}
              getOptionValue={option => option.categoryNameViLevel3}
              getOptionLabel={option => option.categoryNameViLevel3}
            />
          );
        }
      },
      {
        Header: __(this.messages, "Tên sản phẩm"),
        width: 500,
        accessor: "productTitleVi",
        Cell: props => <div className="text-left">
          <a target="_blank" href={props.original.productLink}>{props.value}</a>
        </div>
      },
      {
        Header: __(this.messages, "Nguồn sản phẩm"),
        width: 100,
        accessor: "site",
        Cell: props => <p className="text-muted">{props.value}</p>
      },
      {
        Header: __(this.messages, "Doanh số bán ra"),
        accessor: "monthlySale",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
      },
      {
        Header: __(this.messages, "Giá sản phẩm"),
        accessor: "priceStr",
        Cell: props => <p className="text-muted">{props.value}</p>
      },
      {
        Header: __(this.messages, "Phí phát hành nội địa"),
        accessor: "productPrice",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
      },
      {
        Header: __(this.messages, "Số lượng bán tối tiểu"),
        accessor: "minSale",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
      },
      {
        Header: __(this.messages, "Địa điểm phát hàng"),
        accessor: "productLocation",
        Cell: props => <p className="text-muted">{props.value}</p>
      },
      {
        Header: __(this.messages, "Số lượng bán ra"),
        accessor: "topSale",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
      },
      {
        Header: __(this.messages, "Tên shop bán"),
        sortable: false,
        accessor: "productShop",
        Cell: props => <p className="text-muted">{props.value}</p>
      },
      {
        Header: __(this.messages, "Uy tín shop bán"),
        sortable: false,
        accessor: "productShopRating",
        Cell: props => <p className="text-muted">{props.value}</p>
      },
      {
        Header: __(this.messages, "Tỉ lệ khách quay lại"),
        sortable: false,
        accessor: "rebuildRate",
        Cell: props => <p className="text-muted">{props.value}</p>
      },
      {
        Header: __(this.messages, "Ghi chú"),
        sortable: false,
        accessor: "productShopRating",
        Cell: props => <p className="text-muted">{props.value}</p>
      },
    ];

  componentDidMount() {
    this.prepareQuery();
  }

  prepareQuery = () => {
    const { filter } = this.props;
    const { sourceProductName, siteFilter, minMonthlySale, maxMonthlySale, minPriceMax, maxPriceMax, type } = filter;
    let site = [];
    siteFilter.forEach(item => {
      site.push(item.value);
    })
    const arrFilter = { sourceProductName, site, minMonthlySale, maxMonthlySale, minPriceMax, maxPriceMax, type };
    let data = {};
    for (let key in arrFilter) {
      const value = arrFilter[key] || null;
      if (value != null && value.length > 0) {
        data[key] = value;
      }
    }
    const apiResource = {
      url: SOURCE_PRODUCTS.all,
      query: {
        ...data,
        s: filter?.s || null
      }
    }
    this.loadData(apiResource);
  }

  loadData = (apiResource) => {
    let { url, query } = apiResource;
    const { pagination, sorted } = this.state;
    let newQuery = {};
    newQuery.page = query.page || 0;
    newQuery = {
      ...query,
      page: pagination.page,
      size: pagination.size
    };

    if (sorted && sorted.id) {
      const orderBy = sorted.id;
      const orderDirection = sorted.desc === false ? "ASC" : "DESC";
      newQuery.sort = `${orderBy},${orderDirection}`;
    }

    this.setState({ isLoading: true });

    ApiController.call("GET", url, newQuery, response => {
      pagination.pages = Number(response.pageCount);
      pagination.current_page = Number(response.page);
      pagination.page = Number(response.page);
      pagination.defaultPageSize = Number(response.count);
      this.setState({
        data: response.data,
        pagination: pagination,
        isLoading: false
      });
    });
  }

  onPageChange = (page) => {
    let { pagination } = this.state;
    pagination.page = page;
    if (page > 1) {
      pagination.canPrevious = true;
    } else {
      pagination.canPrevious = false;
    }
    if (page < pagination.pages - 1) {
      pagination.canNext = true;
    } else {
      pagination.canNext = false;
    }
    this.setState({
      pagination: pagination
    })
    this.prepareQuery();
  }

  onPageSizeChange = (size) => {
    const { pagination } = this.state;
    pagination.size = size;
    this.setState({
      pagination: pagination
    })
    this.prepareQuery();
  }

  render() {
    const { existInSelectedProducts, addToSelectedProducts, removeFromSelectedProducts, selectable } = this.props;
    const { data, pagination } = this.state;

    return (
      <div>
        <ReactTable
          data={data}
          columns={this.columns(this.props)}
          defaultPageSize={25}
          filterable={false}
          showPageJump={true}
          current_page={pagination.page}
          page={pagination.page}
          pages={pagination.pages}
          size={pagination.size}
          canPrevious={false}
          canNext={true}
          showPageSizeOptions={true}
          onPageChange={this.onPageChange}
          onPageSizeChange={this.onPageSizeChange}
          PaginationComponent={DataTablePagination}
          manual
          getTrProps={(state, rowInfo) => {
            if (rowInfo && rowInfo.row && selectable) {
              return {
                onClick: (e) => {
                  if (existInSelectedProducts(rowInfo.original)) {
                    removeFromSelectedProducts(rowInfo.original);
                  } else {
                    addToSelectedProducts(rowInfo.original);
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
          style={{
            height: "550px"
          }}
        />
      </div>
    );
  }
};

export default injectIntl(SourceProductTable);