/* @flow */

import React, { PureComponent } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import { TabPanelPage } from './TabPanelPage.js';
const BusyIndicator = require('react-native-busy-indicator');


import type { NavigationState } from 'react-native-tab-view/types';

type Route = {
    key: string,
    title: string,
};

type State = NavigationState<Route>;

const TabState = {
    TODO: 0,
    COMPLETED: 1
};

export default class TopBar extends PureComponent<void, *, State> {
    static title = 'Activities';

    state: State = {
        index: 0,
        routes: [
            { key: '0', title: 'To Do' },
            { key: '1', title: 'Completed' },
        ]
    };

    _handleIndexChange = index => {
        this.setState({
            index,
        });
    };

    _renderHeader = props => {
        return (
            <TabBar
                {...props}
                scrollEnabled
                indicatorStyle={styles.indicator}
                style={styles.tabBar}
                tabStyle={styles.tab}
                labelStyle={styles.label}
            />
        );
    };

    _renderScene = () => {
        return (
            <ScrollView contentContainerStyle={styles.fillSpaceContainerStyle}>
                <TabPanelPage isTodo={this.state.index === TabState.TODO}/>
                <BusyIndicator/>
            </ScrollView>
        );
    };

    render() {
        return (
              <TabViewAnimated
                    style={[styles.container, this.props.style]}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    renderHeader={this._renderHeader}
                    onIndexChange={this._handleIndexChange}
              />
        );
    }
}

const styles = StyleSheet.create({
    // this style is required to make the loading indicator look right
    fillSpaceContainerStyle: {
        flex: 1,
        flexDirection: 'column'
    },
    container: {
        flex: 1,
    },
    tabBar: {
        backgroundColor: 'white',
    },
    tab: {
        width: 185,
    },
    indicator: {
        backgroundColor: '#3948db',
    },
    label: {
        color: '#3948db',
        fontWeight: '500',
    },
});