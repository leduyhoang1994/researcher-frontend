import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import { Button } from 'reactstrap';
import "../style.scss"

const SellerTables = ({
  sellers,
  component,
}) => {
  const columns = () => [
    {
      Header: __(component.messages, "Họ"),
      sortable: false,
      accessor: "firstName",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Tên"),
      sortable: false,
      accessor: "lastName",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Số điện thoại"),
      sortable: false,
      accessor: "phoneNumber",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "E-mail"),
      sortable: false,
      accessor: "email",
      Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
      Header: __(component.messages, "Hành động"),
      sortable: false,
      accessor: null,
      width: 280,
      Cell: props => {
        return (
          <div className="text-left d-block">
            <Button
              className="button"
              color="primary"
              size="xs"
              onClick={() => {
              }}
            >
              Chi tiết
              </Button>
          </div>
        )
      }
    },
  ];

  return (
    <div>
      <ReactTable
        className="-striped -highlight"
        data={sellers}
        columns={columns()}
        defaultPageSize={10}
        showPagination={false}
        getTrProps={(state, rowInfo) => {
          if (rowInfo && rowInfo.row) {
            return {
              onClick: (e) => {
                window.open(`/info/sellers/detail/${rowInfo.original.id}`, "_self")
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

export default injectIntl(SellerTables);