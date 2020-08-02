import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { SITE_LIST } from '../../../constants/data';
import { isFunction } from 'formik';

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterOptions: this.props.filterOptions ? this.props.filterOptions : {
                topCates: SITE_LIST,
                topSale: {
                    min: "",
                    max: ""
                }
            }
        };
        this.messages = this.props.intl.messages;
    }

    renderSiteSelector = () => {
        const { filterOptions: { topCates }, filterOptions } = this.state;
        const { setFilterOptions } = this.props;
        return (
            <>
                <Row>
                    <Colxx>
                        <p>
                            <b>{__(this.messages, "1. Chọn top thư mục các sàn")}</b>
                        </p>
                    </Colxx>
                </Row>
                {
                    topCates.map((parentSite, index) => {
                        return (
                            <div key={`site-${parentSite.code}`}>
                                <Row>
                                    <Colxx xxs="6" className="vertical-center">
                                        <b>{parentSite.name}</b>
                                    </Colxx>
                                    <Colxx xxs="6">
                                        <Input
                                            value={parentSite.top}
                                            className="form-control"
                                            type="number"
                                            onChange={e => {
                                                filterOptions.topCates[index].top = e.target.value ? parseInt(e.target.value) : "";
                                                // if (filterOptions.topCates[index].sites) {
                                                //     filterOptions.topCates[index].sites.forEach(childSite => {
                                                //         childSite.top = e.target.value ? parseInt(e.target.value) : "";
                                                //     });
                                                // }
                                                this.setState({ filterOptions });

                                                if (isFunction(setFilterOptions)) {
                                                    setFilterOptions(filterOptions);
                                                }
                                            }}
                                        />
                                    </Colxx>
                                </Row>
                                {
                                    parentSite.sites && parentSite.sites.map((site, childIndex) => {
                                        return (
                                            <Row key={`site-${site.code}`}>
                                                <Colxx xxs="6" className="pl-5 vertical-center">
                                                    {site.name}
                                                </Colxx>
                                                <Colxx xxs="6">
                                                    <Input
                                                        value={site.top}
                                                        className="form-control"
                                                        type="number"
                                                        onChange={e => {
                                                            filterOptions.topCates[index].sites[childIndex].top = e.target.value ? parseInt(e.target.value) : "";
                                                            this.setState({ filterOptions });

                                                            if (isFunction(setFilterOptions)) {
                                                                setFilterOptions(filterOptions);
                                                            }
                                                        }}
                                                    />
                                                </Colxx>
                                            </Row>
                                        );
                                    })
                                }
                            </div>
                        );
                    })
                }
            </>
        );
    }

    renderTopSale = () => {
        const { filterOptions: { topCates }, filterOptions } = this.state;
        return (
            <>
                <Row>
                    <Colxx xxs="12">
                        <p>
                            <b>{__(this.messages, "2. Giới hạn top sale")}</b>
                        </p>
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12" md="6">
                        <Label>{__(this.messages, "Nhỏ nhất")}</Label>
                        <Input
                            value={filterOptions.topSale.min}
                            className="form-control"
                            type="number"
                            onChange={e => {
                                filterOptions.topSale.min = e.target.value ? parseInt(e.target.value) : "";
                                this.setState({ filterOptions });
                            }}
                        />
                    </Colxx>
                    <Colxx xxs="12" md="6">
                        <Label>{__(this.messages, "Lớn nhất")}</Label>
                        <Input
                            value={filterOptions.topSale.max}
                            className="form-control"
                            type="number"
                            onChange={e => {
                                filterOptions.topSale.max = e.target.value ? parseInt(e.target.value) : "";
                                this.setState({ filterOptions });
                            }}
                        />
                    </Colxx>
                </Row>
            </>
        );
    }

    render() {
        return (
            <div>
                <Row>
                    <Colxx xxs="12" md="6">
                        {
                            this.renderSiteSelector()
                        }
                    </Colxx>
                </Row>
                {
                    this.renderTopSale()
                }
            </div>
        );
    }
}

export default injectIntl(Filter);