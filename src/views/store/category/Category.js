import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { ReactTableAdvancedCard } from "../../../containers/ui/ReactTableCards";
import { CATEGORY_SELLER } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { Link } from 'react-router-dom';

const items = [
    {
        label: 'Đồ gia dụng',
        items: [
            {
                label: 'Statements',
                items: [
                    {
                        label: 'Statements',
                    },
                    {
                        label: 'Statements',
                    },
                    {
                        label: 'Statements',
                    },
                ],
            },
            { name: 'reports', label: 'Reports' },
        ],
    },
    {
        label: 'Đồ gia dụng',
        items: [
            {
                label: 'Statements',
                items: [
                    {
                        label: 'Statements',
                    },
                    {
                        label: 'Statements',
                    },
                    {
                        label: 'Statements',
                    },
                ],
            },
            { name: 'reports', label: 'Reports' },
        ],
    }
]
class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            categoriesLv1: [],
            categoriesLv2: [],
            categoriesLv3: []
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getCategories();
        this.convertDate();
    }

    getItem = (items, category) => {
        let i = -1;
        console.log(items);
        items.map((item, index) => {
            console.log(item.name + " " + index + " " + category);
            if (item.name === category) {
                i = index;
            }
        })
        return i;
    }

    convertDate = () => {
        const { categories, categoriesLv1, categoriesLv2, categoriesLv3 } = this.state;
        // categoriesLv1.forEach(cateLv1 => {
        //     categoriesLv2.forEach(categoriesLv2 => {
        //         categories.forEach(item => {
        //             // if(cateLv1 === item.nameLv1 )
        //         })
                
        //     })
        // })
    }

    getCategories = () => {
        ApiController.get(CATEGORY_SELLER.all, {}, data => {
            console.log(data);
            let categoriesLv1 = [];
            let categoriesLv2 = [];
            let categoriesLv3 = [];
            data.forEach(item => {
                if (!categoriesLv1.includes(item.nameLv1)) categoriesLv1.push(item.nameLv1);
                if (!categoriesLv2.includes(item.nameLv2)) categoriesLv2.push(item.nameLv2);
                if (!categoriesLv3.includes(item.nameLv3)) categoriesLv3.push(item.nameLv3);
            }, () => {
                this.setState({
                    categories: data,
                    categoriesLv1: categoriesLv1,
                    categoriesLv2: categoriesLv2,
                    categoriesLv3: categoriesLv3
                })
            })
            //  () => {
            //     const categories = this.state.categories;
            //     let items = [];
            //     let categoryLv1 = "";
            //     let categoryLv2 = "";
            //     let arr = [];
            //     categories.map(category => {
            //         let obj = {};
            //         if (categoryLv1 !== category.nameLv1 && !arr.includes(category.nameLv1)) {
            //             obj = { name: category.nameLv1, label: category.nameLv1 };
            //             obj.items = [
            //                 {
            //                     name: category.nameLv2,
            //                     label: category.nameLv2,
            //                     items: [
            //                         {
            //                             name: category.nameLv3,
            //                             label: category.nameLv3,
            //                             id: category.id
            //                         }
            //                     ]
            //                 }
            //             ];
            //             items.push(obj);
            //             categoryLv1 = category.nameLv1;
            //             arr.push(category.nameLv1);
            //         } else {
            //             let index = this.getItem(items, category.nameLv1);
            //             obj = items[index];
            //             console.log("Start......");
            //             let indexLv2 = this.getItem(obj.items, category.nameLv2);
            //             let value = obj.items[indexLv2];
            //             console.log(indexLv2);
            //             console.log(value);
            //             if (obj.items.name !== category.nameLv2) {
            //                 let item = {
            //                     name: category.nameLv2, label: category.nameLv2, items: [
            //                         { name: category.nameLv3, label: category.nameLv3, id: category.id }
            //                     ]
            //                 }
            //                 obj.items = [];
            //                 obj.items.push(item);
            //                 categoryLv2 = category.nameLv2;
            //             } else {
            //                 obj.items.items.push([{ name: category.nameLv3, label: category.nameLv3, id: category.id }]);
            //             }
            //             items[index] = obj;

            //         }
            //     })
            //     // console.log(items[0]);
            //     console.log(items);
            // });
        })
    }


    render() {
        return (
            <div>

            </div>
        );
    }
}

export default injectIntl(Category);