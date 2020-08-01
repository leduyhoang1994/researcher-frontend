import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

const InjectMassage = props => <FormattedMessage {...props} />;

export default injectIntl(InjectMassage, {
    withRef: false
});

export const __ = (messages, key = "") => {
    if (key === "") return "";
    if (messages[key]) {
        return messages[key];
    } else {
        return key;
    }
}