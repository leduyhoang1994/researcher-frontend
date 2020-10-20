import React from 'react';
import { numberFormat, numberWithCommas } from "../../../helpers/Utils";
import { injectIntl } from 'react-intl';
import {  NavLink } from 'react-router-dom';
import "./style.scss";
import { Card, CardBody, CardSubtitle, CardText } from 'reactstrap';
import { defaultImg, loadingSpinnerImg } from '../../../constants/defaultValues';

// const addToCart = products => {
//     const { id, name, featureImage, internalPrice, price } = products;
//     const quantity = 1;
//     const product = { id, name, featureImage, internalPrice, price, quantity };

//     let cart = localStorage.getItem("cart");

//     cart = cart ? JSON.parse(cart) : [];

//     const found = cart.find(pr => {
//         return pr.id === product.id
//     })

//     if (!found) {
//         cart.push(product);
//     }

//     localStorage.setItem("cart", JSON.stringify(cart));
// };

class Product extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.props.intl.messages;
        this.state = {
            width: 0,
            isAddedToCart: false
        }
        this.imgRef = React.createRef();
    }

    innerDimensions = (node) => {
        var computedStyle = getComputedStyle(node)

        let width = node.clientWidth // width with padding
        let height = node.clientHeight // height with padding

        height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
        width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
        return { height, width }
    }

    componentDidMount() {
        const width = this.innerDimensions(document.getElementById('wtf')).width;
        this.setState({
            width
        })
    }

    setDefaultImage(linkImg, e) {
        if (linkImg.search(defaultImg) !== -1) {
            e.target.onError = null;
        } else {
            e.target.src = defaultImg;
        }
    }

    imgOnError = (e) => {
        const linkImg = e.target.src || "";
        setTimeout(this.setDefaultImage(linkImg, e), 500)
    }

    render() {
        const { product } = this.props;

        return (
            <Card
                id="wtf"
                className="mb-4 product"
            >
                <NavLink to={"/store/products/detail/" + product.id}>
                    <div
                        className="position-relative"
                        style={{
                            height: `${this.state.width}px`,
                        }}
                    >
                        <img
                            ref={e => {
                                this.imgRef = e;
                            }}
                            width="100%"
                            height="100%"
                            onError={this.imgOnError}
                            onLoad={() => {
                                this.imgRef.style.backgroundImage = null;
                            }}
                            style={{
                                backgroundImage: `url(${loadingSpinnerImg})`,
                                backgroundSize: "contain",
                                objectFit: "contain",
                            }} 
                            src={`${process.env.REACT_APP_MEDIA_BASE_PATH}${product.featureImage}`} alt="Card img" />
                    </div>
                    <CardBody className="product-body mt-3">
                        <CardSubtitle title={product.name} className="font-weight-bold mb-2 product-subtitle">
                            {product.name}
                        </CardSubtitle>
                        {/* <CardText className="product-price font-weight-bold text-left text-normal mb-0">{product.internalPrice}</CardText> */}
                        <CardText className="product_price font-weight-bold text-right text-normal mb-0">{product?.price ? (`${numberWithCommas(Number.parseFloat(product?.price).toFixed(0))} đ`) : null}</CardText>
                        <CardText className="text-left text-normal mb-0">Khối lượng {numberFormat(Number.parseFloat(product.weight), 3, ".", ",")} kg</CardText>
                        <CardText className="text-left text-normal mb-0">Phí ship nội địa {numberFormat(Number.parseFloat(product.serviceCost), 0, ",", ".")} đ</CardText>
                    </CardBody>
                </NavLink>
            </Card>
        );
    }
}

export default injectIntl(Product);