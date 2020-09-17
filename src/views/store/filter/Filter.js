import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { PRODUCT_EDIT } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import Product from '../product/Product';

class Filter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: new URLSearchParams(this.props.location.search),
            products: [],
            isLoading: true
        }
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts() {
        let search = this.state.search.get('s');
        let array = [];
        this.setState({ isLoading: true });
        ApiController.post(PRODUCT_EDIT.filter, { productEditName: search, page: 0, size: 10 }, data => {
            this.setState({
                products: data.productEdits
            }, () => {
                this.state.products.forEach(item => {
                    if (!item.featureImage) item.featureImage = '/assets/img/default-image.png';
                    array.push(item);
                });
                this.setState({
                    products: array,
                    isLoading: false
                })
            })
        })
    }

    renderLoading = () => {
        return (
            <div className="loading"></div>
        );
    }

    render() {
        const { products, isLoading } = this.state;
        const count = products.reduce((count, item) => Object.keys(item).length === 0 ? count : count + 1, 0)
        if (isLoading) {
            return this.renderLoading();
        }

        return (
            <>
                <h3>Kết quả tìm kiếm cho '{this.state.search.get('s')}': {count} kết quả</h3>
                {products[0] ? (
                    <>
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
                            <Colxx xxs="12" className="text-center">
                                <Pagination aria-label="Page navigation example" className="d-md-inline-flex">
                                    <PaginationItem>
                                        <PaginationLink className="first" href="#">
                                            <i className="simple-icon-control-start" />
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink className="prev" href="#">
                                            <i className="simple-icon-arrow-left" />
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem active>
                                        <PaginationLink href="#">2</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="#">3</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink className="next" href="#">
                                            <i className="simple-icon-arrow-right" />
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink className="last" href="#">
                                            <i className="simple-icon-control-end" />
                                        </PaginationLink>
                                    </PaginationItem>
                                </Pagination>
                            </Colxx>
                        </Row>
                    </>

                ) : <h1 >Không tìm thấy sản phẩm nào!</h1>
                }
            </>

        );
    }
}

export default injectIntl(Filter);