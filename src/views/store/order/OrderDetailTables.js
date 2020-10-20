import React from 'react';
import { injectIntl } from 'react-intl';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { currencyFormatVND, numberFormat, numberWithCommas } from '../../../helpers/Utils';
import "./style.scss";

const dataTableColumns = [
    {
        Header: "Hình ảnh",
        sortable: true,
        filterable: false,
        width: 80,
        accessor: "featureImage",
        Cell: props => <img width="60" src={`${process.env.REACT_APP_MEDIA_BASE_PATH}${props.value}`} alt="" />
    },
    {
        Header: "Tên sản phẩm",
        accessor: "name",
        sortable: true,
        filterable: false,
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Giá sản phẩm",
        accessor: "price",
        sortable: true,
        filterable: false,
        Cell: props => <p className="text-muted">
            {props.value ? (currencyFormatVND(Number.parseFloat(props.value).toFixed(0)) + " đ") : null}
        </p>
    },
    {
        Header: "Số lượng",
        accessor: "quantity",
        sortable: true,
        filterable: false,
        Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value).toFixed(0))}</p>
    },
    {
        Header: "Khối lượng",
        accessor: "weight",
        sortable: true,
        filterable: false,
        Cell: props => <p className="text-muted">{numberFormat(Number.parseFloat(props.value), 3, ".", ",")} kg</p>
    },
    // {
    //     Header: "Tổng giá đơn hàng",
    //     accessor: "totalPrice",
    //     sortable: true,
    //     filterable: false,
    //     Cell: props => <p className="text-muted">{Number.parseFloat(props.totalPrice).toFixed(0)}</p>
    // },
]

const OrderDetailTables = (props) => {
    return (
        <div>
            <ReactTable
                className="-striped -highlight"
                data={props.data}
                columns={dataTableColumns}
                defaultPageSize={5}
                // className="mb-4"
                PaginationComponent={DataTablePagination}
                style={{
                    // height: "500px"
                }}
            />
        </div>
    );
};

export default injectIntl(OrderDetailTables);