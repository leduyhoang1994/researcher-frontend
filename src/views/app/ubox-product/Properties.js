import React from 'react';
import { Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { __ } from '../../../helpers/IntlMessages';
import ApiController from '../../../helpers/Api';
import { UBOX_CATEGORIES, OPTIONS } from '../../../constants/api';
import AsyncCreatable from 'react-select/lib/AsyncCreatable';
import { isFunction } from 'formik';

class Properties extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            properties: [],
            propertiesOptions: {},
            propertiesAttributesValue: (this.props.uboxProductOptions && this.normalizeProductAttribute(this.props.uboxProductOptions)) || {},
            reloadOptions: {},
        };
    }

    componentDidMount() {
        this.loadCategoryProperties();
    }

    normalizeProductAttribute = (options) => {
        const result = {};

        const temp = options;

        for (let index in temp) {
            const option = temp[index];
            if (!result[option.option.attribute.code]) {
                result[option.option.attribute.code] = [];
            }
            result[option.option.attribute.code].push(option.option);
        }

        this.props.setUboxProductAttribute(result);

        return result;
    }

    componentDidUpdate(prevProps) {
        if (this.props.uboxCategoryId !== prevProps.uboxCategoryId && this.props.uboxCategoryId !== undefined) {
            this.loadCategoryProperties();
        }
    }

    loadCategoryProperties = (uboxCategoryId = null) => {
        if (!uboxCategoryId) {
            uboxCategoryId = this.props.uboxCategoryId;
        }
        if (!uboxCategoryId) {
            return;
        }
        this.setState({
            loading: true
        });

        ApiController.call("get", `${UBOX_CATEGORIES.all}/${uboxCategoryId}`, {}, data => {
            this.setState({
                loading: false,
                properties: data.uboxCategoryAttributes
            });
        });
    }

    handleCreate = (attribute, value) => {
        ApiController.call('post', `${OPTIONS.create}`, {
            attributeId: attribute.id,
            value: value,
            label: value
        }, data => {
            this.setState({
                reloadOptions: {
                    ...this.state.reloadOptions,
                    [attribute.code]: Math.random()
                }
            });
        })
    }

    handleChange = (attribute, values) => {
        const { propertiesAttributesValue } = this.state;
        const { setUboxProductAttribute } = this.props;
        propertiesAttributesValue[attribute.code] = values;
        this.setState({
            propertiesAttributesValue
        });
        if (isFunction(setUboxProductAttribute)) {
            setUboxProductAttribute(propertiesAttributesValue);
        }
    }

    renderProperties = () => {
        const { properties } = this.state;
        
        return (
            <>
                {
                    
                    properties.map(property => {
                        return (
                            <Row key={`attribute-${property.attributeId}`}>
                                <Colxx xxs="3">
                                    {property.attribute?.label}
                                </Colxx>
                                <Colxx xxs="9">
                                    <AsyncCreatable
                                        key={this.state.reloadOptions[property.attribute.code]}
                                        cache={false}
                                        isClearable
                                        isMulti
                                        value={this.state.propertiesAttributesValue[property.attribute.code]}
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        onChange={(values) => {
                                            this.handleChange(property.attribute, values);
                                        }}
                                        onCreateOption={(inputValue) => {
                                            this.handleCreate(property.attribute, inputValue);
                                        }}
                                        defaultOptions
                                        loadOptions={(inputValue, callback) => {
                                            ApiController.call('get', `${OPTIONS.all}/${property.attributeId}`, {}, data => {
                                                callback(data);
                                            });
                                        }}
                                    />
                                </Colxx>
                            </Row>
                        );
                    })
                }
            </>
        );
    }

    render() {
        const { loading } = this.state;
        const { component } = this.props;
        return (
            <div style={{ position: 'relative' }}>
                <h5>{__(component.messages, "Danh sách thuộc tính")}</h5>
                <div style={{
                    height: "300px"
                }}>
                    {
                        loading ?
                            <div className="loading-inside">

                            </div> : this.renderProperties()
                    }
                </div>
            </div>
        );
    }
}

export default Properties;