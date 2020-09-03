import React from 'react';
import { Row } from 'reactstrap';
import { Colxx } from '../../../components/common/CustomBootstrap';
import { __ } from '../../../helpers/IntlMessages';
import { useState } from 'react';
import ApiController from '../../../helpers/Api';
import { CATEGORY_EDIT, OPTIONS, PRODUCT_EDIT } from '../../../constants/api';
import AsyncCreatable from 'react-select/lib/AsyncCreatable';
import { isFunction } from 'formik';

class Property extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            properties: [],
            propertiesOptions: {},
            propertiesAttributesValue: this.props.productOptions && this.normalizeProductAttribute(this.props.productOptions) || {},
            reloadOptions: {},
            productId: this.props.productId
        };
        console.log(this.props.productOptions);
    }

    componentDidMount() {
        this.loadCategoryProperties();
    }

    normalizeProductAttribute = (options) => {
        const result = {};
        
        const temp = options;
        
        for(let index in temp) {
            const option = temp[index];
            console.log(option);
            if (!result[option.option.attribute.code]) {
                result[option.option.attribute.code] = [];
            }
            result[option.option.attribute.code].push(option.option);
        }

        this.props.setProductAttribute(result);
        
        return result;
    }

    componentDidUpdate(prevProps) {
        if (this.props.categoryId !== prevProps.categoryId && this.props.categoryId !== undefined) {
            this.loadCategoryProperties();
        }
    }

    loadCategoryProperties = (categoryId = null) => {
        if (!categoryId) {
            categoryId = this.props.categoryId;
        }
        if (!categoryId) {
            return;
        }
        this.setState({
            loading: true
        });

        ApiController.call("get", `${CATEGORY_EDIT.all}/${categoryId}`, {}, data => {
            this.setState({
                loading: false,
                properties: data
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
        const { setProductAttribute } = this.props;
        propertiesAttributesValue[attribute.code] = values;
        this.setState({
            propertiesAttributesValue
        });
        if (isFunction(setProductAttribute)) {
            setProductAttribute(propertiesAttributesValue);
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
                                <Colxx xxs="4">
                                    {property.attribute?.label}
                                </Colxx>
                                <Colxx xxs="8">
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

export default Property;