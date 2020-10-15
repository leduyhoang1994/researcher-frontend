import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, Button } from "reactstrap";
import { NotificationManager } from "../../components/common/react-notifications";
import ApiController from '../../helpers/Api';
import { __ } from '../../helpers/IntlMessages';
import { USER, ROLES, SELLER } from '../../constants/api';
import { Colxx } from "../../components/common/CustomBootstrap";
import UserTables from "./UserTables";
import { injectIntl } from "react-intl";
import UserModals from "./UserModals";
import ReactTable from "react-table";


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
            isOpenUserModal: false,
        };
        this.messages = this.props?.type === "modal" ? null : this.props.intl.messages;
        this.toggleOpenUserModal = this.toggleOpenUserModal.bind(this);
    }

    componentDidMount() {
        this.loadSellers();
        this.loadRoles();
    }

    loadSellers = () => {
        ApiController.get(SELLER.all, {}, data => {
            this.setState({ sellers: data });
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

    toggleOpenUserModal(id) {
        this.setState({
            id,
            isOpenUserModal: !this.state.isOpenUserModal,
        })
    }

    createUser = () => {
        console.log(this.state);
    }

    columns = () => [
        {
            Header: __(this.messages, "Họ"),
            sortable: false,
            accessor: "firstName",
            Cell: props => <p className="text-muted">{props.value}</p>
        },
        {
            Header: __(this.messages, "Tên"),
            sortable: false,
            accessor: "lastName",
            Cell: props => <p className="text-muted">{props.value}</p>
        },
        {
            Header: __(this.messages, "Số điện thoại"),
            sortable: false,
            accessor: "phoneNumber",
            Cell: props => <p className="text-muted">{props.value}</p>
        },
        {
            Header: __(this.messages, "E-mail"),
            sortable: false,
            accessor: "email",
            Cell: props => <p className="text-muted">{props.value}</p>
        },
        {
            Header: __(this.messages, "Hành động"),
            sortable: false,
            accessor: null,
            width: 280,
            Cell: props => {
                return (
                    <div className="text-left d-block">
                        <Button
                            className="button"
                            color="primary"
                            size="xs"
                            onClick={() => {
                            }}
                        >
                            Chi tiết
                  </Button>
                    </div>
                )
            }
        },
    ]
    render() {
        const { sellers, roles } = this.state;
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
                                <ReactTable
                                    className="-striped -highlight"
                                    data={sellers}
                                    columns={this.columns()}
                                    defaultPageSize={10}
                                    showPagination={false}
                                    getTrProps={(state, rowInfo) => {
                                        if (rowInfo && rowInfo.row) {
                                            return {
                                                onClick: (e) => {
                                                    window.open(`/info/sellers/${rowInfo.original.id}`)
                                                },
                                                style: {
                                                    cursor: "pointer"
                                                }
                                            }
                                        } else {
                                            return {}
                                        }
                                    }}
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
                    isOpenModal={this.state.isOpenUserModal}
                    toggleOpenUserModal={this.toggleOpenUserModal}
                />
            </Fragment >
        );
    }
}

export default injectIntl(SellerLists);
