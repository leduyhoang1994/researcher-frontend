import React from 'react';
import { Label, Input } from "reactstrap";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import moment from "moment";
import TagsInput from "react-tagsinput";

import "react-tagsinput/react-tagsinput.css";
import "react-datepicker/dist/react-datepicker.css";
import IntlMessages, { __ } from './IntlMessages';
import AsyncSelect from 'react-select/lib/Async';
import { isFunction } from 'formik';
import './assets/Field.scss';

export const FieldsHelper = {
  arrayColumn(array, columnName) {
    return array.map(function (value, index) {
      return value[columnName];
    })
  },
  renderField(data, field, fieldInfo, component) {
    const { type } = fieldInfo;

    switch (type) {
      case 'text':
        return (
          <Label key={field} className="form-group has-float-label">
            <Input
              {...fieldInfo}
              required={fieldInfo.required}
              type="text"
              value={data[field] || ""}
              onChange={e => {
                data[field] = e.target.value
                component.setState({ data });
              }}
            />
            <span>
              {__(component.messages, `${fieldInfo.inputName || field}`)} {fieldInfo.required ? "*" : ""}
            </span>
          </Label>
        );

      case 'textarea':
        return (
          <Label key={field} className="form-group has-float-label">
            <Input
              {...fieldInfo}
              required={fieldInfo.required}
              type="textarea"
              value={data[field] || ""}
              onChange={e => {
                data[field] = e.target.value
                component.setState({ data });
              }}
            />
            <span>
              {__(component.messages, `${fieldInfo.inputName || field}`)} {fieldInfo.required ? "*" : ""}
            </span>
          </Label>
        );

      case 'date':
        return (
          <div key={field} className="form-group has-float-label">
            <DatePicker
              {...fieldInfo}
              required={fieldInfo.required}
              selected={data[field] ? moment(data[field]) : null}
              onChange={date => {
                data[field] = date;
                component.setState({ data });
                if (isFunction(fieldInfo.onChange)) {
                  fieldInfo.onChange(date);
                }
              }}
            />
            <span>
              {__(component.messages, `${fieldInfo.inputName || field}`)} {fieldInfo.required ? "*" : ""}
            </span>
          </div>
        );

      case 'select':
        let options = [];

        if (fieldInfo.sourceState) {
          options = Object.byString(component.state, fieldInfo.sourceState).map(s => {
            return {
              label: s[fieldInfo.label],
              value: s[fieldInfo.value]
            }
          });
        }
        return (
          <Label key={`${field}-${JSON.stringify(fieldInfo.source)}`} className="form-group has-float-label">
            <Select
              isClearable
              {...fieldInfo}
              required={fieldInfo.required}
              value={
                options.find(o => {
                  return o.value === data[field];
                })
              }
              options={options}
              className="react-select"
              classNamePrefix="react-select"
              onChange={e => {
                data[field] = e ? options.find(o => o.value === e.value) : null;
                component.setState({ data });
              }}
            />
            <span>
              {__(component.messages, `${fieldInfo.inputName || field}`)} {fieldInfo.required ? "*" : ""}
            </span>
          </Label>
        );

      case 'api-select':
        const optionValue = fieldInfo.optionValue ? fieldInfo.optionValue : (field + "_selected");
        return (
          <Label key={`${field}-${JSON.stringify(fieldInfo.source)}`} className="form-group has-float-label">
            <AsyncSelect
              isClearable
              {...fieldInfo}
              required={fieldInfo.required}
              defaultOptions
              value={fieldInfo.filterValue ? fieldInfo.filterValue(data[optionValue]) : data[optionValue]}
              getOptionValue={option => option[fieldInfo.value]}
              getOptionLabel={option => option[fieldInfo.label]}
              loadOptions={fieldInfo.loadOptions.bind(component)}
              className="react-select"
              classNamePrefix="react-select"
              onChange={e => {
                if (fieldInfo.isMulti) {
                  if (fieldInfo.filterValue) {
                    const toRemove = fieldInfo.filterValue(data[field]);
                    const idsToRemove = this.arrayColumn(toRemove, fieldInfo.value);
                    data[field] = data[field].filter(d => !idsToRemove.includes(d[fieldInfo.value]));
                    data[field] = data[field].concat(e);
                  } else {
                    data[field] = e;
                  }
                } else {
                  data[field] = e ? e[fieldInfo.value] : null;
                  data[optionValue] = e;
                }
                component.setState({ data });

                if (isFunction(fieldInfo.onChange)) {
                  fieldInfo.onChange(e);
                }
              }}
            />
            <span>
              {__(component.messages, `${fieldInfo.inputName || field}`)} {fieldInfo.required ? "*" : ""}
            </span>
          </Label>
        );

      default:
        break;
    }
  }
};