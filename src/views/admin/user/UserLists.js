import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, Button } from "reactstrap";

import { NotificationManager } from "../../../components/common/react-notifications";

import ApiController from '../../../helpers/Api';
import { USER, ROLES } from '../../../constants/api';
import { Colxx } from "../../../components/common/CustomBootstrap";
import UserTables from "./UserTables";
import { injectIntl } from "react-intl";
import UserModals from "./UserModals";

class UserLists extends Component {
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
            users: [],
            roles: [],
            isOpenUserModal: false,
        };
        this.messages = this.props?.type === "modal" ? null : this.props.intl.messages;
        this.toggleOpenUserModal = this.toggleOpenUserModal.bind(this);
    }

    componentDidMount() {
        this.loadUsers();
        this.loadRoles();
    }

    loadUsers = () => {
        ApiController.callAsync('get', USER.all, {})
            .then(result => {
                const data = result.data.result
                let value = [];
                const user = JSON.parse(localStorage.getItem('user_details') || "") || null;
                if (user && data) {
                    data.forEach(item => {
                        if (item.id !== user.id) {
                            value.push(item);
                        }
                    })
                }
                this.setState({ users: value });
            }).catch(error => { });
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
                NotificationManager.success("Cập nhật thành công", "Thành công", 1500);
            }).catch(error => {
                NotificationManager.warning(error.response.data.message, "Thất bại", 1500);
            });
    }

    toggleOpenUserModal(id) {
        this.setState({
            id,
            isOpenUserModal: !this.state.isOpenUserModal,
        })
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
                                    key={users.length}
                                    data={users}
                                    options={optionRoles}
                                    component={this}
                                    submitChangeRole={this.submitChangeRole}
                                    softDeleteUser={this.softDeleteUser}
                                    toggleOpenUserModal={this.toggleOpenUserModal}
                                />
                            </Colxx>
                        </Row>
                        <div className="text-right mt-3">
                            <Button
                                className="mr-3"
                                color="primary"
                                onClick={() => {
                                    this.toggleOpenUserModal()
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
                <UserModals
                    userId={this.state.id}
                    key={this.state.isOpenUserModal}
                    reloadUsers={this.loadUsers}
                    isOpenModal={this.state.isOpenUserModal}
                    toggleOpenUserModal={this.toggleOpenUserModal}
                />
            </Fragment >
        );
    }
}

export default injectIntl(UserLists);
