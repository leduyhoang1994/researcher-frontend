import React from 'react';
import { injectIntl } from 'react-intl';
import { Row } from 'reactstrap';
import { Fragment } from 'react';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { PRODUCT_SELLER } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import ProductList from '../product/ProductList';
import Category from '../category/Category';

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

        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getProducts();
    }

    getProducts = () => {
        let level = (this.state.cate.get("lvl"));
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
            categoryEditNameLv1: categoryLv1,
            categoryEditNameLv2: categoryLv2,
            categoryEditNameLv3: categoryLv3,
            page: 0,
            size: 10
        }, data => {
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
        return (
            <Fragment>
                <Row >
                    <Colxx xxs="3" style={{ background: "white", padding: "0px !important" }}>
                        <Category getProductByCategory={this.getProducts} />
                    </Colxx>
                    <Colxx xxs="9" style={{ borderLeft: "2px solid #eee", background: "white" }}>
                        <ProductList products={products} />
                    </Colxx>
                </Row>


            </Fragment>
        );
    }
}

export default injectIntl(Homepage);