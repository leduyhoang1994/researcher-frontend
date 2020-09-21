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
                                <b className="subMenuName subMenuLv2 cursor-pointer display-block w-100"  
                                onClick={() => {
                                    this.props.onClickSubMenu(cateNameLv2, 2)
                                }}>
                                    {cateNameLv2}
                                </b>
                                {
                                    Object.keys(cate[cateNameLv2]).map(cateNameLv3 => {
                                        return (
                                            <span className="subMenuName subMenuLv3 cursor-pointer display-block w-100"
                                                key={cateNameLv3}
                                                onClick={() => {
                                                    this.props.onClickSubMenu(cateNameLv3, 3)
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