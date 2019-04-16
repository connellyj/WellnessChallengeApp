import React from 'react';
import {
    Text
} from 'react-native'
import styles from '../styles/styles.js';

export default class NothingCompleted extends React.Component {
    render() {
        return (
            <Text style={styles.nothingCompletedText}>You haven't completed any activities yet!</Text>
        )
    }
}