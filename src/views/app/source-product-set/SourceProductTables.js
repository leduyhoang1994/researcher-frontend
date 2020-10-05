import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import ReactTable from "react-table";
import DataTablePagination from '../../../components/DatatablePagination';
import { Button } from 'reactstrap';
import { isFunction } from 'formik';
import Select from 'react-select';
import "./style.scss";
import { numberWithCommas } from '../../../helpers/Utils';
import withFixedColumns from "react-table-hoc-fixed-columns";

import "react-table/react-table.css";
import 'react-table-hoc-fixed-columns/lib/styles.css'

const ReactTableFixedColumns = withFixedColumns(ReactTable);

class SourceProductTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            pagination: {
                page: 0,
                size: 25,
                canNext: true,
                canPrevious: false,
                defaultPageSize: 25,
            },
            sorted: [],
        };
        this.messages = this.props.component.props.intl.messages;
    }

    columns = (selectable = true, filterCate) => [
        {
            Header: __(this.messages, "Hành động"),
            accessor: 'id',
            sortable: false,
            fixed: "left",
            width: 150,
            filterable: false,
            Cell: props => (
                <div className="text-left">
                    {
                        selectable &&
                        <>
                            <Button
                                className="mr-2"
                                size="xs"
                                onClick={() => {
                                    if (isFunction(this.props.removeFromSelectedProducts)) {
                                        this.props.removeFromSelectedProducts(props.original);
                                    }
                                }}
                            >
                                {__(this.messages, "Xóa")}
                            </Button>
                            <Button
                                size="xs"
                                color="success"
                                href={`/app/ubox-products/edit?product-id=${props.value}`}
                            >
                                {__(this.messages, "Biên tập")}
                            </Button>
                        </>
                    }
                </div>
            )
        },
        {
            Header: __(this.messages, "Hình ảnh"),
            sortable: false,
            filterable: false,
            width: 80,
            fixed: "left",
            accessor: "productImage",
            Cell: props => <img width="50" src={props.value} alt="" />
        },
        {
            Header: __(this.messages, "Tên sản phẩm"),
            width: 450,
            fixed: "left",
            accessor: "productTitleVi",
            Cell: props => <div className="text-left">
                <a target="_blank" href={props.original.productLink}>{props.value}</a>
            </div>
        },
        {
            Header: __(this.messages, "Tên ngành hàng tầng 3"),
            width: 150,
            accessor: "productCategoryVi",
            Cell: props => <p className="text-muted text-center">{props.value}</p>,
        },
        {
            Header: __(this.messages, "| Nguồn sản phẩm"),
            width: 100,
            accessor: "site",
            Cell: props => <p className="text-muted">{props.value}</p>
        },
        {
            Header: __(this.messages, "| Doanh số bán ra"),
            accessor: "monthlySale",
            Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value)).toLocaleString()}</p>
        },
        {
            Header: __(this.messages, "| Giá min"),
            accessor: "minPrice",
            Cell: props => <p className="text-muted">
                {numberWithCommas(Number.parseFloat(props.value)).toLocaleString()} {props.original.site === "Shopee" ? "₫" : "¥"}
            </p>
        },
        {
            Header: __(this.messages, "| Giá max"),
            accessor: "maxPrice",
            Cell: props => <p className="text-muted">
                {numberWithCommas(Number.parseFloat(props.value)).toLocaleString()} {props.original.site === "Shopee" ? "₫" : "¥"}
            </p>
        },
        {
            Header: __(this.messages, "| Phí phát hành nội địa"),
            accessor: "productPrice",
            Cell: props => <p className="text-muted">
                {numberWithCommas(Number.parseFloat(props.value)).toLocaleString()} {props.original.site === "Shopee" ? "₫" : "¥"}
            </p>
        },
        {
            Header: __(this.messages, "| Số lượng bán tối tiểu"),
            accessor: "minSale",
            Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value)).toLocaleString()}</p>
        },
        {
            Header: __(this.messages, "| Địa điểm phát hàng"),
            accessor: "productLocation",
            Cell: props => <p className="text-muted">{props.value}</p>
        },
        {
            Header: __(this.messages, "| Số lượng bán ra"),
            accessor: "topSale",
            Cell: props => <p className="text-muted">{numberWithCommas(Number.parseFloat(props.value)).toLocaleString()}</p>
        },
        {
            Header: __(this.messages, "| Tên shop bán"),
            sortable: false,
            accessor: "productShop",
            Cell: props => <p className="text-muted">{props.value}</p>
        },
        {
            Header: __(this.messages, "| Uy tín shop bán"),
            sortable: false,
            accessor: "productShopRating",
            Cell: props => <p className="text-muted">{props.value}</p>
        },
        {
            Header: __(this.messages, "| Tỉ lệ khách quay lại"),
            sortable: false,
            accessor: "rebuildRate",
            Cell: props => <p className="text-muted">{props.value}</p>
        },
        {
            Header: __(this.messages, "| Ghi chú"),
            sortable: false,
            accessor: "productShopRating",
            Cell: props => <p className="text-muted">{props.value}</p>
        },
    ];

    getColumnWidth = (rows, accessor, headerText) => {
        const maxWidth = 400
        const magicSpacing = 10
        const cellLength = Math.max(
            ...rows.map(row => (row[accessor] || '').length),
            headerText.length,
        );
        return Math.min(maxWidth, cellLength * magicSpacing)
    }

    componentDidMount() {
        const { data } = this.props;
        const { pagination } = this.state;
        pagination.pages = Math.ceil(data.length / pagination.defaultPageSize);
        pagination.canNext = pagination.pages > 1 ? true : false;
        this.setState({
            pagination: pagination
        })
    }

    onPageChange = (page) => {
        let { pagination } = this.state;
        pagination.page = page;
        if (page > 1) {
            pagination.canPrevious = true;
        } else {
            pagination.canPrevious = false;
        }
        if (page < pagination.pages - 1) {
            pagination.canNext = true;
        } else {
            pagination.canNext = false;
        }
        this.setState({
            pagination: pagination
        })
    }

    onPageSizeChange = (size) => {
        const { pagination } = this.state;
        pagination.size = size;
        pagination.pages = Math.ceil(this.props.data.length / size)
        if(pagination.page >= pagination.pages) {
            pagination.page = 0;
        }
        this.setState({
            pagination: pagination
        })
    }

    render() {
        const { data, removeFromSelectedProducts } = this.props;
        const { pagination } = this.state;

        return (
            <div>
                <ReactTableFixedColumns
                    data={data}
                    className="-striped"
                    columns={this.columns()}
                    filterable={false}
                    showPageJump={true}
                    // current_page={pagination.page}
                    page={pagination.page}
                    pages={pagination.pages}
                    defaultPageSize={pagination.defaultPageSize}
                    canPrevious={pagination.canPrevious}
                    showPageSizeOptions={true}
                    PaginationComponent={DataTablePagination}
                    onPageChange={this.onPageChange}
                    onPageSizeChange={this.onPageSizeChange}
                    getTrProps={(state, rowInfo) => {
                        if (rowInfo && rowInfo.row) {
                            return {
                                onClick: (e) => {
                                    removeFromSelectedProducts(rowInfo.original);
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
    }
};

export default injectIntl(SourceProductTable);