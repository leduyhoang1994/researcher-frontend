import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Card, CardBody } from 'reactstrap';
import { Fragment } from 'react';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { PRODUCT_SELLER } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import ProductList from '../product/ProductList';
import Category from '../category/Category';
import { slides, advert } from "../../../data/slideShow"
import HomePageCarousel from './HomePageCarousel';
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
            cate: new URLSearchParams(this.props.location.search),
            categoryName: this.props.match.params.cate || null,
            dataTable: {
                page: 0,
                pages: 1,
                canNext: false,
                canPrevious: false,
                size: 10,
                pageSizeOptions: [10, 20, 50, 100],
            }

        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts = () => {
        let level = (this.state.cate.get("lvl"));
        let { dataTable } = this.state;
        let array = [];
        let categoryLv1 = this.state.categoryLv1;
        let categoryLv2 = this.state.categoryLv2;
        let categoryLv3 = this.state.categoryLv3;
        if (level) {
            level = parseInt(level);
            switch (level) {
                case 1: categoryLv1 = this.state.categoryName; break;
                case 2: categoryLv2 = this.state.categoryName; break;
                case 3: categoryLv3 = this.state.categoryName; break;
                default: break;
            }
        } else {
            categoryLv1 = this.state.categoryLv1;
            categoryLv2 = this.state.categoryLv2;
            categoryLv3 = this.state.categoryLv3;
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
                dataTable.page = this.state.products.nextPage - 1;
                dataTable.pages = Math.ceil(this.state.products.total / dataTable.size);
                dataTable.canNext = dataTable.pages > 1 ? true : false;
                dataTable.canPrevious = this.state.products.backPage > -1 ? true : false;
                this.setState({
                    products: array,
                    dataTable: dataTable
                })
            })
        })
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
                                <Category />
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
                                    <Colxx xxs="12" className="text-center mt-5">
                                        <DataTablePagination
                                            key={dataTable}
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
                                {/* <div className="p-0 w-100 float-left">
                                    {
                                        slides &&
                                        <HomePageCarousel
                                            items={slides}
                                        />
                                    }
                                </div> */}
                                {/* <div className="p-0 w-30 float-left">
                                    {advert.map((item, index) => {
                                        if (index < 3) {
                                            return (
                                                <div key={index}>
                                                    <img src={item.img} alt=""></img>
                                                </div>
                                            )
                                        } else {
                                            // return (<></>)
                                        }

                                    }

                                        // <NavLink
                                        //     to={`/#`}
                                        //     className=""
                                        // >
                                        //     <span>a
                                        //         <img src={item.img} alt=""></img>
                                        //     </span>
                                        // </NavLink>
                                    )}
                                </div> */}
                            </Colxx>
                        </Row>
                    </CardBody>
                </Card>
            </Fragment>
        );
    }
}

export default injectIntl(Homepage);