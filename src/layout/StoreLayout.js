import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";

import TopNavStore from "../containers/navs/TopNavStore";
import Sidebar from "../containers/navs/Sidebar";
import Footer from "../containers/navs/Footer";

class StoreLayout extends Component {
  render() {
    const { containerClassnames } = this.props;
    return (
      <div id="app-container" className={containerClassnames}>
        <TopNavStore hideMenu={true} home={"/store"} history={this.props.history} />
        <Sidebar />
        <main>
          <div className="container-fluid">
          {this.props.children}
          </div>
        </main>
        <Footer/>
      </div>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};
const mapActionToProps={}

export default withRouter(connect(
  mapStateToProps,
  mapActionToProps
)(StoreLayout));
