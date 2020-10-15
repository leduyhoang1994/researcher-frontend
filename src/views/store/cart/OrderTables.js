import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";

import { isFunction } from 'formik';
import { currencyFormatVND, numberFormat } from '../../../helpers/Utils';

import "./style.scss";

const OrderTables = ({
  data,
  component,
  existInSelectedCart = false,
  addToSelectedCart,
  removeFromSelectedCart,
}) => {
  const columns = () => [
    {
      Header: __(component.messages, "Tên sản phẩm"),
      sortable: false,
      accessor: "name",
      Cell: props => <a target="_blank" rel="noopener noreferrer" href={`/store/products/detail/${props.original.id}`}>{props.value}</a>
    },
    {
      Header: __(component.messages, "Khối lượng"),
      sortable: false,
      width: 75,
      accessor: "weight",
      Cell: props => <p className="text-muted">
        {props.value ? (numberFormat(Number.parseFloat(props.value), 3) + " kg") : null}
      </p>
    },
    {
      Header: __(component.messages, "Giá nhập hàng"),
      sortable: false,
      width: 100,
      accessor: "offerPrice",
      Cell: props => <p className="text-muted">
        {props.value ? (currencyFormatVND(Number.parseFloat(props.value)) + " đ") : null}
      </p>
    },
    {
      Header: __(component.messages, "Thời gian giao hàng"),
      sortable: false,
      accessor: "workshopIn",
      Cell: props => <p className="text-muted">
        {props.value ? (numberFormat(Number.parseFloat(props.value), 1) + " ngày") : null}
      </p>
    },
  ];

  return (
    <div>
      <ReactTable
        data={data}
        columns={columns()}
        defaultPageSize={data.length}
        className="cart-table mb-4 -striped -highlight"
        showPagination={false}
        // PaginationComponent={DataTablePagination}
        getTrProps={(state, rowInfo) => {
          if (rowInfo && rowInfo.row) {
            return {
              onClick: (e) => {
                if (isFunction(existInSelectedCart) ? existInSelectedCart(rowInfo.original) : false) {
                  if (isFunction(removeFromSelectedCart)) removeFromSelectedCart(rowInfo.original);
                } else {
                  if (isFunction(addToSelectedCart)) addToSelectedCart(rowInfo.original);
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

export default injectIntl(OrderTables);