import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import "./Category.scss";

class SubMenuPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { cate } = this.props;
        return (
            <div className="modal-sub-menu"
                onMouseOver={this.defendHidePopup}
                onMouseLeave={this.hidePopup}>
                {
                    Object.keys(cate).map(cateNameLv2 => {
                        return (
                            <div className="subMenuItem" key={cateNameLv2}>
                                <b className="subMenuName subMenuLv2 cursor-pointer display-block w-100"  onClick={() => {
                                    window.open(`/store/${cateNameLv2}?lvl=2`, "_self")
                                }}>
                                    {cateNameLv2}
                                </b>
                                {
                                    Object.keys(cate[cateNameLv2]).map(cateNameLv3 => {
                                        return (
                                            <span className="subMenuName subMenuLv3 cursor-pointer display-block w-100"
                                                key={cateNameLv3}
                                                onClick={() => {
                                                    window.open(`/store/${cateNameLv3}?lvl=3`, "_self")
                                                }}>
                                                {cateNameLv3}
                                            </span>
                                        );
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        );

    }
}

export default injectIntl(SubMenuPopup);