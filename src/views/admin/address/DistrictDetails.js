import React, { Component, Fragment } from "react";
import { Row, Card, Label, Button, CardBody, CustomInput, FormGroup, Input } from "reactstrap";
import { NotificationManager } from "../../../components/common/react-notifications";
import ApiController from '../../../helpers/Api';
import { ADDRESS } from '../../../constants/api';
import { Colxx } from "../../../components/common/CustomBootstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { injectIntl } from "react-intl";
import Select from "react-select";
import "../style.scss"

class DistrictDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            district: {},
            addressType: [],
            isWarehouseChecked:  false,
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.setState({
            district: this.props.district,
            addressType: this.props.addressType,
            isWarehouseChecked: this.props.isWarehouseChecked
        })
    }

    render() {
        let { district, addressType, isWarehouseChecked } = this.state;

        return (
            <>
                <div className="line-height-district">
                    <p className="w-40 d-inline-block">{district.label}</p>
                    <div className="w-60 d-inline-block ">
                        {
                            isWarehouseChecked && addressType.map((item, index) => {
                                let isInputChecked = district.type === item.code ? true : false;
                                return (
                                    <CustomInput
                                        key={index + district.label}
                                        className="ml-4"
                                        type="radio"
                                        name={index + district.label}
                                        id={item.code}
                                        label={item.name}
                                        inline
                                        checked={isInputChecked}
                                        onChange={() => {
                                            district.radius = item.name;
                                            district.type = item.code;
                                            this.props.updateConfigAddress(district);
                                        }}
                                    />
                                )

                            })
                        }
                    </div>
                </div>
            </ >
        );
    }
}

export default injectIntl(DistrictDetails);
