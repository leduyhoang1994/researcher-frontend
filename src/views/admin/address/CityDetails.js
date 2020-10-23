import React, { Component } from "react";
import { CustomInput } from "reactstrap";
import { NotificationManager } from "../../../components/common/react-notifications";
import ApiController from '../../../helpers/Api';
import { ADDRESS } from '../../../constants/api';
import { injectIntl } from "react-intl";
import DistrictDetails from "./DistrictDetails";
import "../style.scss";

class CityDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: "",
            districts: [],
            isWarehouseChecked: false,
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.setState({
            city: this.props.city,
            districts: this.props.districts,
            isWarehouseChecked: this.props.isWarehouseChecked
        })
    }

    onChangeRadioDistrict = (district, index) => {
        let { districts } = this.state;
        districts.splice(index, 1, district);
        this.setState({
            districts
        })
    }

    updateConfigAddress = (district, index) => {
        let { districts, city, isWarehouseChecked } = this.state;
        districts.splice(index, 1, district);
        this.setState({
            districts
        })

        let data = { city: city, isUboxWarehouse: this.state.isWarehouseChecked }
        if (isWarehouseChecked) {
            data = {
                ...data, districts: [
                    {
                        district: district.label,
                        type: district.type
                    }
                ]
            }
        }

        ApiController.callAsync('put', ADDRESS.all, data)
            .then(data => {
                NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
            }).catch(error => {
                NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
            });
    }

    renderDistrict = (item, index) => {
        return (
            <DistrictDetails
                key={index}
                district={item}
                addressType={this.props.addressType}
                isWarehouseChecked={this.state.isWarehouseChecked}
                updateConfigAddress={(district) => {
                    this.updateConfigAddress(district, index)
                }}
            />
        )
    }
    render() {
        const { districts, isWarehouseChecked } = this.state;

        return (
            <>
                <CustomInput
                    id="custom-input-store"
                    className="mb-4"
                    type="checkbox"
                    checked={isWarehouseChecked}
                    onChange={() => {
                        this.props.changeWarehouseChecked()
                    }}
                    label="Là kho"
                />
                <div className="city-detail-area w-100" >
                    {
                        districts && districts.map((item, index) => {
                            return this.renderDistrict(item, index)
                        })
                    }
                </div>

            </ >
        );
    }
}

export default injectIntl(CityDetails);
