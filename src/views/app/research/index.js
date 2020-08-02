import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Button, CardFooter, CardHeader } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import Filter from '../filter/Filter';
import Category from '../category/Category';
import ApiController from '../../../helpers/Api';
import { CATEGOIES } from '../../../constants/api';
import { NotificationManager } from '../../../components/common/react-notifications';
import { SITE_LIST } from '../../../constants/data';

class Research extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterOptions: {},
            categories: []
        };
        this.messages = this.props.intl.messages;
    }

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
        ApiController.call("POST", CATEGOIES.all, filterOptions, data => {
            this.setState({
                categories: data
            });
        });
    }

    render() {
        console.log(this.state.categories);
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="Research" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Colxx xxs="12">
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    {__(this.messages, "Lọc top thư mục")}
                                </CardTitle>
                                <Filter
                                    setFilterOptions={this.setFilterOptions}
                                />
                            </CardBody>
                            <CardFooter className="text-right">
                                <Button
                                    className="mr-2"
                                    color="warning"
                                >
                                    {__(this.messages, "Lưu bộ lọc")}
                                </Button>
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
                                    {__(this.messages, "Danh sách top thư mục")}
                                </CardTitle>
                                <Category
                                    categories={this.state.categories}
                                />
                            </CardBody>
                            <CardFooter className="text-right">
                                <Button
                                    className="mr-2"
                                    color="warning"
                                >
                                    {__(this.messages, "Lưu danh sách thư mục")}
                                </Button>
                                <Button
                                    color="primary"
                                >
                                    {__(this.messages, "Tìm sản phẩm")}
                                </Button>
                            </CardFooter>
                        </Card>
                    </Colxx>
                </Row>
            </Fragment>
        );
    }
}

export default injectIntl(Research);