import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { CATEGORIES } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import Breadcrumb from "../../../containers/navs/Breadcrumb";

class EditCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setId: this.props.match.params.id,
            category: []
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.loadCurrentCategory();
    }

    loadCurrentCategory = () => {
        const { setId } = this.state;
        this.getCategories(setId);
    }

    getCategories = (setId) => {
        ApiController.get(`${CATEGORIES.allEdit}/${setId}`, {}, data => {
            console.log("BBBBB" + JSON.stringify(data));
            this.setState({ category: data });
        });
    }

    render() {
        // if (this.props.cateId) {
        // }
        return (
            <div>
                <Fragment>
                    {/* {
          this.renderCategories()
        } */}   
                    <Row>
                        <Colxx xxs="12">
                            {console.log(this.props.match)}
                            <Breadcrumb heading="menu.category" match={this.props.match} />
                        </Colxx>
                    </Row>
                    <div></div>
                    <Row>
                        <Colxx xxs="12">

                        </Colxx>
                    </Row>

                </Fragment>
            </div>
        );
    }
}

export default injectIntl(EditCategory);