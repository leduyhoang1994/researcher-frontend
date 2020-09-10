import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import "./style.scss";
import * as moment from 'moment'

const dataTableColumns = [
    {
        Header: "Mã đơn hàng",
        accessor: "id",
        Cell: props => <p className="text-muted">#{props.value}</p>
    },
    {
        Header: "Tổng giá đơn hàng",
        accessor: "totalPrice",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
        Header: "Ngày tạo đơn",
        accessor: "createdAt",
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
        values.push(element);
    });
    
    return (
        <div>
            <ReactTable
                data={values}
                columns={dataTableColumns}
                defaultPageSize={5}
                className="mb-4"
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