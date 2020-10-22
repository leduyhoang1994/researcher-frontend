import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, Button } from "reactstrap";
import { NotificationManager } from "../../../components/common/react-notifications";
import ApiController from '../../../helpers/Api';
import { USER, ROLES, SELLER } from '../../../constants/api';
import { Colxx } from "../../../components/common/CustomBootstrap";
import { injectIntl } from "react-intl";
import SellerTables from "./SellerTables";


class SellerLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            fullName: "",
            phoneNumber: "",
            email: "",
            address: "",
            company: "",
            password: "",
            confirmPassword: "",
            roleName: "",
            sellers: [],
            roles: [],
            isLoading: true,
        };
        this.messages = this.props?.type === "modal" ? null : this.props.intl.messages;
    }

    componentDidMount() {
        this.loadSellers();
        this.loadRoles();
    }

    loadSellers = () => {
        ApiController.get(SELLER.all, {}, data => {
            this.setState({
                sellers: data,
                isLoading: false,
            });
        });
    }

    loadRoles = () => {
        ApiController.get(ROLES.all, {}, data => {
            this.setState({ roles: data });
        });
    }

    handleChangeInput = (e) => {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value
        })
    }

    submitChangeRole = (id, data) => {
        let roleIds = [];
        data.forEach(item => {
            roleIds.push(item.id)
        })
        const userRole = { userId: id, roleIds: roleIds }
        console.log(userRole);
        ApiController.callAsync('put', USER.roles, userRole)
            .then(data => {
                this.loadSellers();
                NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
            }).catch(error => {
                NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
            });
    }

    softDeleteUser = id => {
        ApiController.callAsync('delete', `${USER.all}/${id}`)
            .then(data => {
                console.log(data);
                NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
            }).catch(error => {
                NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
            });
    }

    createUser = () => {
        console.log(this.state);
    }

    renderLoading = () => {
        return (
            <div className="loading"></div>
        );
    }

    render() {
        const { sellers, roles } = this.state;
        let optionRoles = [];
        if (roles) {
            roles.forEach(item => {
                optionRoles.push({ label: item.description, value: item.name, id: item.id })
            })
        }

        if (this.state.isLoading) {
            return this.renderLoading();
        }

        return (
            <Fragment>
                <Card >
                    <CardBody>
                        <Row>
                            <Colxx xxs="12" md="12" className="mx-auto my-auto">
                                <h2>Danh sách tài khoản</h2>
                            </Colxx>
                            <Colxx xxs="12" md="12" className="mx-auto my-auto">
                                <SellerTables
                                    sellers={sellers}
                                    component={this}
                                />
                            </Colxx>
                        </Row>
                        <div className="text-right mt-3">
                            <Button
                                className="mr-3"
                                color="primary"
                                onClick={() => {
                                    window.open("/info/sellers/detail")
                                }}
                            >
                                Thêm mới
                                </Button>
                            {/* <Button
                                    className="button"
                                    color="primary"
                                    onClick={() => {
                                        this.createUser();
                                    }}
                                >
                                    Cập nhật
                                </Button> */}
                        </div>
                    </CardBody>
                </Card >
            </Fragment >
        );
    }
}

export default injectIntl(SellerLists);
