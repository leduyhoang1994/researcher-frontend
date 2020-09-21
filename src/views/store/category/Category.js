import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { CATEGORY_SELLER } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import './Category.scss';
import SubMenuPopup from './SubMenuPopup';

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: {},
            subCategory: {},
            isLoading: true,
        };

        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories = () => {
        let { categories } = this.state;
        ApiController.get(CATEGORY_SELLER.all, {}, data => {
            const nestedCate = {};
            data.forEach(cate => {
                if (!nestedCate[cate.nameLv1]) {
                    nestedCate[cate.nameLv1] = {};
                }
                if (!nestedCate[cate.nameLv1][cate.nameLv2]) {
                    nestedCate[cate.nameLv1][cate.nameLv2] = {};
                }
                if (!nestedCate[cate.nameLv1][cate.nameLv2][cate.nameLv3]) {
                    nestedCate[cate.nameLv1][cate.nameLv2][cate.nameLv3] = cate.nameLv3;
                }
            });
            categories = nestedCate;
            this.setState({
                categories,
                isLoading: false
            });
        })
    }

    onFilterByCategory = (cate, level) => {
        window.open(`/store/${cate}?lvl=${level}`, "_self")
    }

    renderCateName = (categories, cate) => {
        //use for filtering
        // const fullPath = [...path, cate];
        return (
            <div className="mb-0 cateMenuLv1 d-flex" key={cate}>
                <div className="cateName"
                    onClick={() => {
                        this.onFilterByCategory(cate, 1)
                    }}>
                    {cate}
                </div>
                <div className="arrow-right-wrapper">
                    <div className="arrow-right"></div>
                </div>
                <SubMenuPopup
                    cate={categories[cate]}
                    onClickSubMenu={this.onFilterByCategory}
                />
            </div>
        );
    }


    renderLoading = () => {
        return (
            <div className="loading"></div>
        );
    }

    render() {
        const { categories, isLoading, subCategory } = this.state;

        if (isLoading) {
            return this.renderLoading();
        }

        return (
            <>
                <div className="cate-menu homepage-menu">
                    {
                        Object.keys(categories).map(category => {
                            return (
                                this.renderCateName(categories, category)
                            )
                        })
                    }
                </div>
            </>
        );
    }
}

export default injectIntl(Category);