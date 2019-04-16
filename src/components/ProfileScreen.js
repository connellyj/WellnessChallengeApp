import styles from "../styles/styles";
import React from "react";
import * as CacheManager from "../../services/cache_manager";
import * as FirebaseManager from "../../services/firebase_manager";
import * as DataManager from "../../services/data_manager";
import { ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as Error from '../../src/components/ErrorHandling';
import RNRestart from 'react-native-restart';
import EditTrackScreen from "./EditTrackScreen";

class Profile extends React.Component {
    render() {
            return (
                <View>
                    <ProfilePicture name={this.props.name}/>
                </View>
            )
        }
}

class ProfilePicture extends React.Component {
    
    render() {
        return (
        <View style={styles.profileContainer}>
            <View style={styles.circularImage}>
                <View style={styles.circularText}>
                    <Text style={styles.largeText}>{this.props.name != null ? this.props.name[0] : ""}</Text>
                </View>
            </View>
            <Text style={styles.profileName}>{this.props.name}</Text>
        </View>
        )
    }
}

export default class ProfileScreen extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: 'Profile',
        header: navigation.state.params ? navigation.state.params.header : undefined
    });

    constructor(props, context) {
        super(props, context);

        this.state = {
            password: '',
            firstname: '',
            email: '',
            unique_id: '',
            current_user: null,
            track: 'none',
        }
    }

    componentDidMount() {
        CacheManager.getCurrentUserId((user_id) => {
            if (user_id !== null) {
                DataManager.getUserWithId(user_id, (firebase_user) => {
                    if (firebase_user !== null) {
                        DataManager.getTrackForUid(user_id, (user_track) => {
                            if (user_track !== 'none' && user_track !== null) {
                                firebase_user._track = user_track._name;
                                this.setState({
                                    track: user_track._name,
                                    current_user: firebase_user,
                                });
                            }
                            else {
                                this.setState({
                                    current_user: firebase_user,
                                });
                            }
                        })
                        CacheManager.cacheCurrentUser(firebase_user, Error.generalWriteCallback);
                    }
                });
            }
        })
    }

    _handleLogOut = () => {
        FirebaseManager.logout((success) => {
            CacheManager.clearCache((cleared) => {
                CacheManager.cacheLogoutBool(true, () => {
                    this.setState({
                        login_status: 0,
                        current_user: null,
                    });
                    RNRestart.Restart();
                });
            });
        });
    };

    render() {
        const { navigate } = this.props.navigation;
        if (this.state.current_user !== null) {
            return (
                <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                    <Profile name={this.state.current_user._name}/>
                    <Text style={styles.currentTrack}> Current Track: </Text>
                    <Text style={styles.currentTrack}> {this.state.track} </Text>
                    <EditTrackScreen/>
                    <View style={styles.buttonRowProfile}>
                        <Button raised color='#3948db' fontWeight = 'bold' backgroundColor='white' title='Switch Tracks' icon={{name: 'gears', color: '#3948db', type: 'font-awesome'}} onPress={()=> navigate('Tracks')}/>
                    </View>
                    <View style={styles.buttonRowProfile}>
                        <Button raised color='black' fontWeight = 'bold' backgroundColor='white' title='Log Out' icon={{name: 'sign-out', color: 'black', type: 'font-awesome'}} onPress={this._handleLogOut}/>
                    </View>
                </ScrollView>
            )
        }
        return null;
    }
}