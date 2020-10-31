import { isFunction } from "formik";
import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Select from "react-select";
import { Button, Input, Label, Row } from "reactstrap";
import { Colxx } from "../../../../components/common/CustomBootstrap";
import { NotificationManager } from "../../../../components/common/react-notifications";
import { CRAWL_1688 } from "../../../../constants/api";
import ApiController from "../../../../helpers/Api";
import { __ } from "../../../../helpers/IntlMessages";

class ManualCrawl1688 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productId: "",
      isCrawling: false
    };

    this.messages = this.props.intl.messages;
  }

  getProductIdFromURL = (url) => {
    const regex = /^https:\/\/detail\.1688\.com\/offer\/(\d+).html/g;
    const res = regex.exec(url);
    return res ? res[1] : "";
  }

  setCrawling = (value) => {
    this.setState({ isCrawling: value });
  }

  crawl = () => {
    const { productId } = this.state;
    const { crawledCallback } = this.props;
    this.setCrawling(true);
    ApiController.post(CRAWL_1688, {
      id: productId
    }, data => {
      NotificationManager.success(
        "Crawl sản phẩm thành công",
        "Thành công",
        3000,
        null,
        null,
        ""
      );
      this.setCrawling(false);

      if (isFunction(crawledCallback)) {
        crawledCallback(data);
      }
    }, {
      errorCallback: (error) => {
        this.setCrawling(false);
        NotificationManager.warning(
          "Vui lòng thử lại",
          "Crawl không thành công",
          3000,
          null,
          null,
          ""
        );
      }
    });
  }

  render() {
    const { isCrawling } = this.state;
    return (
      <>
        <Row>
          <Colxx xxs="6">
            <Label className="form-group has-float-label">
              <Input
                type="text"
                disabled={isCrawling}
                className="form-control"
                defaultValue=""
                onChange={e => {
                  this.setState({
                    productId: this.getProductIdFromURL(e.target.value)
                  })
                }}
              />
              <span>
                {__(this.messages, "Link sản phẩm")}
              </span>
            </Label>
          </Colxx>
          <Colxx xxs="6">
            <Label className="form-group has-float-label">
              <Input
                disabled={isCrawling}
                type="text"
                className="form-control"
                value={this.state.productId}
                onChange={e => {
                  this.setState({
                    productId: e.target.value
                  })
                }}
              />
              <small className="form-text text-muted">{__(this.messages, "Hệ thống sẽ sử dụng ID sản phẩm để crawl dữ liệu")}</small>
              <span>
                {__(this.messages, "ID sản phẩm")}
              </span>
            </Label>
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12">
            <Button
              disabled={isCrawling}
              onClick={this.crawl}
            >
              {__(this.messages, "Crawl")}
            </Button>
          </Colxx>
        </Row>
      </>
    );
  }
}

export default injectIntl(ManualCrawl1688);