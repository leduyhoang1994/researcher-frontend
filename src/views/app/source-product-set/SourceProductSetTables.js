import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import "./style.scss";

const SourceProductSetTables = ({
  data,
  component,
  removeFromProductSet,
}) => {
  const columns = () => [
    {
      Header: __(component.messages, "Tên bộ sản phẩm"),
      sortable: false,
      accessor: "setName",
      Cell: props => <p className="text-muted">
        <Link to={`/app/source-product-sets/${props.original.id}`}>{props.value}</Link>
      </p>
    },
    {
      Header: __(component.messages, "Xóa"),
      className:"text-right",
      sortable: false,
      accessor: null,
      Cell: props => {
        return (
          <div className="">
            <Button
              color="danger"
              size="xs"
              onClick={() => {
                removeFromProductSet(props.original)
              }}
            >
              X
            </Button>
          </div>
        )
      }
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

export default injectIntl(SourceProductSetTables);