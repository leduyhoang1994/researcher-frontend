import React from 'react';
import { injectIntl } from 'react-intl';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { numberWithCommas } from '../../../helpers/Utils';
import "./style.scss";

const dataTableColumns = [
    {
        Header: "Hình ảnh",
        width: 150,
        accessor: "featureImage",
        Cell: props => <img width="50" src={`${process.env.REACT_APP_MEDIA_BASE_PATH}${props.value}`} alt={props.value} />
    },
    {
        Header: "Trạng thái",
        width: 150,
        accessor: "isPublished",
        Cell: props => <p className={props.value ? "text-success" : "text-danger"}>
            {props.value ? "Đang xuất bản" : "Ngừng xuất bản"}
        </p>
    },
    {
        Header: "Tên sản phẩm",
        width: 250,
        accessor: "name",
        Cell: props => <div style={{
            "whiteSpace": "break-spaces"
        }}>
            <p><b>{props.value}</b></p>
        </div>
    },
    {
        Header: "Ngành hàng",
        width: 250,
        accessor: "nameLv3",
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Giá ubox",
        accessor: "price",
        Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value).toFixed(0).toLocaleString())} đ</p>
    },
    {
        Header: "Giá nội bộ",
        accessor: "internalPrice",
        Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value).toFixed(0).toLocaleString())} đ</p>
    },
    {
        Header: "Giá bán tối thiểu",
        accessor: "minPrice",
        Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value).toFixed(0).toLocaleString())} đ</p>
    },
    {
        Header: "Giá bán đề xuất",
        accessor: "offerPrice",
        Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value).toFixed(0).toLocaleString())} đ</p>
    },
    {
        Header: "Trọng lượng",
        accessor: "weight",
        Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value).toFixed(0).toLocaleString())}</p>
    },
    {
        Header: "SLA dịch vụ",
        accessor: "serviceSla",
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Phí dịch vụ dự kiến",
        accessor: "serviceCost",
        Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value).toFixed(0).toLocaleString())} đ</p>
    },
    {
        Header: "Mô tả",
        accessor: "description",
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Hình thức vận chuyển",
        accessor: "transportation",
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Thời gian phát hàng của xưởng",
        accessor: "workshopIn",
        Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value).toFixed(0).toLocaleString())}</p>
    },
    {
        Header: "Thời gian giao hàng Ubox",
        accessor: "uboxIn",
        Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value).toFixed(0).toLocaleString())}</p>
    },
]

const UboxProductTables = (props) => {
    let data = props.products;
    return (
        <div>
            <ReactTable
                data={data}
                columns={dataTableColumns}
                defaultPageSize={10}
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
                style={{
                    height: "550px"
                }}
            />
        </div>
    );
};

export default injectIntl(UboxProductTables);