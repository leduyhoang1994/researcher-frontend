import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import ReactTable from "react-table";
import classnames from "classnames";
import IntlMessages from "../../helpers/IntlMessages";
import DataTablePagination from "../../components/DatatablePagination";
import { Link } from 'react-router-dom';

const CustomTbodyComponent = props => (
  <div {...props} className={classnames("rt-tbody", props.className || [])}>
    <PerfectScrollbar options={{ suppressScrollX: true }}>
      {props.children}
    </PerfectScrollbar>
  </div>
);

const dataTableColumns = [
  {
    Header: "Tên ngành hàng tầng 1",
    accessor: "nameLv1",
    Cell: props => <p className="list-item-heading">{props.value}</p>
  },
  {
    Header: "Tên ngành hàng tầng 2",
    accessor: "nameLv2",
    Cell: props => <p className="list-item-heading">{props.value}</p>
  },
  {
    Header: "Tên ngành hàng tầng 3",
    accessor: "nameLv3",
    Cell: props => <p className="list-item-heading">{props.value}</p>
    // Cell: ({ row }) => (<Link to={{pathname:'/editpage/'+`${row.pageURL}`, state :{data : row} } }>{row.name}</Link>),
  }
];

export const ReactTableWithPaginationCard = (props) => {
  const data = props;
  console.log(data);
  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle>
          <IntlMessages id="table.react-pagination" />
        </CardTitle>
        <ReactTable
          data={data}
          paginationMaxSize={3}
          columns={dataTableColumns}
          defaultPageSize={5}
          showPageJump={false}
          showPageSizeOptions={false}
          PaginationComponent={DataTablePagination}
          className={"react-table-fixed-height"}
        />
      </CardBody>
    </Card>
  );
};
export const ReactTableWithScrollableCard = (props) => {
  const data = props;
  console.log(data);
  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle>
          <IntlMessages id="table.react-scrollable" />
        </CardTitle>
        <ReactTable
          data={data}
          TbodyComponent={CustomTbodyComponent}
          columns={dataTableColumns}
          defaultPageSize={20}
          showPageJump={false}
          showPageSizeOptions={false}
          showPagination={false}
          className={"react-table-fixed-height"}
        />
      </CardBody>
    </Card>
  );
};
export const ReactTableAdvancedCard = (props) => {
  const data = props.categories;
  return (
    <Card className="mb-4">
      <CardBody>
        <CardTitle>
          <IntlMessages id="table.react-advanced" />
        </CardTitle>
        <ReactTable
          getTrProps={(state, rowInfo) => {
            if (true) {
              return {
                onClick: (e) => {
                  props.handleClickRow(rowInfo.original)
                },
                style: {
                  cursor: "pointer"
                }
              }
            }
          }}
          data={data}
          columns={dataTableColumns}
          defaultPageSize={5}
          // filterable={true}
          showPageJump={true}
          PaginationComponent={DataTablePagination}
          showPageSizeOptions={true}
        />
      </CardBody>
    </Card>
  );
};
