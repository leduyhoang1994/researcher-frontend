import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { ReactTableAdvancedCard } from "../../../containers/ui/ReactTableCards";
import { CATEGORY_SELLER } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { NavLink } from 'react-router-dom';
import './Category.scss';

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: {}
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
                categories
            });
        })
    }

    renderCateName = (cate, path) => {
        //use for filtering
        const fullPath = [...path, cate];
        return (
            <span className="list-item-heading mb-0 truncate w-40 w-xs-100  mb-1 mt-1">
                <span className="cursor-pointer hover display-block "
                onClick={() => this.props.getProductByCategory(fullPath)}
                >
                    {cate}
                </span>
            </span>
        );
    }

    renderCategoriesRecursive = (cate, name = null, path = []) => {
        const render = [];
        if (name) {
            path.push(name);
        }
        render.push(
            Object.keys(cate).map(subCate => {
                return (
                    <li key={cate + "-" + subCate}>
                        {this.renderCateName(subCate, path)}
                        {
                            typeof cate[subCate] === 'object' && (
                                <ul>
                                    {this.renderCategoriesRecursive(cate[subCate], subCate, path)}
                                </ul>
                            )
                        }
                    </li>
                )
            })
        );
        if (name) {
            path.pop();
        }

        if (name) {
            return render;
        } else {
            return (
                <ul>
                    {render}
                </ul>
            );
        }
    }

    render() {
        return (
            <div className="cate-menu homepage-menu">
                {
                    this.renderCategoriesRecursive(this.state.categories)
                }
            </div>
        );
    }
}

export default injectIntl(Category);