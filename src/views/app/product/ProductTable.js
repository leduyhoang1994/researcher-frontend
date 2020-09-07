import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { Input, Button } from 'reactstrap';
import { isFunction } from 'formik';
import Select from 'react-select';
import ResourceTable from '../../../components/data-table';
import "./style.scss";
import { PRODUCTS } from '../../../constants/api';

const ProductTable = ({
  data,
  component,
  existInSelectedProducts,
  addToSelectedProducts,
  removeFromSelectedProducts,
  selectable = true,
  filterCate = []
}) => {
  const columns = () => [
    {
      Header: __(component.messages, "Thao tác"),
      accessor: null,
      sortable: false,
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
            <Button
              size="xs"
              onClick={() => {
                if (isFunction(removeFromSelectedProducts)) {
                  removeFromSelectedProducts(props.original);
                }
              }}
            >
              {__(component.messages, "Xóa")}
            </Button>
          }
        </div>
      )
    },
    {
      Header: __(component.messages, "Ảnh"),
      sortable: false,
      width: 50,
      accessor: "productImage",
      Cell: props => <img width="50" src={props.value} />
    },
    // {
    //   Header: __(component.messages, "Tên ngành hàng tầng 3"),
    //   filterable: true,
    //   accessor: "productCategoryVi",
    //   Cell: props => <p className="text-muted">{props.value}</p>,
    //   Filter: ({ filter, onChange }) => {
    //     return (
    //       <Select
    //         isClearable
    //         className="react-select"
    //         classNamePrefix="react-select"
    //         options={filterCate}
    //         onChange={event => onChange(event ? event.categoryNameViLevel3 : "")}
    //         getOptionValue={option => option.categoryNameViLevel3}
    //         getOptionLabel={option => option.categoryNameViLevel3}
    //       />
    //     );
    //   }
    // },
    {
      Header: __(component.messages, "Tên sản phẩm"),
      width: 300,
      filterable: true,
      accessor: "productTitleVi",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Link sản phẩm"),
      width: 300,
      filterable: true,
      accessor: "productLink",
      Cell: props => <a target="_blank" href={props.value} className="text-muted">{props.value}</a>
    },
    {
      Header: __(component.messages, "Doanh số bán ra"),
      accessor: "monthlySale",
      filterable: true,
      Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
      Header: __(component.messages, "Giá sản phẩm"),
      accessor: "priceStr",
      filterable: true,
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Phí phát hành nội địa"),
      accessor: "productPrice",
      filterable: true,
      Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
      Header: __(component.messages, "Số lượng bán tối tiểu"),
      accessor: "minSale",
      filterable: true,
      Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
      Header: __(component.messages, "Địa điểm phát hàng"),
      filterable: true,
      accessor: "productLocation",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Số lượng bán ra"),
      accessor: "topSale",
      filterable: true,
      Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
      Header: __(component.messages, "Tên shop bán"),
      sortable: false,
      filterable: true,
      accessor: "productShop",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Uy tín shop bán"),
      sortable: false,
      filterable: true,
      accessor: "productShopRating",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Tỉ lệ khách quay lại"),
      sortable: false,
      filterable: true,
      accessor: "rebuildRate",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Ghi chú"),
      sortable: false,
      filterable: true,
      accessor: "productShopRating",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
  ];

  const apiResource = {
    url: PRODUCTS.all,
    query: {
      
    }
  }

  return (
    <div>
      <ResourceTable
        apiResource={apiResource}
        columns={columns()}
        defaultPageSize={25}
        className="mb-4"
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
      />
    </div>
  );
};

export default injectIntl(ProductTable);