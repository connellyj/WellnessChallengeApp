import React from 'react';
import {
    View,
    Modal,
    Text,
    Linking,
    Button,
    ScrollView, StyleSheet
} from 'react-native';
import { Icon,
    registerCustomIconType
} from 'react-native-elements';

function Video(props) {
    if (props.link) {
        return(
            <View>
                <Icon
                    reverse
                    raised
                    name="video-camera"
                    type="font-awesome"
                    color='#8B0000'
                    size={15}
                    onPress={ ()=>{ Linking.openURL(props.link)}}
                />
            </View>
        )
    }
    return(null)
}

function Image(props) {
    if (props.link) {
        return(
            <View>
                <Icon
                    reverse
                    raised
                    name="camera"
                    type="font-awesome"
                    color='#8B0000'
                    size={15}
                    onPress={ ()=>{ Linking.openURL(props.link)}}
                />
            </View>
        )
    }
    return(null)
}

function External(props) {
    if (props.link) {
        return(
            <View>
                <Icon
                    reverse
                    raised
                    name="external-link"
                    type="font-awesome"
                    color='#191970'
                    size={15}
                    onPress={ ()=>{ Linking.openURL(props.link)}}
                />
            </View>
        )
    }
    return(null)
}

export default class MoreDetailsModal extends React.Component {
    state = {
        modalVisible: false,
    };

    _setModalVisible(visible) {
        this.setState({
            modalVisible: visible
        });
    }

    render() {
        return (
            <View>
                <Text
                    onPress={() => this._setModalVisible(true)}
                    style={styles.textStyle}
                >
                        {this.props.titleClick}
                </Text>
                <Modal
                    onRequestClose={() => this._setModalVisible(false)}
                    visible={this.state.modalVisible}
                >
                    <ScrollView>
                        <Text style={styles.activityName}>{this.props.title}</Text>
                        <Text style={styles.myDescription}>{this.props.details}</Text>
                        <View style={styles.myDescription}>
                        <External link={this.props.link}/>
                        <Image link={this.props.imageLink}/>
                        <Video link={this.props.videoLink}/>
                        </View>
                        <View style={{margin: 25}}>
                            <Button
                                raised title="Ok"
                                backgroundColor = 'white'
                                color = '#3498db'
                                fontWeight = 'bold'
                                onPress={() => this._setModalVisible(false)}
                            />
                        </View>
                    </ScrollView>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    myDescription: {
        padding: 15,
        paddingRight: 25,
        paddingLeft: 25,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    activityName: {
        paddingTop: 40,
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
        fontWeight: 'bold',
        fontSize: 25
    },
    textStyle: {
        fontWeight: 'bold',
        backgroundColor: 'white',
        padding: 2,
    }
});

