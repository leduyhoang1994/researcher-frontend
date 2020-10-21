import React from 'react';
import { injectIntl } from 'react-intl';
import "./style.scss";
import { Button, ButtonGroup } from 'reactstrap';

class Property extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            optionIds: {},
            selectedRadio: {},
            selectedAttr: {},
            properties: [],
        }
        this.messages = this.props.intl.messages;
    }

    componentDidMount() {
        const { properties } = this.props;
        this.setState({
            properties
        }, () => {
            this.defaultValue();
        })
    }

    defaultValue = () => {
        const { properties } = this.state;
        if (properties) {
            properties.forEach((option) => {
                this.radioButtonSelect(option[0], 0);
            })
        }
    }

    renderAttribute = (properties) => {
        if (properties) {
            return properties.map((option, index) => {
                return (
                    <span key={index}>
                        <p className="mb-0 mt-3">{option[0].label}: {this.state.selectedAttr[option[0].label]}</p>
                        <ButtonGroup>
                            {this.renderOption(option)}
                        </ButtonGroup>
                    </span>

                )
            })
        } else {
            return;
        }
    }

    renderOption = (option) => {
        if (option) {
            return option.map((item, index) => (
                <Button key={index}
                    size="xs"
                    color="primary"
                    outline
                    onClick={() => this.radioButtonSelect(item, index)}
                    active={this.state.selectedRadio[item.label] === index}
                >
                    {item.value}
                </Button>
            ))
        } else {
            return;
        }
    }

    radioButtonSelect = (item, index) => {
        const { optionIds, selectedRadio, selectedAttr } = this.state;
        optionIds[item.label] = item.id;
        selectedRadio[item.label] = index;
        selectedAttr[item.label] = item.value;
        this.setState({ optionIds, selectedRadio, selectedAttr });
        this.props.setAttribute(optionIds);
    };

    render() {
        const { properties } = this.state;
        return (
            <div>
                {this.renderAttribute(properties)}
            </div>
        );
    }
}

export default injectIntl(Property);