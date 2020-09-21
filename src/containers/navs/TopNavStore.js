import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Badge, Button } from "reactstrap";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Input
} from "reactstrap";

import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import {
  setContainerClassnames,
  clickOnMobileMenu,
  logoutUser,
  logoutSeller,
  changeLocale,
  changeCount
} from "../../redux/actions";

import {
  menuHiddenBreakpoint
} from "../../constants/defaultValues";

import { MobileMenuIcon, MenuIcon } from "../../components/svg";

import { getDirection, setDirection } from "../../helpers/Utils";

import "./TopNavStore.scss";

class TopNavStore extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isInFullScreen: false,
      searchKeyword: "",
      quantity: this.props.count || 0,
    };

    this.userDetails = JSON.parse(localStorage.getItem("user_details"));
  }

  // updateCount = () => {
  //   let cart = localStorage.getItem("cart") || [];
  //   let count = 0;
  //   cart = JSON.parse(cart);
  //   if (cart) {
  //     for (let item of cart) {
  //       count += item.quantity;
  //     }
  //   }
  //   this.setState({
  //     quantity: count
  //   })
  // }

  componentDidMount() {
    // this.updateCount();
    this.props.changeCount();
  }

  handleChangeLocale = (locale, direction) => {
    this.props.changeLocale(locale);

    const currentDirection = getDirection().direction;
    if (direction !== currentDirection) {
      setDirection(direction);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  isInFullScreen = () => {
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null)
    );
  };
  handleSearchIconClick = e => {
    if (window.innerWidth < menuHiddenBreakpoint) {
      let elem = e.target;
      if (!e.target.classList.contains("search")) {
        if (e.target.parentElement.classList.contains("search")) {
          elem = e.target.parentElement;
        } else if (
          e.target.parentElement.parentElement.classList.contains("search")
        ) {
          elem = e.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains("mobile-view")) {
        this.search();
        elem.classList.remove("mobile-view");
        this.removeEventsSearch();
      } else {
        elem.classList.add("mobile-view");
        this.addEventsSearch();
      }
    } else {
      this.search();
    }
  };
  addEventsSearch = () => {
    document.addEventListener("click", this.handleDocumentClickSearch, true);
  };
  removeEventsSearch = () => {
    document.removeEventListener("click", this.handleDocumentClickSearch, true);
  };

  handleDocumentClickSearch = e => {
    let isSearchClick = false;
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains("navbar") ||
        e.target.classList.contains("simple-icon-magnifier"))
    ) {
      isSearchClick = true;
      if (e.target.classList.contains("simple-icon-magnifier")) {
        this.search();
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains("search")
    ) {
      isSearchClick = true;
    }

    if (!isSearchClick) {
      const input = document.querySelector(".mobile-view");
      if (input && input.classList) input.classList.remove("mobile-view");
      this.removeEventsSearch();
      this.setState({
        searchKeyword: ""
      });
    }
  };
  handleSearchInputChange = e => {
    this.setState({
      searchKeyword: e.target.value
    });
  };
  handleSearchInputKeyPress = e => {
    if (e.key === "Enter") {
      this.search();
    }
  };

  search = () => {
    let search = this.state.searchKeyword.trim();
    window.open(`/store/search?s=${search}`, "_self");
  };

  toggleFullScreen = () => {
    const isInFullScreen = this.isInFullScreen();

    var docElm = document.documentElement;
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    this.setState({
      isInFullScreen: !isInFullScreen
    });
  };

  handleLogout = () => {
    if (this.props.home === "/store") {
      this.props.logoutSeller(this.props.history);
    } else {
      this.props.logoutUser(this.props.history);
    }
    localStorage.removeItem('cart');
  };

  handleLogin = () => {
    this.props.history.push('/seller/login');
  }

  menuButtonClick = (e, menuClickCount, containerClassnames) => {
    e.preventDefault();

    setTimeout(() => {
      var event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
    }, 350);
    this.props.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.props.selectedMenuHasSubItems
    );
  };
  mobileMenuButtonClick = (e, containerClassnames) => {
    e.preventDefault();
    this.props.clickOnMobileMenu(containerClassnames);
  };

  render() {
    const { containerClassnames, menuClickCount } = this.props;
    const { messages } = this.props.intl;
    const isLogin = this.userDetails;
    return (
      <nav className="navbar fixed-top">
        <div className="d-flex align-items-center navbar-left">
          {
            this.props.hideMenu ||
            <>
              <NavLink
                to="#" location={{}}
                className="menu-button d-none d-md-block"
                onClick={e =>
                  this.menuButtonClick(e, menuClickCount, containerClassnames)
                }
              >
                <MenuIcon />
              </NavLink>
              <NavLink
                to="#" location={{}}
                className="menu-button-mobile d-xs-block d-sm-block d-md-none"
                onClick={e => this.mobileMenuButtonClick(e, containerClassnames)}
              >
                <MobileMenuIcon />
              </NavLink>
            </>
          }

          <div className="search ml-5" data-search-path="/store/search">
            <Input
              name="searchKeyword"
              id="searchKeyword"
              placeholder={messages["menu.search"]}
              value={this.state.searchKeyword}
              onChange={e => this.handleSearchInputChange(e)}
              onKeyPress={e => this.handleSearchInputKeyPress(e)}
            />
            <span
              className="search-icon"
              onClick={e => this.handleSearchIconClick(e)}
            >
              <i className="simple-icon-magnifier" />
            </span>
          </div>

          {/* <div className="d-inline-block">
            <UncontrolledDropdown className="ml-2">
              <DropdownToggle
                caret
                color="light"
                size="sm"
                className="language-button"
              >
                <span className="name">{locale.toUpperCase()}</span>
              </DropdownToggle>
              <DropdownMenu className="mt-3" right>
                {localeOptions.map(l => {
                  return (
                    <DropdownItem
                      onClick={() => this.handleChangeLocale(l.id, l.direction)}
                      key={l.id}
                    >
                      {l.name}
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div> */}
          {/* <div className="position-relative d-none d-none d-lg-inline-block">
            <a
              className="btn btn-outline-primary btn-sm ml-2"
              target="_top"
              href="https://themeforest.net/cart/configure_before_adding/22544383?license=regular&ref=ColoredStrategies&size=source"
            >
              <IntlMessages id="user.buy" />
            </a>
          </div> */}
        </div>
        <a className="navbar-logo" href={this.props.home || "/app"}>
          <span className="logo d-none d-xs-block" />
          <span className="logo-mobile d-block d-xs-none" />
        </a>

        <div className="navbar-right" style={{ position: "relative" }}>

          {/* {isDarkSwitchActive && <TopnavDarkSwitch />} */}

          <div className="header-icons d-inline-block align-middle">

            {/* <TopnavEasyAccess /> */}
            {/* <TopnavNotifications /> */}

            <Button href="/store/cart" style={{ verticalAlign: "initial", padding: "5px", fontSize: "16px", display: "inline-flex", alignItems: "center" }} outline>
              <i className="simple-icon-basket" style={{ fontSize: "13pt", marginRight: "5px" }}></i>
              <span style={{ fontSize: "12px" }}>Giỏ hàng</span>
              <Badge color="secondary" style={{ padding: "2px", marginLeft: "5px" }}>{this.props.count}</Badge>
            </Button>
            {/* <button
              className="header-icon btn btn-empty d-none d-sm-inline-block"
              type="button"
              id="fullScreenButton"
              onClick={this.toggleFullScreen}
            >
              {this.state.isInFullScreen ? (
                <i className="simple-icon-size-actual d-block" />
              ) : (
                  <i className="simple-icon-size-fullscreen d-block" />
                )}
            </button> */}
          </div>
          {

          }
          <div className={`user user${!isLogin && "-customer"} d-inline-block`}>
            <UncontrolledDropdown className="dropdown-menu-right">
              <DropdownToggle className="p-0" color="empty">
                <span>
                  {
                    isLogin ?
                      <>
                        <span className="name mr-1">{this.userDetails?.name}</span>
                        <img alt="Profile" src="/assets/img/lamita_logo.png" />
                      </>
                      :
                      <i className="simple-icon-user"></i>
                  }
                </span>
              </DropdownToggle>
              <DropdownMenu className="mt-3" right>
                {/* <DropdownItem>Account</DropdownItem>
                <DropdownItem>Features</DropdownItem>
                <DropdownItem>History</DropdownItem>
                <DropdownItem>Support</DropdownItem> */}
                {/* <DropdownItem divider /> */}
                {
                  isLogin ? (
                    <DropdownItem onClick={() => this.handleLogout()}>
                      Sign out
                    </DropdownItem>
                  ) : (
                      <DropdownItem onClick={() => this.handleLogin()}>
                        Login
                      </DropdownItem>
                    )
                }
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </nav >
    );
  }
}

const mapStateToProps = ({ menu, settings, cart }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
  const { locale } = settings;
  const { count } = cart;
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
    count
  };
};
export default injectIntl(
  connect(
    mapStateToProps,
    { setContainerClassnames, clickOnMobileMenu, logoutSeller, logoutUser, changeLocale, changeCount }
  )(TopNavStore)
);
