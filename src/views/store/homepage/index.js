import React from 'react';
import { injectIntl } from 'react-intl';
import { Card, CardBody, Row } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import IntlMessages from '../../../helpers/IntlMessages';
import { Fragment } from 'react';
import { Colxx } from '../../../components/common/CustomBootstrap';
import HomepageProduct from './HomepageProduct';

class Homepage extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.props.intl.messages;
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <Colxx md="3" xs="4" xxs="6">
                        <HomepageProduct
                            product={{
                                title: '2020 quần thể thao mới của phụ nữ quần ống rộng buộc chân chạy quần thể dục in mỏng nhanh khô quần yoga lưng cao',
                                price: 100000,
                                features: ['love', 'hate']
                            }}
                        />
                    </Colxx>
                    <Colxx md="3" xs="4" xxs="6">
                        <HomepageProduct
                            product={{
                                title: '2020 quần thể thao mới của phụ nữ quần ống rộng buộc chân chạy quần thể dục in mỏng nhanh khô quần yoga lưng cao',
                                price: 100000,
                                features: ['love', 'hate']
                            }}
                        />
                    </Colxx>
                    <Colxx md="3" xs="4" xxs="6">
                        <HomepageProduct
                            product={{
                                title: '2020 quần thể thao mới của phụ nữ quần ống rộng buộc chân chạy quần thể dục in mỏng nhanh khô quần yoga lưng cao',
                                price: 100000,
                                features: ['love', 'hate']
                            }}
                        />
                    </Colxx>
                    <Colxx md="3" xs="4" xxs="6">
                        <HomepageProduct
                            product={{
                                title: '2020 quần thể thao mới của phụ nữ quần ống rộng buộc chân chạy quần thể dục in mỏng nhanh khô quần yoga lưng cao',
                                price: 100000,
                                features: ['love', 'hate']
                            }}
                        />
                    </Colxx>
                    <Colxx md="3" xs="4" xxs="6">
                        <HomepageProduct
                            product={{
                                title: '2020 quần thể thao mới ưng cao',
                                price: 100000,
                                features: ['love', 'hate']
                            }}
                        />
                    </Colxx>
                    <Colxx md="3" xs="4" xxs="6">
                        <HomepageProduct
                            product={{
                                title: '2020 quần thể thao mới của phụ nữ quần ống rộng buộc chân chạy quần thể dục in mỏng nhanh khô quần yoga lưng cao',
                                price: 100000,
                                features: ['love', 'hate']
                            }}
                        />
                    </Colxx>
                </Row>
            </Fragment>
        );
    }
}

export default injectIntl(Homepage);