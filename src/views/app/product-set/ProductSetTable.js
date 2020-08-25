import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { Input } from 'reactstrap';
import { Link } from 'react-router-dom';

const ProductTableSet = ({
  data,
  component,
  existInSelectedProducts,
  addToSelectedProducts,
  removeFromSelectedProducts
}) => 
{
  const columns = () => [
    {
      Header: __(component.messages, "Tên bộ sản phẩm"),
      sortable: false,
      accessor: "setName",
      Cell: props => <p className="text-muted">
          <Link to={`/app/product-sets/${props.original.id}`}>{props.value}</Link>
        </p>
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

export default injectIntl(ProductTableSet);