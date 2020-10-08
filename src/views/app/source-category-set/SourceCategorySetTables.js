import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import "./style.scss";

const SourceCategorySetTables = ({
  data,
  component,
  removeFromCategorySet,
}) => {
  const columns = () => [
    {
      Header: __(component.messages, "Tên danh sách"),
      sortable: false,
      accessor: "setName",
      Cell: props => <p className="text-muted">
        <Link to={`/app/source-category-sets/${props.original.id}`}>{props.value}</Link>
      </p>
    },
    {
      Header: __(component.messages, "Xóa"),
      sortable: false,
      accessor: null,
      Cell: props => {
        return (
          <div >
            <Button
              color="danger"
              size="xs"
              onClick={() => {
                removeFromCategorySet(props.original)
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

export default injectIntl(SourceCategorySetTables);