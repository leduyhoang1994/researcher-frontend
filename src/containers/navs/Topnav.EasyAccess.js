import React from "react";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { NavLink } from "react-router-dom";
import IntlMessages from "../../helpers/IntlMessages";

const TopnavEasyAccess = () => {
  return (
    <div className="position-relative d-none d-sm-inline-block">
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle className="header-icon" color="empty">
          <i className="simple-icon-grid" />
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3"
          right
          id="iconMenuDropdown"
        >
          {/* <NavLink to="/store/cart" className="icon-menu-item">
            <i className="simple-icon-basket" /><br/>
            <IntlMessages id="Giỏ hàng" />
          </NavLink> */}
          <NavLink to="/store" className="icon-menu-item">
            <i className="iconsminds-shop" /><br/>
            <IntlMessages id="Shop" />
          </NavLink>
          {/* <NavLink to="/store/orders" className="icon-menu-item">
            <i className="iconsminds-data-center" /><br/>
            <IntlMessages id="Đơn hàng" />
          </NavLink> */}

          {/* <NavLink to="/app/ui" className="icon-menu-item">
            <i className="iconsminds-pantone d-block" />{" "}
            <IntlMessages id="menu.ui" />
          </NavLink>
          <NavLink to="/app/ui/charts" className="icon-menu-item">
            <i className="iconsminds-bar-chart-4 d-block" />{" "}
            <IntlMessages id="menu.charts" />
          </NavLink>
          <NavLink to="/app/applications/chat" className="icon-menu-item">
            <i className="iconsminds-speach-bubble d-block" />{" "}
            <IntlMessages id="menu.chat" />
          </NavLink>
          <NavLink to="/app/applications/survey" className="icon-menu-item">
            <i className="iconsminds-formula d-block" />{" "}
            <IntlMessages id="menu.survey" />
          </NavLink>
          <NavLink to="/app/applications/todo" className="icon-menu-item">
            <i className="iconsminds-check d-block" />{" "}
            <IntlMessages id="menu.todo" />
          </NavLink> */}
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default TopnavEasyAccess;
