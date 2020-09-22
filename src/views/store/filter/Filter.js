import React, { Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { Card, CardBody, Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { UBOX_PRODUCTS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import Product from '../product/Product';
import DataTablePagination from '../../../components/DatatablePagination';
import Category from '../category/Category';

class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: new URLSearchParams(this.props.location.search),
            products: [],
            isLoading: true,
            resultFilter: {},
            dataTable: {
                canPrevious: false,
            }
        }
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts() {
        let search = this.state.search.get('s');
        let array = [];
        const page = this.state.dataTable.page || 0;
        const size = this.state.dataTable.defaultPageSize || 10;
        this.setState({ isLoading: true });
        ApiController.post(UBOX_PRODUCTS.filter, { uboxProductName: search, page: page, size: size }, data => {
            this.setState({
                resultFilter: data
            }, () => {
                this.state.resultFilter.uboxProducts.forEach(item => {
                    if (!item.featureImage) item.featureImage = '/assets/img/default-image.png';
                    array.push(item);
                });
                const dataTable = {
                    page: (this.state.resultFilter.nextPage - 1),
                    pageSizeOptions: [10, 20, 50, 100],
                    canPrevious: this.state.resultFilter.backPage > -1 ? true : false,
                }
                dataTable.defaultPageSize = dataTable.pageSizeOptions[0];
                dataTable.pages = Math.ceil(this.state.resultFilter.total / dataTable.defaultPageSize);
                dataTable.canNext = dataTable.pages > 1 ? true : false;
                this.setState({
                    products: array,
                    isLoading: false,
                    dataTable: dataTable
                })
            })
        })
    }

    onPageChange = (page) => {
        console.log(page);
        let { dataTable } = this.state;
        dataTable.page = page;
        if (page > 1) {
            dataTable.canPrevious = true;
        } else {
            dataTable.canPrevious = false;
        }
        if (page < dataTable.pages - 1) {
            dataTable.canNext = true;
        } else {
            dataTable.canNext = false;
        }
        this.setState({
            dataTable: dataTable
        })
        this.getProducts();
    }

    onPageSizeChange = (size) => {
        const { dataTable } = this.state;
        dataTable.defaultPageSize = size;
        this.setState({
            dataTable: dataTable
        })
        this.getProducts();
    }

    renderLoading = () => {
        return (
            <div className="loading"></div>
        );
    }

    render() {
        const { products, isLoading, dataTable } = this.state;
        const count = products.reduce((count, item) => Object.keys(item).length === 0 ? count : count + 1, 0)
        if (isLoading) {
            return this.renderLoading();
        }

        return (
            <Fragment>
                <Card className="p-1 w-100">
                    <CardBody>
                        {products[0] ? (
                            <>
                                <Row>
                                    <Colxx xxs="3" style={{ borderRight: "2px solid #eee" }}>
                                        <Category />
                                    </Colxx>
                                    <Colxx xxs="9">
                                        <h3>Kết quả tìm kiếm cho '{this.state.search.get('s')}': {count} kết quả</h3>
                                        <Row>
                                            {
                                                products.map((product, index) => {
                                                    return (
                                                        <Colxx xxs="3" key={index}>
                                                            <Product product={product} />
                                                        </Colxx>
                                                    )
                                                })
                                            }
                                        </Row>
                                        <Row>
                                            {/* className="d-md-inline-flex" */}
                                            <Colxx xxs="12" className="text-center mt-5">
                                                <DataTablePagination
                                                    page={dataTable.page}
                                                    pages={dataTable.pages}
                                                    defaultPageSize={dataTable.defaultPageSize}
                                                    canPrevious={dataTable.canPrevious}
                                                    canNext={dataTable.canNext}
                                                    pageSizeOptions={dataTable.pageSizeOptions}
                                                    showPageSizeOptions={true}
                                                    showPageJump={true}
                                                    onPageChange={this.onPageChange}
                                                    onPageSizeChange={this.onPageSizeChange}
                                                />
                                            </Colxx>
                                        </Row>
                                    </Colxx>
                                </Row>

                            </>

                        ) : <h1 >Không tìm thấy sản phẩm nào!</h1>
                        }
                    </CardBody>
                </Card>
            </Fragment>

        );
    }
}

export default injectIntl(Filter);