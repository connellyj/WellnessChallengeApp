import React from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
const dateFormat = require('dateformat');

export default class DateTimePickerInput extends React.Component {
    state = {
        isDateTimePickerVisible: false,
        dateTimePicked: this.props.date ? this._formatDate(this.props.date) : ""
    };

    _formatDate(date) {
        return this.props.type === 'date' ? dateFormat(date, "ddd, mmm d") : dateFormat(date, "h:MM TT")
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({
            dateTimePicked: this._formatDate(date),
            isDateTimePickerVisible: this.state.isDateTimePickerVisible
        });
        if(this.props.callback) this.props.callback(date);
        this._hideDateTimePicker();
    };

    render () {
        const iconName = this.props.type === 'date' ? 'calendar-plus-o' : 'clock-o';
        const iconStyle = this.props.type === 'date' ? styles.dateIcon : styles.timeIcon;
        return (
            <View>
                <TouchableOpacity onPress={this._showDateTimePicker}>
                    <View>
                        <View style={styles.dateTimePickerInput}>
                            <Icon
                                name={iconName}
                                color='black'
                                type='font-awesome'
                                size={25}
                                containerStyle={iconStyle}
                            />
                            <TextInput 
                                editable={false}
                                value={this.state.dateTimePicked}
                                style={styles.dateTimePickerTextInput}
                                pointerEvents = "none"
                            />
                        </View>
                    </View>
                </TouchableOpacity>
                <DateTimePicker
                    mode={this.props.type}
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked.bind(this)}
                    onCancel={this._hideDateTimePicker.bind(this)}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    dateTimePickerTextInput: {
        borderColor: 'gray',
        borderWidth: 1,
        width: 200
    },
    dateTimePickerInput: {
        flexDirection: 'row'
    },
    dateIcon: {
        padding: 10
    },
    timeIcon: {
        padding: 10,
        paddingRight: 13
    }
});
