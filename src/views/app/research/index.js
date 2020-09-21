import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Button, CardFooter } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import Filter from '../filter/Filter';
import Category from '../category/Category';
import ApiController from '../../../helpers/Api';
import { CATEGORIES } from '../../../constants/api';
import { NotificationManager } from '../../../components/common/react-notifications';
import { Redirect } from 'react-router-dom';
import { arrayColumn } from '../../../helpers/Utils';
import ResearchSetModal from './ResearchSetModal';
import { SITE_LIST } from '../../../constants/data';
import { isObject } from 'formik';

class Research extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterOptions: {
                topCates: SITE_LIST,
                topSale: {
                    min: "",
                    max: ""
                }
            },
            categories: [],
            selectedCats: [],
            redirect: false,
            cateSetList: [],
            isOpenModal: false,
            isOpenRadio: false,
            isShow: false,
            radioValue: "first-radio",
            cateSetName: ""
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

    validateFilterOptions() {
        const { filterOptions } = this.state;

        if (filterOptions) {
            for (const country of filterOptions.topCates) {
                if (isObject(country) && country.top !== "") {
                    return true
                }
                if (country.sites) {
                    for (const site of country.sites) {
                        if (isObject(site) && site.top !== "") {
                            return true
                        }
                    }
                }
            }
        }
        return false
    }

    filter = () => {
        const { filterOptions } = this.state;

        if (this.validateFilterOptions() === false) {
            NotificationManager.error("Bạn cần chọn top thư mục của ít nhất 1 sàn", "Không thành công");
            return;
        }

        ApiController.call("POST", CATEGORIES.filter, filterOptions, data => {
            this.setState({
                categories: data
            });
        });
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

    toggleResearchSetModal = () => {
        const isOpen = this.state.isOpenRadio;
        if (!isOpen) {
            this.loadCateSets();
        }
        this.setState({ isOpenRadio: !isOpen });
    }

    createCategoriesSet = (cateSet = null) => {
        const { selectedCats } = this.state;

        const cateSetName = this.state.cateSetName;

        if (cateSetName == null || cateSetName === []) {
            return;
        }
        const cateIds = arrayColumn(selectedCats, "id");

        if (cateSet) {
            //Add to existed cateSet
            ApiController.post(CATEGORIES.addToSet, {
                setId: cateSet.value,
                itemId: cateIds
            }, data => {
                NotificationManager.success("Thành công", "Thành công");
            });
        } else {
            //Create new cateSet
            ApiController.post(CATEGORIES.set, {
                setName: cateSetName,
                ids: cateIds
            }, data => {
                NotificationManager.success("Thành công", "Thành công");
            });
        }
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
                                    filterOptions={this.state.filterOptions}
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
                                        this.toggleResearchSetModal();
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

                <ResearchSetModal
                    isOpenRadio={this.state.isOpenRadio}
                    toggleResearchSetModal={this.toggleResearchSetModal}
                    handleChange={this.handleChange}
                    createCateSet={this.createCategoriesSet}
                    cateSetName={this.cateSetName}
                />
            </Fragment>
        );
    }
}
export default injectIntl(Research);