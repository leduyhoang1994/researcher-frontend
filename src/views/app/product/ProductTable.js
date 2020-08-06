import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';

const ProductTable = ({ data, component }) => {
  const columns = () => [
    {
      Header: __(component.messages, "Tên thư mục tầng 3"),
      sortable: false,
      accessor: "categoryName",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Tên sản phẩm"),
      sortable: false,
      accessor: "productName",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Giá"),
      accessor: "price",
      Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
      Header: __(component.messages, "Tổng sale"),
      accessor: "topSale",
      Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
  ];

  return (
    <div>
      <ReactTable
        data={data}
        columns={columns()}
        defaultPageSize={10}
        className="mb-4"
        PaginationComponent={DataTablePagination}
      />
    </div>
  );
};

export default injectIntl(ProductTable);