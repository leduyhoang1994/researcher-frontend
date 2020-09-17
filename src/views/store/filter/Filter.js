import React from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
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
        }
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts() {
        let search = this.state.search.get('s');
        let array = [];
        ApiController.post(PRODUCT_EDIT.filter, { productEditName: search, page: 0, size: 10 }, data => {
            this.setState({
                products: data.productEdits
            }, () => {
                this.state.products.forEach(item => {
                    if (!item.featureImage) item.featureImage = '/assets/img/default-image.png';
                    array.push(item);
                });
                this.setState({
                    products: array
                })
            })
        })
    }

    render() {
        const { products } = this.state;
        const count = products.reduce((count, item) => Object.keys(item).length === 0 ? count : count + 1, 0)
        return (
            <>
                <h3>Kết quả tìm kiếm cho '{this.state.search.get('s')}': {count} kết quả</h3>
                <Row>
                    {products[0] ? (
                        <>
                            {
                                products.map((product, index) => {
                                    return (
                                        <Colxx xxs="3" key={index}>
                                            <Product product={product} />
                                        </Colxx>
                                    )
                                })
                            }
                        </>

                    ) : <h1 >Không tìm thấy sản phẩm nào!</h1>
                    }
                </Row>
            </>

        );
    }
}

export default injectIntl(Filter);