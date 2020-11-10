import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Card, CardBody } from 'reactstrap';
import { Fragment } from 'react';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { PRODUCT_SELLER } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import Category from '../category/Category';
import { defaultImg } from '../../../constants/defaultValues';
import DataTablePagination from '../../../components/DatatablePagination';
import Product from '../product/Product';

class Homepage extends React.Component {

    constructor(props) {
        super(props);
        let cart = localStorage.getItem("cart");
        if (cart === null || cart.trim() === "") {
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));
        } else cart = JSON.parse(cart);

        this.state = {
            categories: {},
            products: [],
            categoryLv1: "",
            categoryLv2: "",
            categoryLv3: "",
            search: "",
            cart: cart,
            categoryName: this.props.match.params.cate || null,
            dataTable: {
                page: 0,
                pages: 1,
                canNext: false,
                canPrevious: false,
                size: 20,
                pageSizeOptions: [10, 20, 50, 100, 1000],
            }

        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts = (hasLevel = true) => {
        let { dataTable, categoryLv1, categoryLv2, categoryLv3, categoryName } = this.state;
        let array = [];
        if(hasLevel) {
            const cate = new URLSearchParams(this.props.location.search);
            let level = cate.get("lvl") || "";
            if (level) {
                level = parseInt(level);
                switch (level) {
                    case 1: categoryLv1 = categoryName; break;
                    case 2: categoryLv2 = categoryName; break;
                    case 3: categoryLv3 = categoryName; break;
                    default: break;
                }
            }
        }

        ApiController.post(PRODUCT_SELLER.filter, {
            uboxCategoryNameLv1: categoryLv1,
            uboxCategoryNameLv2: categoryLv2,
            uboxCategoryNameLv3: categoryLv3,
            isPublished: true,
            page: dataTable.page,
            size: dataTable.size
        }, data => {
            this.setState({
                products: data.uboxProducts
            }, () => {
                this.state.products.forEach(item => {
                    if (!item.featureImage) item.featureImage = defaultImg;
                    array.push(item);
                });
                dataTable.page = data.nextPage - 1;
                dataTable.pages = Math.ceil(data.total / dataTable.size);
                dataTable.canNext = dataTable.pages > 1 ? true : false;
                dataTable.canPrevious = data.backPage > -1 ? true : false;
                this.setState({
                    products: array,
                    dataTable: dataTable
                })
            })
        })
    }

    onPageChange = (page) => {
        let { dataTable } = this.state;
        dataTable.page = page;
        if (page >= 1) {
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
        const { dataTable, products } = this.state;
        dataTable.size = size;
        dataTable.pages = Math.ceil(products?.length / size)
        console.log(dataTable, size);
        this.setState({
            dataTable: dataTable
        })
        this.getProducts();
    }

    getAllProduct = () => {
        const { dataTable } = this.state;
        dataTable.page = 0;
        dataTable.size = 1000
        this.setState({
            dataTable,
            categoryLv1: "",
            categoryLv2: "",
            categoryLv3: "",
            categoryName: ""
        })
        this.getProducts(false)
    }

    render() {
        const { products, isLoading, dataTable } = this.state;
        if (isLoading) {
            return this.renderLoading();
        }

        return (
            <Fragment>
                <Card className="p-0 w-100">
                    <CardBody className="p-0">
                        <Row>
                            <Colxx xxs="3">
                                <Category
                                    getAllProduct={this.getAllProduct}
                                />
                            </Colxx>
                            <Colxx xxs="9" className="text-center">
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
                                    <Colxx xxs="12" className="text-center mt-5 p-4">
                                        <DataTablePagination
                                            key={JSON.stringify(dataTable)}
                                            page={dataTable.page}
                                            pages={dataTable.pages}
                                            defaultPageSize={dataTable.size}
                                            canPrevious={dataTable.canPrevious}
                                            canNext={(dataTable?.page < dataTable?.pages - 1) ? true : false}
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
                    </CardBody>
                </Card>
            </Fragment>
        );
    }
}

export default injectIntl(Homepage);