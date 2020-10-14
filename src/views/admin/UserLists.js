import React, { Component, Fragment } from "react";
import { Row, Card, Label, Input, CardBody } from "reactstrap";

import { NotificationManager } from "../../components/common/react-notifications";

import ApiController from '../../helpers/Api';
import { USER, ROLES } from '../../constants/api';
import { Colxx } from "../../components/common/CustomBootstrap";
import UserTables from "./UserTables";
import { injectIntl } from "react-intl";
import ConfirmButton from "../../components/common/ConfirmButton";
import Admin from "./UserInfo";

class UserLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            phoneNumber: "",
            email: "",
            address: "",
            company: "",
            password: "",
            confirmPassword: "",
            roleName: "",
            users: [],
            roles: [],
        };
        this.messages = this.props.isPopup ? null : this.props.intl.messages;
    }

    componentWillMount() {
        
    }

    componentDidMount() {
        this.loadUsers();
        this.loadRoles();
    }

    loadUsers = () => {
        ApiController.get(USER.all, {}, data => {
            let value = [];
            const user = JSON.parse(localStorage.getItem('user_details') || "") || null;
            if(user && data) {
                data.forEach(item => {
                    if(item.id !== user.id) {
                        value.push(item);
                    }
                })
            }
            this.setState({ users: value });
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
                this.loadUsers();
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

    render() {
        const { users, roles } = this.state;
        let optionRoles = [];
        if (roles) {
            roles.forEach(item => {
                optionRoles.push({ label: item.description, value: item.name, id: item.id })
            })
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
                                <UserTables
                                    data={users}
                                    options={optionRoles}
                                    component={this}
                                    submitChangeRole={this.submitChangeRole}
                                    softDeleteUser={this.softDeleteUser}
                                />
                            </Colxx>
                        </Row>
                    </CardBody>
                </Card >
            </Fragment >
        );
    }
}

export default injectIntl(UserLists);
