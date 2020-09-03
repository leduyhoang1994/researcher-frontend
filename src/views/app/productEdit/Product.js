import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { ReactTableAdvancedCard } from "../../../containers/ui/ReactTableCards";
import { CATEGORIES } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import { Link } from 'react-router-dom';

class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: []
        };
        this.messages = this.props.intl.messages;
    }

    render() {
        return (
            <div>
                <Fragment>
                    <Row>
                        <Colxx xxs="12">
                            <Breadcrumb heading="Tìm kiếm sản phẩm" match={this.props.match} />
                            <Separator className="mb-5" />
                        </Colxx>
                    </Row>
                    <Row className="mb-4">
                        <Colxx xxs="12">
                            <Card>
                                <CardBody>
                                    <CardTitle>
                                        {__(this.messages, 'Bộ lọc')}
                                    </CardTitle>

                                    <Row>
                                        <Colxx xxs="12">
                                            <Label className="form-group has-float-label">
                                                <Input
                                                    type="text"
                                                    onChange={e => {
                                                        this.setState({
                                                            search: e.target.value
                                                        });
                                                    }}
                                                />
                                                <span>
                                                    {__(this.messages, "Tên sản phẩm")}
                                                </span>
                                            </Label>
                                        </Colxx>
                                    </Row>

                                    <Row>
                                        <Colxx xxs="12">
                                            <Label className="form-group has-float-label">
                                                <Select
                                                    filterOption={createFilter({ ignoreAccents: false })}
                                                    isMulti
                                                    options={this.state.categoryOptions}
                                                    getOptionValue={option => option.id}
                                                    getOptionLabel={option => option.categoryNameViLevel3}
                                                    value={this.state.categoriesFilter}
                                                    onChange={e => {
                                                        this.setState({
                                                            categoriesFilter: e
                                                        });
                                                    }}
                                                />
                                                <span>
                                                    {__(this.messages, "Thư mục")}
                                                </span>
                                            </Label>
                                        </Colxx>
                                    </Row>
                                </CardBody>
                                <CardFooter className="text-right">
                                    <Button
                                        onClick={this.searchProducts}
                                    >
                                        {__(this.messages, "Tìm kiếm")}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Colxx>
                    </Row>
                    <Row>
          <Colxx xxs="12">
            <Card>
              
            </Card>
          </Colxx>
        </Row>

                </Fragment>
            </div>
        );
    }
}

export default injectIntl(Product);