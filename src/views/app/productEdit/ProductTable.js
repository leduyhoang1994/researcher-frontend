import React from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import "./style.scss";

const dataTableColumns = [
    {
        Header: "Hình ảnh",
        width: 150,
        accessor: "featureImage",
        Cell: props => <img width="50" src={props.value} />
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
        accessor: "category.nameLv3",
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Giá gốc Max",
        accessor: "priceMax",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
        Header: "Giá gốc Min",
        accessor: "priceMin",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
        Header: "Giá dự kiến Max",
        accessor: "futurePriceMax",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
        Header: "Giá dự kiến Min",
        accessor: "futurePriceMin",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
        Header: "Trọng lượng",
        accessor: "weight",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
        Header: "SLA dịch vụ",
        accessor: "serviceSla",
        Cell: props => <p className="text-muted">{props.value}</p>
    },
    {
        Header: "Phí dịch vụ dự kiến",
        accessor: "serviceCost",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
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
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
    {
        Header: "Thời gian giao hàng Ubox",
        accessor: "uboxIn",
        Cell: props => <p className="text-muted">{Number(props.value).toLocaleString()}</p>
    },
]

const ProductTable = (props) => {
    let data = props.products;
    return (
        <div>
            <ReactTable
                data={data}
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

export default injectIntl(ProductTable);