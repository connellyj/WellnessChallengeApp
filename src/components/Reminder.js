import React from 'react';
import {
    Text,
    View,
    Modal,
    StyleSheet,
    Dimensions
} from 'react-native';
import {Icon, Button} from 'react-native-elements';
import DateTimePickerInput from './DateTimePicker.js'

export default class Reminder extends React.Component {
    state = {
        modalVisible: false,
        date: this._setDate(this.props.isEvent) //what is this doing?
    };
    
    _setDate(event){
        if(event!=null){
            return(this.props.date);
        } else{
            return(null);
        }
    }

    _setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
            date: this.state.date
        });
    }

    _onCancel() {
        this._setModalVisible(false);
    }

    _onSave() {
        if(this.props.callback) this.props.callback(this.state.date, this.props.activityName);
        this._setModalVisible(false);
    }

    _handleDateSelect(date) {
        if(this.state.date) {
            this.state.date.setDate(date.getDate());
            this.state.date.setFullYear(date.getFullYear());
            this.state.date.setMonth(date.getMonth());
        }
        else {
            this.setState({
                modalVisible: this.state.visible,
                date: date
            });
        }
    }

    _handleTimeSelect(date) {
        if(this.state.date) {
            this.state.date.setHours(date.getHours());
            this.state.date.setMinutes(date.getMinutes());
            this.state.date.setSeconds(0);
        }
        else {
            this.setState({
                modalVisible: this.state.visible,
                date: date
            });
        }
    }
    
    render() {
            return (
                <View>
                    <Icon
                        reverse
                        raised
                        name="bell"
                        type="font-awesome"
                        color='#D7BB2C'
                        size={17}
                        onPress={() => this._setModalVisible(true)}
                    />
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {}}
                    >
                        <View style={styles.backgroundStyle}>
                            <View style={styles.cardStyle}>
                                <Text style = {styles.reminderTitle}> Set a reminder for </Text>
                                <Text style = {{textAlign: 'center'}}> {this.props.activityName} </Text>
                                <Text style = {styles.dateTime}>Select Date</Text>
                                <DateTimePickerInput type='date' date={this.state.date} callback={this._handleDateSelect.bind(this)}/>
                                <Text style = {styles.dateTime}>Select Time</Text>
                                <DateTimePickerInput type='time' date={this.state.date} callback={this._handleTimeSelect.bind(this)}/>
                                <View style={styles.buttonRow}>
                                    <Button
                                        raised
                                        onPress={this._onSave.bind(this)}
                                        title="Save"
                                        backgroundColor='white'
                                        fontWeight = 'bold'
                                        color='#3498db'
                                        icon={{name: 'save', color: '#3498db', type: 'MaterialCommunityIcons'}}
                                    />
                                    <Button
                                        raised
                                        onPress={this._onCancel.bind(this)}
                                        title="Cancel"
                                        backgroundColor='white'
                                        fontWeight = 'bold'
                                        color='#5b6060'
                                        icon={{name: 'cancel', color: 'black', type: 'MaterialIcons'}}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            );
      } 
}

const styles = StyleSheet.create({
    backgroundStyle: {
        //color: '#e9e3ef',
        backgroundColor:'#ebeef0',
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    cardStyle: {
        width: 300,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20, 
        borderRadius: 10,
        backgroundColor: 'white',
    },
    reminderTitle: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        height: 30,
    },
    headerContainer: {
        backgroundColor: 'white',
        padding: 10,
        flex: 1,
    },
    dateTime: {
        alignItems: 'center',
        paddingVertical: 10,
        fontSize: 15,
        
    },
    buttonView: {
        borderRadius: 10,
        fontSize: 15,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonRow: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center'
    }
});
