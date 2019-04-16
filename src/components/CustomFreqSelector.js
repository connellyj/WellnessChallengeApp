import React from 'react';
import {
    View,
    Button,
    Modal,
    Text,
    Alert
} from 'react-native';
import SimpleStepper from 'react-native-simple-stepper';
import MoreDetailsModal from './MoreDetailsModal.js';

export default class CustomFreqSelector extends React.Component {
    state = {
        modalVisible: false,
        onSave: () => {},
        activities: [],
        selectedFrequencies: [],
        frequencies: {}
    };

    _setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
            onHide: this.state.onHide,
            activities: this.state.activities,
            selectedFrequencies: this.state.selectedFrequencies,
            frequencies: this.state.frequencies
        });
    }
    
    handleEvent(value, index) {
        const sf = this.state.selectedFrequencies;
        sf[index] = value;        
        
        this.setState({
            selectedFrequencies: sf
        });
    }

    _onSave() {
        let hasNonZero = false;
        const activities = Object.values(this.state.frequencies);
        
        // Figure out if all activities are zero or not
        for(let i = 0; i < this.state.selectedFrequencies.length; i++) {
            if(!hasNonZero && this.state.selectedFrequencies[i] !==  0){
                hasNonZero = true;
            }
            activities[i]._freq = this.state.selectedFrequencies[i]
        }
        
        if(hasNonZero) {
            this._setModalVisible(false);
            this.state.onSave(activities);
        } else {
            Alert.alert("Please do not skip all the activities.");
        }
    }

    _onCancel() {
        this._setModalVisible(false);
    }

    showModal(activities, onSave, preFill) {
       // generates the jsx
        const freqSelectors = activities.map((a, index) => {
            
            this.state.frequencies[a._uid] = a;
            
            return (
                <CustomFrequencyRow
                    key={index}
                    title={a._name}
                    description={a._description}
                    videoLink={a._video_link}
                    image={a._image_link}
                    link={a._web_link}
                    index={index}
                    maxValue ={a._freqEnd}
                    minValue={a._freq}
                    onEvent={this.handleEvent.bind(this)}
                    stepperValue={0}
                    initialValue={!preFill || !preFill[a._uid] ? 0 : preFill[a._uid].toString()}
                />
            )
        });
        
        
        // creates empty list of starting stepper values
        const items = [];
        for(activity in activities) {
            items.push(0);
        }

        // Save all necessary things to the state
        this.setState({
            modalVisible: true,
            onSave: onSave,
            activities: freqSelectors,
            selectedFrequencies: items,
            frequencies: this.state.frequencies
        });
    }

    componentDidMount() {
        this.props.onRef(this)
        
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    render() {
        return (
            
            <View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this._onCancel()}
                >
                    <Text style = {{paddingTop: 50, paddingLeft: 15, paddingRight: 15}}>{"Please select how many times per week you would like to complete " +
                            "each activity. These activities have a 'skip' option if you are not interested " +
                            "in the given activity. \n\nClick on an activity to learn more about it."}</Text>
                    <View style={{flex:1, marginTop: 10}}>
                        
                        {this.state.activities}
                        <View style={{flex: 1, flexDirection: 'row', height: 10, paddingVertical: 15, width:'100%'}}>
                            <View style = {{width:'50%'}}>
                                <Button backgroundColor = 'white' color =  '#5b6060' fontWeight = 'bold' raised title='Cancel' onPress={this._onCancel.bind(this)}/>
                            </View>
                            <View style = {{width:'50%'}}>
                                <Button backgroundColor = 'white' color = '#3948db' fontWeight = 'bold' raised title='Save' onPress={this._onSave.bind(this)}/>
                            </View>
                        </View>
                    </View>
                </Modal>
                
            </View>
        );
    }
}


class CustomFrequencyRow extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            initialValue: props.initialValue,
            title: props.title,
            stepperValue: props.stepperValue,
            maxValue: props.maxValue,
            minValue: props.minValue,
            index: props.index,
            onEvent: props.onEvent,
            videoLink: props.videoLink,
            imageLink: props.image,
            description: props.description,
            link: props.link
        };
    }
    
    render() {
        return (
            <View style = {{flexDirection:'row', width:'100%', padding: 10}}>
                    <View style= {{width:'60%', paddingLeft:10, paddingTop: 10}}>
                        <MoreDetailsModal
                            titleClick={this.props.title}
                            title={this.props.title}
                            link={this.props.link}
                            videoLink={this.props.videoLink}
                            image={this.props.image}
                            details={this.props.description}/>
                    </View>
                    
                    <View style= {{width:'20%'}}>
                        <Text style={{paddingTop: 10, paddingLeft: 10, marginRight: 20, fontWeight: 
                        'bold'}}>{(this.state.stepperValue !== 0 ? this.state.stepperValue : "Skip")}</Text>
                    </View>

                    <View style= {{width:'20%', marginTop: 0}}>
                        <SimpleStepper
                            initialValue={this.state.initialValue}
                            tintColor='#3948db'
                            valueChanged={(value) => this.valueChanged(value)}
                            padding= {3}
                            minimumValue={this.state.minValue}
                            maximumValue={this.state.maxValue}
                        />
                    </View>
            </View>
        )
    }
    
    valueChanged(value) {
        if(value !== this.state.stepperValue) {
            this.setState({
                stepperValue: value
            }, this.state.onEvent(value, this.state.index));
        }
    }
}