import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Button, CardFooter, Modal, CardHeader, ModalHeader, ModalTitle, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import IntlMessages from "../../../helpers/IntlMessages";
import Filter from '../filter/Filter';
import Category from '../category/Category';
import ApiController from '../../../helpers/Api';
import { CATEGORIES } from '../../../constants/api';
import { NotificationManager } from '../../../components/common/react-notifications';
import { SITE_LIST } from '../../../constants/data';
import categoriesData from '../../../data/categories';
import { Redirect } from 'react-router-dom';
import { arrayColumn } from '../../../helpers/Utils';
import RadioButton from './modal';

class Research extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterOptions: {},
            categories: [],
            selectedCats: [],
            redirect: false,
            cateSetList: [],
            isOpenModal: false,
            isOpenRadio: false,
            isShow: false,
            radioValue: "first-radio",
            cateSetName: "",
            selected: ""
        };
        this.messages = this.props.intl.messages;
    }

    existInSelectedCats = (cate) => {
        const { selectedCats } = this.state;
        let exist = false;
        selectedCats.forEach(selectedCat => {
            if (JSON.stringify(selectedCat) === JSON.stringify(cate)) {
                exist = true;
                return false;
            }
        });
        return exist;
    }

    addToSelectedCats = (cate) => {
        const { selectedCats } = this.state;
        let exist = this.existInSelectedCats(cate);
        if (!exist) {
            selectedCats.push(cate);
        }

        this.setState({
            selectedCats: selectedCats
        });
    };

    removeFromSelectedCats = (cate) => {
        let { selectedCats } = this.state;

        selectedCats = selectedCats.filter(selectedCat => {
            return JSON.stringify(selectedCat) !== JSON.stringify(cate);
        });

        this.setState({
            selectedCats: selectedCats
        });
    };

    setFilterOptions = (filters) => {
        this.setState({
            filterOptions: filters
        });
    }

    filter = () => {
        const { filterOptions } = this.state;
        if (Object.keys(filterOptions).length === 0) {
            NotificationManager.error("Bạn cần chọn top thư mục của ít nhất 1 sàn", "Không thành công");
            return;
        }
        ApiController.call("POST", CATEGORIES.filter, filterOptions, data => {
            this.setState({
                categories: data
            });
        });

        // const result = {};

        // filterOptions.topCates.forEach(parentSite => {
        //     if (parentSite.top) {
        //         let parentSiteTop = parentSite.top;
        //         result[parentSite.code] = categoriesData.filter(data => {
        //             if (data.countrySite === parentSite.code) {
        //                 parentSiteTop--;
        //             }
        //             return data.countrySite === parentSite.code && parentSiteTop >= 0;
        //         });
        //     }
        //     if (parentSite.sites) {
        //         parentSite.sites.forEach(site => {
        //             if (site.top) {
        //                 let siteTop = site.top;
        //                 result[site.code] = categoriesData.filter(data => {
        //                     if (data.site === site.code) {
        //                         siteTop--;
        //                     }
        //                     return data.site === site.code && siteTop >= 0;
        //                 });
        //             }
        //         });
        //     }
        // });

        // console.log(result);

        // this.setState({
        //     categories: result
        // });
    }

    redirectTo = (url) => {
        this.setState({
            redirect: url
        })
    };

    loadCateSets = () => {
        ApiController.get(CATEGORIES.set, {}, data => {
            this.setState({ cateSetList: data });
        });
    }

    cateSetName = (data) => {
        this.setState({ cateSetName: data });
    }
    
    handleChangeCate = (data) => {
        console.log(data);
        this.setState({ selected: data });
    }

    handleChange = (data) => {
        this.setState({ radioValue: data });
    }

    toggleRadioModal = () => {
        const isOpen = this.state.isOpenRadio;
        if(!isOpen) {
            this.loadCateSets();
        }
        this.setState({ isOpenRadio: !isOpen });
    }

    createCategoriesSet = () => {
        const { selectedCats } = this.state;

        const cateName = this.state.cateSetName;
        console.log(cateName);

        if (cateName == null || cateName === []) {
            return;
        }

        const cateIds = arrayColumn(selectedCats, "id");
        ApiController.post(CATEGORIES.set, {
            setName: cateName,
            ids: cateIds
        }, data => {
            NotificationManager.success("Thành công", "Thành công");
        });

        return <Modal>

        </Modal>
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={`${this.state.redirect}`} />;
        }
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="Ngành hàng" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12">
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    {__(this.messages, "Lọc top ngành hàng")}
                                </CardTitle>
                                <Filter
                                    setFilterOptions={this.setFilterOptions}
                                />
                            </CardBody>
                            <CardFooter className="text-right">
                                {/* <Button
                                    className="mr-2"
                                    color="warning"
                                >
                                    {__(this.messages, "Lưu bộ lọc")}
                                </Button> */}
                                <Button
                                    color="primary"
                                    onClick={this.filter}
                                >
                                    {__(this.messages, "Lọc")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </Colxx>
                </Row>
                <Row className="mt-4">
                    <Colxx xxs="12">
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    {__(this.messages, "Danh sách top ngành hàng")}
                                </CardTitle>
                                <Category
                                    categories={this.state.categories}
                                    addToSelectedCats={this.addToSelectedCats}
                                    removeFromSelectedCats={this.removeFromSelectedCats}
                                    existInSelectedCats={this.existInSelectedCats}
                                />
                            </CardBody>
                            <CardFooter className="text-right">
                                <Button
                                    className="mr-2"
                                    color="warning"
                                    onClick={() => {
                                        this.toggleRadioModal();
                                    }}
                                >
                                    {__(this.messages, "Lưu danh sách ngành hàng")}
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={e => {
                                        localStorage.setItem('selectedItems', JSON.stringify(this.state.selectedCats));
                                        this.redirectTo("/app/products");
                                    }}
                                >
                                    {__(this.messages, "Tìm sản phẩm")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </Colxx>
                </Row>
                
                <RadioButton
                    isOpenRadio={this.state.isOpenRadio}
                    toggleRadioModal={this.toggleRadioModal}
                    handleChange={this.handleChange}
                    dataOptions={this.state.cateSetList}
                    radioValue={this.state.radioValue}
                    createCateSet={this.createCategoriesSet}
                    cateSetName={this.cateSetName}
                    handleChangeCate={this.handleChangeCate}
                />
            </Fragment>
        );
    }
}
export default injectIntl(Research);