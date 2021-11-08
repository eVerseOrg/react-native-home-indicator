import React, { Component } from "react";
import PropTypes from "prop-types";
import { NativeModules, Platform } from "react-native";

const { RNHomeIndicator } = NativeModules;
const isIos = Platform.OS === "ios";

const propTypes = {
    autoHidden: PropTypes.bool.isRequired,
};

export class HomeIndicator extends Component {
    static propsHistory = [];

    static popAndGetPreviousProps() {
        HomeIndicator.propsHistory.pop();
        return HomeIndicator.propsHistory[HomeIndicator.propsHistory.length - 1] || {};
    }

    static replaceLastAndGetNewValue() {
        const lastIndex = HomeIndicator.propsHistory.length - 1;
        if (lastIndex >= 0) {
            const newValue = !HomeIndicator.propsHistory[lastIndex];
            HomeIndicator.propsHistory[lastIndex] = newValue;
            return newValue;
        }

        return {};
    }

    componentDidMount() {
        if (!isIos) return;

        const { autoHidden } = this.props;
        HomeIndicator.propsHistory.push(this.props);

        updateNativeHomeIndicator({ autoHidden });
    }

    componentWillUnmount() {
        if (!isIos) return;

        const { autoHidden } = HomeIndicator.popAndGetPreviousProps();
        updateNativeHomeIndicator({ autoHidden });
    }

    componentDidUpdate(prevProps) {
        if (!isIos) return;

        if (prevProps.autoHidden !== this.props.autoHidden) {
            const { autoHidden } = HomeIndicator.replaceLastAndGetNewValue();
            updateNativeHomeIndicator({ autoHidden });
        }
    }

    render() {
        return null;
    }
}

HomeIndicator.propTypes = propTypes;

function updateNativeHomeIndicator({ autoHidden = false }) {
    if (autoHidden) {
        RNHomeIndicator.autoHidden();
    } else {
        RNHomeIndicator.alwaysVisible();
    }
}

// keep this for backwards compatibility
const PrefersHomeIndicatorAutoHidden = () => <HomeIndicator autoHidden />;
export default PrefersHomeIndicatorAutoHidden;
