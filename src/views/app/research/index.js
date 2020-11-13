import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Button, CardFooter } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import Filter from '../filter/Filter';
import SourceCategories from '../source-category/SourceCategories';
import ApiController from '../../../helpers/Api';
import { CATEGORY_SETS, SOURCE_CATEGORIES } from '../../../constants/api';
import { NotificationManager } from '../../../components/common/react-notifications';
import { Redirect } from 'react-router-dom';
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
            cateSetName: "",
            isSiteCodeCheckAll: {},
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

    getItemOfObject = (key, obj) => {
        for (let index in obj) {
            if (index === key) {
                return { source: obj[index] };
            }
        }
        return null;
    }

    addToSelectedCats = (cate) => {
        let exist = this.existInSelectedCats(cate);
        if (!exist) {
            const { selectedCats, categories, } = this.state;
            const { site } = cate;
            const { source } = this.getItemOfObject(site, categories);
            const countSource = source.filter(function (item) {
                if (item.id) {
                    return true;
                } else {
                    return false;
                }
            }).length;

            selectedCats.push(cate);
            let countSelectedCate = 0;
            selectedCats.forEach(item => {
                if(item.site === site) {
                    countSelectedCate++;
                }
            })

            if(countSource === countSelectedCate) {
                this.setSelectAll(site, true);
            }
            
            this.setState({
                selectedCats: selectedCats
            });
        }
    };

    removeFromSelectedCats = (cates) => {
        let { selectedCats, isSiteCodeCheckAll } = this.state;

        let newCates = []

        if (!Array.isArray(cates)) newCates.push(cates);
        else newCates = [...cates]

        for (const cate of newCates) {
            selectedCats = selectedCats.filter(selectedCat => {
                return JSON.stringify(selectedCat) !== JSON.stringify(cate);
            });

            delete isSiteCodeCheckAll[cate['site']]
        }

        this.setState({
            isSiteCodeCheckAll: isSiteCodeCheckAll,
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
            NotificationManager.error("Bạn cần chọn top ngành hàng của ít nhất 1 sàn", "Không thành công");
            return;
        }

        ApiController.call("POST", SOURCE_CATEGORIES.filter, filterOptions, data => {
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


    setSelectAll = (siteCode, checked) => {
        const { categories } = this.state
        const selectedData = categories[siteCode]

        if (checked === true) {
            for (const data of selectedData) {
                this.addToSelectedCats(data)
            }
            const isSiteCodeCheckAll = this.state.isSiteCodeCheckAll
            isSiteCodeCheckAll[siteCode] = siteCode
            this.setState({
                isSiteCodeCheckAll: isSiteCodeCheckAll
            })
        } else if (checked === false) {
            this.removeFromSelectedCats(selectedData)
            const isSiteCodeCheckAll = this.state.isSiteCodeCheckAll
            delete isSiteCodeCheckAll[siteCode]
            this.setState({
                isSiteCodeCheckAll: isSiteCodeCheckAll
            })
        }
    }

    loadCateSets = () => {
        ApiController.callAsync('get', CATEGORY_SETS.all, {})
            .then(data => {
                this.setState({ cateSetList: data.data.result });
            }).catch(error => {
                NotificationManager.warning(error.response.data.message, "Thất bại", 1000);
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
                                <SourceCategories
                                    categories={this.state.categories}
                                    addToSelectedCats={this.addToSelectedCats}
                                    removeFromSelectedCats={this.removeFromSelectedCats}
                                    existInSelectedCats={this.existInSelectedCats}
                                    setSelectAll={this.setSelectAll}
                                    isSiteCodeCheckAll={this.state.isSiteCodeCheckAll}
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
                                        this.redirectTo("/app/source-products");
                                    }}
                                >
                                    {__(this.messages, "Tìm sản phẩm")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </Colxx>
                </Row>

                <ResearchSetModal
                    key={this.state.isOpenRadio}
                    isOpenRadio={this.state.isOpenRadio}
                    toggleResearchSetModal={this.toggleResearchSetModal}
                    handleChange={this.handleChange}
                    cateSetName={this.cateSetName}
                    selectedCats={this.state.selectedCats}
                />
            </Fragment>
        );
    }
}
export default injectIntl(Research);