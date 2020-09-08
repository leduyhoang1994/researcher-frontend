import React from 'react';
import { Row } from 'reactstrap';
import { Colxx } from "../../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

const Product = (props) => {
    let product = props.product;
    const style = {
        textAlign: "center",
        border: "0.1rem solid #e8e8e8",
        margin: "0 15px",
        padding: "25px 0",
        backgroundColor: "white"
    }
    const image = {
        height: "150px",
        width: "auto"
    }
    const productName = {
        fontSize: "20pt",
    }
    const price = {
        display: "inline-block",
        width: "50%",
        textAlign: "center",
    }
    
    return (
        <Row style={style}>
            <Colxx xxs="12">
                <Link style={{ width: "100%" }} to={`/app/seller/detail/${product.id}`}>
                    <img style={image} src={product.featureImage} alt={"avatar"} />
                    <p style={productName}>{product.name}</p>
                    <div >
                        <span style={price}>{product.priceMin}</span>
                        <span style={price}>{product.priceMax}</span>
                    </div>

                </Link>
            </Colxx>
        </Row>
    );
};

export default injectIntl(Product);