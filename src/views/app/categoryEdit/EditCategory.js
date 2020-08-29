import React, { Component, Fragment } from 'react';
import { Row, Card, CardBody, CardTitle, Input, Label, CardFooter, Button } from 'reactstrap';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { CATEGORIES } from '../../../constants/api';
import ApiController from '../../../helpers/Api';

class Category extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
        };
        this.messages = this.props.intl.messages;
    }

    //   componentDidMount() {
    //     this.getCategories();
    //   }

    //   getCategories = () => {
    //     ApiController.get(CATEGORIES.allEdit, {}, data => {
    //       console.log("AAAAA" + data);
    //       this.setState({ categories: data });
    //     });
    //   }

    render() {
        if (this.props.cateId) {
        }
        return (
            <div>
                <Fragment>
                    {/* {
          this.renderCategories()
        } */}
                    <Row>
                        <Colxx xxs="12">

                        </Colxx>
                    </Row>

                </Fragment>
            </div>
        );
    }
}

export default injectIntl(Category);