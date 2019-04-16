import React from 'react';
import {
    Text
} from 'react-native'
import styles from '../styles/styles.js';

export default class NothingThisWeek extends React.Component {
    render() {
        return (
            <Text style={styles.nothingThisWeekText}>No more activities this week!</Text>
        )
    }
}