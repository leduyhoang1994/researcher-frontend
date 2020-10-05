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
import { numberWithCommas } from '../../../helpers/Utils';
import withFixedColumns from "react-table-hoc-fixed-columns";

import "react-table/react-table.css";
import 'react-table-hoc-fixed-columns/lib/styles.css'

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class SourceProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    this.messages = this.props.component.props.intl.messages;
  }

  columns = (selectable = true, filterCate) => [
    {
      Header: (e) => {
        return (
          <input type="checkbox" onChange={(event) => {
            if (isFunction(this.props.handleCheckAll))
              this.props.handleCheckAll(event.target.checked, e?.data)
          }} checked={isFunction(this.props.allProductSelected) ? this.props.allProductSelected(e?.data.map(item => item._original)) : false} />
        )
      },
      accessor: 'id',
      sortable: false,
      fixed: "left",
      width: this.state.selectable ? undefined : 50,
      filterable: false,
      Cell: props => (
        <div className="text-left">
          {
            selectable &&
            <input
              type="checkbox"
              checked={this.props.existInSelectedProducts(props.original)}
              onChange={e => {
                if (e.target.checked) {
                  this.props.addToSelectedProducts(props.original);
                } else {
                  this.props.removeFromSelectedProducts(props.original);
                }
              }}
            />
          }
          {/* {
              selectable &&
              <>
                <Button
                  className="mr-2"
                  size="xs"
                  onClick={() => {
                    if (isFunction(removeFromSelectedProducts)) {
                      this.props.removeFromSelectedProducts(props.original);
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
            } */}
        </div>
      )
    },
    {
      Header: __(this.messages, "Hình ảnh"),
      sortable: false,
      filterable: false,
      width: 80,
      fixed: "left",
      accessor: "productImage",
      Cell: props => <img width="50" src={props.value} alt="" />
    },
    {
      Header: __(this.messages, "Tên sản phẩm"),
      width: 400,
      fixed: "left",
      accessor: "productTitleVi",
      Cell: props => <div className="text-left">
        <a target="_blank" href={props.original.productLink}>{props.value}</a>
      </div>
    },
    {
      Header: __(this.messages, "Tên ngành hàng tầng 3"),
      width: 150,
      accessor: "productCategoryVi",
      Cell: props => <p className="text-muted">{props.value}</p>,
      // Filter: ({ filter, onChange }) => {
      //   return (
      //     <Select
      //       isClearable
      //       className="react-select"
      //       classNamePrefix="react-select"
      //       options={filterCate}
      //       onChange={event => onChange(event ? event.categoryNameViLevel3 : undefined)}
      //       getOptionValue={option => option.categoryNameViLevel3}
      //       getOptionLabel={option => option.categoryNameViLevel3}
      //     />
      //   );
      // }
    },
    {
      Header: __(this.messages, "| Nguồn sản phẩm"),
      width: 100,
      accessor: "site",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "| Doanh số bán ra"),
      accessor: "monthlySale",
      Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value)).toLocaleString()}</p>
    },
    {
      Header: __(this.messages, "| Giá min"),
      accessor: "minPrice",
      Cell: props => <p className="text-muted">
        {numberWithCommas(Number.parseFloat(props.value)).toLocaleString()} {props.original.site === "Shopee" ? "₫" : "¥"}
      </p>
    },
    {
      Header: __(this.messages, "| Giá max"),
      accessor: "maxPrice",
      Cell: props => <p className="text-muted">
        {numberWithCommas(Number.parseFloat(props.value)).toLocaleString()} {props.original.site === "Shopee" ? "₫" : "¥"}
      </p>
    },
    {
      Header: __(this.messages, "| Phí phát hành nội địa"),
      accessor: "productPrice",
      Cell: props => <p className="text-muted">
        {numberWithCommas(Number.parseFloat(props.value)).toLocaleString()} {props.original.site === "Shopee" ? "₫" : "¥"}
      </p>
    },
    {
      Header: __(this.messages, "| Số lượng bán tối tiểu"),
      accessor: "minSale",
      Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value)).toLocaleString()}</p>
    },
    {
      Header: __(this.messages, "| Địa điểm phát hàng"),
      accessor: "productLocation",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "| Số lượng bán ra"),
      accessor: "topSale",
      Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value)).toLocaleString()}</p>
    },
    {
      Header: __(this.messages, "| Tên shop bán"),
      sortable: false,
      accessor: "productShop",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "| Uy tín shop bán"),
      sortable: false,
      accessor: "productShopRating",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "| Tỉ lệ khách quay lại"),
      sortable: false,
      accessor: "rebuildRate",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(this.messages, "| Ghi chú"),
      sortable: false,
      accessor: "productShopRating",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
  ];

  getColumnWidth = (rows, accessor, headerText) => {
    const maxWidth = 400
    const magicSpacing = 10
    const cellLength = Math.max(
      ...rows.map(row => (row[accessor] || '').length),
      headerText.length,
    );
    return Math.min(maxWidth, cellLength * magicSpacing)
  }

  render() {
    const { data, pagination, existInSelectedProducts, addToSelectedProducts, removeFromSelectedProducts } = this.props;

    return (
      <div>
        <ReactTableFixedColumns
          data={data}
          className="-striped"
          columns={this.columns()}
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
          onSortedChange={val => {
            const { id, desc } = val[0];
            this.props.prepareQuery(id, desc);
          }}
          onPageChange={this.onPageChange}
          onPageSizeChange={this.onPageSizeChange}
          PaginationComponent={DataTablePagination}
          manual
          getTrProps={(state, rowInfo) => {
            if (rowInfo && rowInfo.row) {
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