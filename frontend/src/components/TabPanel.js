import React from 'react';
import Card from '@material-ui/core/Card';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`nav-tabpanel-${index}`}
            aria-labelledby={`nav-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Card p={3}>
                    {children}
                </Card>
            )}
        </div>
    )
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
export function LinkTab(props) {
    return (
        <Tab
            component="span"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}
export function a11yProps(index) {
    return {
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
    };
}
export default TabPanel
