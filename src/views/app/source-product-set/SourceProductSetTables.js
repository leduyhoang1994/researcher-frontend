import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { Link } from 'react-router-dom';
import "./style.scss";
import ConfirmButton from '../../../components/common/ConfirmButton';

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
          <div className="text-right d-block">
            <ConfirmButton
              btnConfig={{
                color: "danger",
                size: "xs"
              }}
              content={{
                close: "Đóng",
                confirm: "Xác nhận"
              }}
              onConfirm={() => {
                removeFromProductSet(props.original);
              }}
              buttonContent={() => {
                return (
                  <b>X</b>
                );
              }}
              confirmHeader={() => {
                return (
                  <>Thông báo</>
                );
              }}
              confirmContent={() => {
                return (
                  <p>Bạn có chắc chắn muốn xóa bộ sản phẩm này không?</p>
                );
              }}
            />
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