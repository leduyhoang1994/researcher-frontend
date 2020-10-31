import { isFunction } from "formik";
import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Select from "react-select";
import { Input, Label, Row } from "reactstrap";
import { Colxx } from "../../../../components/common/CustomBootstrap";
import { __ } from "../../../../helpers/IntlMessages";
import ManualCrawl1688 from "./1688";

class ManualCrawl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceType: null
    };

    this.allowCrawl = [
      {
        label: "1688",
        value: "1688"
      }
    ];

    this.messages = this.props.intl.messages;
  }

  crawledCallback = (product) => {
    const {crawledCallback} = this.props;

    if (isFunction(crawledCallback)) {
      crawledCallback(product);
    }
  }

  renderCrawl = () => {
    const { sourceType } = this.state;
    console.log(sourceType);
    switch (sourceType) {
      case "1688":
        return <ManualCrawl1688
          crawledCallback={this.crawledCallback}
        />

      default:
        return null;
    }
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="6">
            <Label className="form-group has-float-label">
              <Select
                className="react-select"
                classNamePrefix="react-select"
                options={this.allowCrawl}
                onChange={(selectedObject) => {
                  this.setState({ sourceType: selectedObject.value });
                }}
              />
              <span>
                {__(this.messages, "Nguồn sản phẩm")}
              </span>
            </Label>
          </Colxx>
        </Row>
        { this.renderCrawl()}
      </Fragment>
    );
  }
}

export default injectIntl(ManualCrawl);