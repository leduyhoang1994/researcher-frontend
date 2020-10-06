import React, { Component, Fragment } from 'react';
import { Row, Input, Label, Button } from 'reactstrap';
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import { injectIntl } from 'react-intl';
import { __ } from '../../../helpers/IntlMessages';
import { SOURCE_CATEGORIES, ATTRIBUTES, UBOX_CATEGORIES, CATEGORY_SETS } from '../../../constants/api';
import ApiController from '../../../helpers/Api';
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import { Creatable } from 'react-select';
import Api from '../../../helpers/Api';
import { NotificationManager } from '../../../components/common/react-notifications';

class EditUboxCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setId: this.props.match.params.id || null,
            category: [],
            optionsLv1: [],
            optionsLv2: [],
            optionsLv3: [],
            optionsOwnProperties: [],
            optionsProperties: [],
            propertiesFilter: [],
            attributeIds: [],
            categoryLv1: "",
            categoryLv2: "",
            categoryLv3: "",
            valueText: '',
        };
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        this.getAllCategories();
        this.loadCurrentCategory();
        this.getProperties();
    }

    loadCurrentCategory = () => {
        const { setId } = this.state;
        if (setId)
            this.getCategories(setId);
    }

    getProperties = () => {
        ApiController.get(ATTRIBUTES.all, {}, data => {
            let options = [];
            data.forEach(item => {
                let option = {};
                option.label = item.label;
                option.value = item.label;
                options.push(option);
            })
            this.setState({ optionsProperties: options });
        });

    }

    getCategories = (setId) => {
        ApiController.get(`${UBOX_CATEGORIES.all}/${setId}`, {}, data => {
            let option1 = {};
            option1.label = data.nameLv1;
            option1.value = data.nameLv1;

            let option2 = {};
            option2.label = data.nameLv2;
            option2.value = data.nameLv2;

            let option3 = {};
            option3.label = data.nameLv3;
            option3.value = data.nameLv3;

            const description = data.description;

            if (data.uboxCategoryAttributes) {
                let attributes = data.uboxCategoryAttributes;
                let listOptions = [];
                attributes.forEach(item => {
                    if (item.attribute) {
                        listOptions.push({ label: item.attribute.label, value: item.attribute.label });
                    }
                })
                this.setState({
                    optionsOwnProperties: listOptions
                });
            }
            this.setState({
                categoryLv1: option1,
                categoryLv2: option2,
                categoryLv3: option3,
                valueText: description
            });
        });
    }

    getAllCategories = () => {
        ApiController.callAsync('get', CATEGORY_SETS.all, {})
            .then(data => {
                this.setState({ cateSetList: data.data.result });
            }).catch(error => {
                NotificationManager.warning(error.response.data.message, "Thất bại", 1000);
                if (error.response.status === 401) {
                    setTimeout(function () {
                        NotificationManager.info("Yêu cầu đăng nhập tài khoản researcher!", "Thông báo", 2000);
                        setTimeout(function () {
                            window.open("/user/login", "_self")
                        }, 1500);
                    }, 1500);
                }
            });
        ApiController.get(UBOX_CATEGORIES.all, {}, data => {
            let options1 = [];
            let options2 = [];
            let options3 = [];
            let tempOptions1 = [];
            let tempOptions2 = [];
            let tempOptions3 = [];
            data.forEach(item => {
                if (!tempOptions1.includes(item.nameLv1)) tempOptions1.push(item.nameLv1);
                if (!tempOptions2.includes(item.nameLv2)) tempOptions2.push(item.nameLv2);
                if (!tempOptions3.includes(item.nameLv3)) tempOptions3.push(item.nameLv3);
            })

            tempOptions1.forEach(item => {
                options1.push({ label: item, value: item });
            })

            tempOptions2.forEach(item => {
                options2.push({ label: item, value: item });
            })

            tempOptions3.forEach(item => {
                options3.push({ label: item, value: item });
            })

            this.setState({
                optionsLv1: options1,
                optionsLv2: options2,
                optionsLv3: options3
            });
        });
    }

    handleSelect1 = categoryLv1 => {
        if (categoryLv1) {
            this.setState({ categoryLv1: categoryLv1 });
        } else {
            this.setState({ categoryLv1: "" });
        }
    };

    handleSelect2 = categoryLv2 => {
        if (categoryLv2) {
            this.setState({ categoryLv2: categoryLv2 });
        } else {
            this.setState({ categoryLv2: "" });
        }

    };

    handleSelect3 = categoryLv3 => {
        if (categoryLv3) {
            this.setState({ categoryLv3: categoryLv3 });
        } else {
            this.setState({ categoryLv3: "" });
        }
    };

    handleCreate1 = (newValue) => {
        let option = {};
        option.label = newValue;
        option.value = newValue;
        this.setState({ categoryLv1: option });
    };

    handleCreate2 = (newValue) => {
        let option = {};
        option.label = newValue;
        option.value = newValue;
        this.setState({ categoryLv2: option });
    };

    handleCreate3 = (newValue) => {
        let option = {};
        option.label = newValue;
        option.value = newValue;
        this.setState({ categoryLv3: option });
    };

    handleCreateOptions = async (newValue) => {
        const value = newValue.trim()
        if (value) {
            await Api.callAsync('post', ATTRIBUTES.all, {
                label: value,
                description: ""
            }).then(data => {
                this.setState({ optionsProperties: [...this.state.optionsProperties, { label: value, value: value }] });
                NotificationManager.success("Thêm thuộc tính thành công", "Thành công");
            }).catch(error => {
                NotificationManager.warning("Thêm thuộc tính thất bại", "Thất bại");
            })
        }
    };

    handleChangeOptions = (newValue) => {
        let listProperties = [];
        newValue.forEach(item => {
            listProperties.push(item.label)
        })
        this.setState({ propertiesFilter: listProperties, optionsOwnProperties: newValue });
    };

    callApi = async () => {
        const { categoryLv1, categoryLv2, categoryLv3, valueText, attributeIds } = this.state;
        if (categoryLv1 && categoryLv2 && categoryLv3) {
            const id = this.state.setId;
            if (id) {
                await Api.callAsync('put', UBOX_CATEGORIES.all, {
                    id: parseInt(id),
                    nameLv1: categoryLv1.value,
                    nameLv2: categoryLv2.value,
                    nameLv3: categoryLv3.value,
                    description: valueText,
                    attributeIds: attributeIds
                }).then(data => {
                    NotificationManager.success("Thành công", "Thành công", 700);
                    setTimeout(() => {
                        window.open(`/app/ubox-categories/edit/${id}`, "_self")
                    }, 1000)
                }).catch(error => {
                    NotificationManager.warning("Cập nhật thất bại", "Thất bại");
                });
            } else {
                const data = await Api.callAsync('post', UBOX_CATEGORIES.all, {
                    nameLv1: this.state.categoryLv1.value,
                    nameLv2: this.state.categoryLv2.value,
                    nameLv3: this.state.categoryLv3.value,
                    description: this.state.valueText,
                    attributeIds: this.state.attributeIds
                }).then(data => {
                    return data.data;
                }).catch(error => {
                    return error.response.data;
                });
                if (data.success) {
                    NotificationManager.success("Thành công", "Thành công", 700);
                    setTimeout(() => {
                        window.open(`/app/ubox-categories/edit/${data.result.id}`, "_self")
                    }, 1000)
                } else {
                    NotificationManager.warning("Thêm mới thất bại", "Thất bại");
                }
            }
        } else {
            NotificationManager.warning("Nhập thiếu trường thông tin", "Thất bại");
        }
    }

    editCategory = async () => {
        if (this.state.categoryLv1.value !== ""
            && this.state.categoryLv2.value !== ""
            && this.state.categoryLv3.value !== "") {

            let attributeIds = [];
            const optionsOwnProperties = this.state.optionsOwnProperties;
            optionsOwnProperties.forEach(item => {
                attributeIds.push(item.label)
            })

            ApiController.get(ATTRIBUTES.all, {}, data => {
                data.forEach(item => {
                    if (attributeIds.includes(item.label)) {
                        this.setState({ attributeIds: [...this.state.attributeIds, item.id] });
                    }
                });
                this.callApi();
            })
        } else {
            return;
        }
    }

    render() {
        const { optionsLv1, optionsLv2, optionsLv3, optionsProperties, optionsOwnProperties } = this.state;
        const { categoryLv1, categoryLv2, categoryLv3 } = this.state;

        return (
            <div>
                <Fragment>
                    <Row>
                        <Colxx xxs="12">
                            <Breadcrumb heading="menu.category" match={this.props.match} />
                            <Separator className="mb-5" />
                        </Colxx>
                    </Row>
                    <Row>
                        <Colxx xxs="6">
                            <Label className="form-group has-float-label">
                                <Creatable
                                    isClearable
                                    value={categoryLv1}
                                    options={optionsLv1}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    onChange={this.handleSelect1}
                                    onCreateOption={this.handleCreate1}
                                />
                                <span>
                                    {__(this.messages, "Ngành hàng cấp 1")}
                                </span>
                            </Label>
                            <Label className="form-group has-float-label">
                                <Creatable
                                    isClearable
                                    value={categoryLv2}
                                    options={optionsLv2}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    onChange={this.handleSelect2}
                                    onCreateOption={this.handleCreate2}
                                />
                                <span>
                                    {__(this.messages, "Ngành hàng cấp 2")}
                                </span>
                            </Label>
                            <Label className="form-group has-float-label">
                                <Creatable
                                    isClearable
                                    value={categoryLv3}
                                    options={optionsLv3}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    onChange={this.handleSelect3}
                                    onCreateOption={this.handleCreate3}
                                />
                                <span>
                                    {__(this.messages, "Ngành hàng cấp 3")}
                                </span>
                            </Label>
                        </Colxx>
                        <Colxx xxs="6">
                            <Label className="form-group has-float-label">
                                <Creatable
                                    isClearable
                                    isMulti
                                    value={optionsOwnProperties}
                                    options={optionsProperties}
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    onChange={this.handleChangeOptions}
                                    onCreateOption={this.handleCreateOptions}
                                />
                                <span>
                                    {__(this.messages, "Thuộc tính")}
                                </span>
                            </Label>
                            <Label className="form-group has-float-label">
                                <Input type="textarea"
                                    defaultValue={this.state.valueText}
                                    rows="3"
                                    onChange={e => {
                                        this.setState({
                                            valueText: e.target.value
                                        })
                                    }} />
                                <span>
                                    {__(this.messages, "Mô tả")}
                                </span>
                            </Label>

                        </Colxx>
                    </Row>

                    <div className="text-right card-title">
                        <Button
                            className="mr-2"
                            color="primary"
                            onClick={() => {
                                this.editCategory();
                            }}
                        >
                            {__(this.messages, this.state.setId ? "Cập nhật" : "Thêm mới")}
                        </Button>
                    </div>
                </Fragment>
            </div>
        );
    }
}

export default injectIntl(EditUboxCategories);