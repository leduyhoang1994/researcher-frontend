import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import { currencyFormatVND, numberFormat } from '../../../helpers/Utils';

import "./style.scss";
import { Button } from 'reactstrap';

const OrderTables = ({
  data,
  component,
  decrement,
  increment,
  remove
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
    {
      Header: __(component.messages, "Số lượng"),
      sortable: false,
      accessor: "quantity",
      Cell: props =>
        <div>
          <Button
            size="xs"
            className="w-5 w-xs-100"
            color="primary"
            disabled={parseInt(props.value) <= 1 ? true : false}
            onClick={() => {
              decrement(props.original)
            }}
          >-</Button>
          <span className="ml-2">{parseInt(props.value)}</span>
          <Button
            size="xs"
            className="w-5 w-xs-100 ml-2"
            color="primary"
            onClick={() => {
              increment(props.original)
            }}
          >+</Button>
        </div>
    },
    {
      Header: __(component.messages, "Xóa"),
      sortable: false,
      width: 50,
      accessor: "quantity",
      Cell: props =>
        <div>
          <Button
            size="xs"
            className="w-5 w-xs-100"
            color="primary"
            onClick={() => {
              remove(props.original)
            }}
          >X</Button>
        </div>
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
      />
    </div>
  );
};

export default injectIntl(OrderTables);