import React, { Component, Fragment } from "react";
import {
  Pagination, PaginationItem, PaginationLink,
  UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem
} from "reactstrap";
import { injectIntl } from "react-intl";
import { __ } from "../../helpers/IntlMessages";

class ResourceTablePagination extends Component {
  constructor(props) {
    super(props);

    this.getSafePage = this.getSafePage.bind(this);
    this.changePage = this.changePage.bind(this);
    this.applyPage = this.applyPage.bind(this);
    this.pageClick = this.pageClick.bind(this);
    this.renderPages = this.renderPages.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.renderPageJump = this.renderPageJump.bind(this);
    
    this.messages = this.props.intl.messages;

    this.state = {
      current_page: props.current_page,
      pageSize: this.props.defaultPageSize
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      current_page: props.current_page,
      pageSize: props.defaultPageSize
    };
  }

  getSafePage(page) {
    if (Number.isNaN(page)) {
      page = this.props.current_page;
    }
    return Math.min(Math.max(page, 1), this.props.pages);
  }

  changePageSize(size) {
    this.props.onPageSizeChange(size);
    this.setState({ pageSize: size });
  }

  changePage(page) {
    page = this.getSafePage(page);
    this.setState({ page });
    if (this.props.current_page !== page) {
      this.props.onPageChange(page);
    }
  }

  applyPage(e) {
    if (e) {
      e.preventDefault();
    }
    const page = this.state.current_page;
    this.changePage(page === "" ? this.props.current_page : page);
  }

  pageClick(pageIndex) {
    this.changePage(pageIndex);
  }

  renderPages() {
    let pageCount = this.props.pages;
    let pageButtons = [];
    const buttonSize = 5;
    const { current_page } = this.props;

    // pageButtons.push(
    //   <PaginationItem key={i} active={active}>
    //     <PaginationLink> . . . </PaginationLink>
    //   </PaginationItem>
    // );
    for (let i = 1; i <= pageCount; i++) {
      let active = this.state.current_page === i ? true : false;
      if (pageCount > 10) {
        // if (i <= ((buttonSize - 1) / 2)) {

        // }
        if (i >= (current_page - ((buttonSize - 1) / 2)) && i <= (current_page + ((buttonSize - 1) / 2))) {
          pageButtons.push(
            <PaginationItem key={i} active={active}>
              <PaginationLink
                onClick={() => this.pageClick(i)}
              >{i}</PaginationLink>
            </PaginationItem>
          );
        }
        continue;
      }
      pageButtons.push(
        <PaginationItem key={i} active={active}>
          <PaginationLink
            onClick={() => this.pageClick(i)}
          >{i}</PaginationLink>
        </PaginationItem>
      );
    }
    return pageButtons;
  }

  renderPageJump() {
    let pages = this.props.pages;
    let pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
      pageNumbers.push(
        <DropdownItem
          key={i}
          onClick={() => this.changePage(i)}
        >
          {i}
        </DropdownItem>
      );
    }
    return pageNumbers;
  }

  render() {
    const {
      current_page: page,
      pages,
      pageSizeOptions,
      showPageSizeOptions,
      showPageJump
    } = this.props;
    
    const canPrevious = page > 1;
    const canNext = page < pages;

    return (
      <Fragment>
        <div className="text-center">
          {
            showPageJump &&
            <div className="float-left pt-2"><span>{__(this.messages, "Trang")} </span>
              <UncontrolledDropdown className="d-inline-block">
                <DropdownToggle caret color="outline-primary" size="xs">
                  {this.state.current_page}
                </DropdownToggle>
                <DropdownMenu direction="left" >
                  {this.renderPageJump()}
                </DropdownMenu>
              </UncontrolledDropdown>
              <span> / </span>{pages}</div>
          }

          <Pagination className="d-inline-block" size="sm" listClassName="justify-content-center" aria-label="Page navigation example">
            <PaginationItem className={`${!canPrevious && "disabled"}`}>
              <PaginationLink
                className={"prev"}
                onClick={() => {
                  if (!canPrevious) return;
                  this.changePage(1);
                }}
                disabled={!canPrevious}>
                {__(this.messages, "Đầu")}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem className={`${!canPrevious && "disabled"}`}>
              <PaginationLink
                className={"prev"}
                onClick={() => {
                  if (!canPrevious) return;
                  this.changePage(page - 1);
                }}
                disabled={!canPrevious}>
                <i className="simple-icon-arrow-left" />
              </PaginationLink>
            </PaginationItem>

            {this.renderPages()}
            <PaginationItem className={`${!canNext && "disabled"}`}>
              <PaginationLink
                className="next"
                onClick={() => {
                  if (!canNext) return;
                  this.changePage(page + 1);
                }}
                disabled={!canNext}>
                <i className="simple-icon-arrow-right" />
              </PaginationLink>
            </PaginationItem>
            <PaginationItem className={`${!canNext && "disabled"}`}>
              <PaginationLink
                className={"prev"}
                onClick={() => {
                  if (!canNext) return;
                  this.changePage(pages);
                }}
                disabled={!canNext}>
                {__(this.messages, "Cuối")}
              </PaginationLink>
            </PaginationItem>
          </Pagination>
          {
            showPageSizeOptions &&
            <div className="float-right pt-2">
              <span className="text-muted text-small mr-1">{__(this.messages, "Hiển")} </span>
              <UncontrolledDropdown className="d-inline-block">
                <DropdownToggle caret color="outline-primary" size="xs">
                  {this.state.pageSize}
                </DropdownToggle>
                <DropdownMenu right>
                  {pageSizeOptions.map((size, index) => {
                    return (
                      <DropdownItem
                        key={index}
                        onClick={() => this.changePageSize(size)}
                      >
                        {size}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          }
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(ResourceTablePagination);