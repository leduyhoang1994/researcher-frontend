import React from 'react';
import { injectIntl } from 'react-intl';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import "./style.scss";

const dataTableColumns = [
    {
        Header: "Mã đơn hàng",
        accessor: "id",
        sortable: true,
        filterable: false,
        Cell: props => <p className="text-muted">#{props.value}</p>
    },
    {
        Header: "Tên lô hàng",
        accessor: "groupOrderName",
        sortable: true,
        filterable: false,
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Loại đơn hàng",
        accessor: "transport",
        sortable: true,
        filterable: false,
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Tổng giá đơn hàng",
        accessor: "totalPrice",
        sortable: true,
        filterable: false,
        Cell: props => <p className="text-muted">{Number.parseFloat(props.value).toFixed(0)}</p>
    },
    {
        Header: "Ngày tạo đơn",
        accessor: "createdAt",
        sortable: true,
        filterable: false,
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Trạng thái",
        accessor: "statusPayment",
        sortable: true,
        width: 100,
        filterable: false,
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Địa chỉ giao hàng",
        accessor: "address",
        sortable: true,
        filterable: false,
        Cell: props => <p className="text-muted">{props.value}</p>
    },
]

const OrderTable = (props) => {
    let data = props.orders;
    let values = [];
    data.forEach(element => {
        const date = element.createdAt;
        const str = date.substring(0, 10);
        element.createdAt = str;
        element.groupOrderName = element.groupOrder.name;
        element.address = element.addressOrder.city + ", " 
        + element.addressOrder.district + ", " 
        + element.addressOrder.town + ", " 
        + element.addressOrder.address;
        element.transport = element.transportation.name;
        values.push(element);
    });
    
    return (
        <div>
            <ReactTable
                data={values}
                columns={dataTableColumns}
                defaultPageSize={5}
                // className="mb-4"
                PaginationComponent={DataTablePagination}
                getTrProps={(state, rowInfo) => {
                    if (rowInfo && rowInfo.row) {
                        return {
                            onClick: (e) => {
                                props.handleClickRow(rowInfo.original)
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

export default injectIntl(OrderTable);