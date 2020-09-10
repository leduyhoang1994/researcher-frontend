import React from 'react';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { Link, NavLink } from 'react-router-dom';
import "./style.scss";
import { Card, CardBody, Badge, CardSubtitle, CardText, CardImg } from 'reactstrap';

const Product = (props) => {
    const product = props.product;

    const borderImage = {
        height: "250px",
        width: "100%",
        position: "relative",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "table-cell",
        textAlign: "center",
        verticalAlign: "middle",
    }
    const image = {
        height: "auto",
        width: "auto",
        maxHeight: "auto",
        maxWidth: "100%",
        display: "block",
        position: "relative",
    }
    const productName = {
        fontSize: "20pt",
        padding: "10px 0",
    }
    const price = {
        display: "inline-block",
        width: "50%",
        textAlign: "center",
    }

    return (
        <Card className="mb-4 product">
            <NavLink to={"/store/products/detail/" + product.id}>
                <div className="position-relative">
                    <CardImg top src={product.featureImage} alt="Card image cap" />
                    {
                        /* 
                            <Badge color="primary" pill className="position-absolute badge-top-left">NEW</Badge>
                            <Badge color="secondary" pill className="position-absolute badge-top-left-2">TRENDING</Badge> 
                        */
                    }
                </div>
                <CardBody className="product-body">
                    <CardSubtitle className="mb-2 product-subtitle">{product.name}</CardSubtitle>
                    {/* <CardText className="product-price font-weight-bold text-left text-normal mb-0">{product.priceMin}</CardText> */}
                    <CardText className="product-price font-weight-bold text-right text-normal mb-0">{product.priceMax}</CardText>
                </CardBody>
            </NavLink>

        </Card>
        // <div style={{textAlign:"center"}} className="product">
        //     <Link style={{ width: "100%" }} to={`products/detail/${product.id}`}>
        //         <span style={borderImage}>
        //             <img style={image} src={product.featureImage} alt={"avatar"} />
        //         </span>
        //         <p style={productName}>{product.name}</p>
        //         <div >
        //             <span style={price}>{product.priceMin}</span>
        //             <span style={price}>{product.priceMax}</span>
        //         </div>

        //     </Link>
        // </div>
    );
};

export default injectIntl(Product);