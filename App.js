import React from 'react';
import {
    KeyboardAvoidingView,
    Text,
    View,
    ScrollView,
    Image,
    TextInput,
    Linking
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import {
    Icon,
    Button
} from 'react-native-elements';
import TopBar from './src/components/TopBar.js';
import styles from './src/styles/styles.js';
import * as DataManager from './services/data_manager';
import TrackScreen from './src/components/TrackScreen.js';
import ProfileScreen from './src/components/ProfileScreen.js';
import * as FirebaseManager from './services/firebase_manager';
import * as CacheManager from './services/cache_manager';
import * as Error from './src/components/ErrorHandling.js';
const loaderHandler = require('react-native-busy-indicator/LoaderHandler');
const BusyIndicator = require('react-native-busy-indicator');
import * as Notification from './src/components/Notification.js'

class HomeScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {navigate} = navigation;
        return {
            headerLeft: null,
            gesturesEnabled: false,
            title: 'Activities',
            headerRight: (
                <View style={{marginRight:20}}>
                    <Icon
                        name='user'
                        type='font-awesome'
                        color='#3948db'
                        size={20}
                        onPress={()=> navigate('Profile')}
                    />
                </View>
            ),
        };
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <TopBar state={this.state}/>
        );
    }
}

const SimpleApp_home = StackNavigator({
    Profile: { screen: ProfileScreen },
    Home: { screen: HomeScreen },
    Tracks: { screen: TrackScreen },
}, {
    initialRouteName: 'Home',
});

const SimpleApp_tracks = StackNavigator({
    Profile: { screen: ProfileScreen },
    Home: { screen: HomeScreen },
    Tracks: { screen: TrackScreen },
}, {
    initialRouteName: 'Tracks',
});


export default class App extends React.Component {
    constructor(props, context) {
        super(props, context);

        
        this.state = {
            login_status: 0, 
            password: '',
            firstname: '',
            email: '',
            unique_id: '',
            reminderHasBeenSet: 0,
            current_user: null,
            track: 'none',
            survey_link: null,
        }
        
        Text.defaultProps.style = {fontFamily: "Open Sans"};
    }
    
    _setSurveyReminders = async () => {
        CacheManager.getCurrentUser((user) => {
           if(user != null && !(user._reminderHasBeenSet)){
               DataManager.getAllSurveys((surveys) => {
                   surveys.forEach((survey) => {
                       if(survey._uid !== 'pre') {
                           Notification.CreateScheduledNotification(survey._date, survey._name);
                       }
                   });
               });
               
               DataManager.setReminderHasBeenSetForUid(1, user._uid, (success) => {
                   if(success){
                       user.setReminderHasBeenSet(1);
                       CacheManager.cacheCurrentUser(user);
                   }
               })
           } 
        });
    };
    
    _getSurveyLink = async () => {
        DataManager.getAllSurveys((surveys) => {
            if(Error.generalReadCallback(surveys)) return;
            surveys.forEach((survey) => {
                if (survey._name === 'Pre Survey') {
                    this.setState({
                        survey_link: survey._form_link,
                    })
                }
            })
        });
    }
    
    _handleBack = async () => {
        this.setState({
            login_status: this.state.login_status - 1,
        })
    };

    _handleBack2 = async () => {
        this.setState({
            login_status: this.state.login_status - 3,
        })
    };

    _handleNext = async() => {
        this.setState({
            login_status: this.state.login_status + 1,
        })
    };

    /* Skip consent form to go to login directly*/
    _handleSkip = async() => {
        this.setState({
            login_status: 3,
        })
    };

    _handleCreateAccount = () => {
        if(this.state.firstname === "") {
            Error.createAccountCallback("Please enter a name.");
            return;
        }
        loaderHandler.showLoader("Loading");
        FirebaseManager.createAccount(this.state.email, this.state.password, (uid, errorMessage) => {
            if(Error.createAccountCallback(errorMessage)) return;
            if(uid === null) return;
            DataManager.logInfoForUserWithId(uid, this.state.email, this.state.firstname, this.state.track, this.state.reminderHasBeenSet, (thisUser) => {
                CacheManager.cacheCurrentUser(thisUser, (success) => {
                    if(Error.generalWriteCallback(success)) return;
                    this.setState({
                        login_status: this.state.login_status + 2,
                        current_user: thisUser,
                        unique_id: uid,
                        reminderHasBeenSet: this.state.reminderHasBeenSet
                    });
                    this._getSurveyLink();
                });
            });
        });
    };

    _handleLogin = () => {
        loaderHandler.showLoader("Loading");
        FirebaseManager.login(this.state.email, this.state.password, (uid, errorMessage) => {
            if(Error.loginCallback(errorMessage)) return;
            if(uid == null) return;
            DataManager.getUserWithId(uid, (thisUser) => {
                DataManager.getTrackForUid(uid, (user_track) => {
                    CacheManager.cacheCurrentUser(thisUser, (success) => {
                        if(Error.generalWriteCallback(success)) return;
                        if (user_track !== null && user_track !== 'none') {
                            thisUser._track = user_track._name;
                            this.setState({
                                login_status: this.state.login_status + 1,
                                current_user: thisUser,
                                unique_id: uid,
                                track: user_track._name,
                            });
                        }
                        else {
                            this.setState({
                                login_status: this.state.login_status + 1,
                                current_user: thisUser,
                                unique_id: uid,
                            });
                        }
                    });
                })
            })
        });
    };

    componentDidUpdate() {
        loaderHandler.hideLoader();
    }

    componentWillMount() {
        console.disableYellowBox = true;
        this._setSurveyReminders();
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
                        });
                        CacheManager.cacheCurrentUser(firebase_user, Error.generalWriteCallback);
                    }
                });
                return;
            }
            
            CacheManager.getCurrentUserId((user_id) => {
                if (user_id !== null) {
                    DataManager.getUserWithId(user_id, (firebase_user) => {
                        if (firebase_user !== null) {
                            DataManager.getTrackForUid(user_id, (user_track) => {
                                if (user_track !== 'none' || user_track !== null) {
                                    firebase_user._track = user_track._name;
                                    this.setState({
                                        track: user_track._name,
                                        current_user: firebase_user,
                                        firstname: firebase_user._name,
                                        email: firebase_user._email,
                                        unique_id: firebase_user._uid,
                                    });
                                }
                                else {
                                    this.setState({
                                        current_user: firebase_user,
                                        firstname: firebase_user._name,
                                        email: firebase_user._email,
                                        unique_id: firebase_user._uid,
                                    });
                                }
                            })
                            CacheManager.cacheCurrentUser(firebase_user, (success) => {return});
                        }
                    });
                }
            })
        });
    }

    render() {
        FirebaseManager.checkForUpdates(() => {});
        
        if (this.state.login_status === 0 && this.state.current_user === null) {
                return (
                    <View style={styles.container_margin}>
                        <Image resizeMode='contain' style={styles.welcomeImage} source={require('./public/welcome.png')}/>
                        <View style={styles.container_center}>
                            <Text style={styles.profileName}> Welcome! </Text>
                            <View style = {styles.login}>
                                <View style = {{height: 15, marginBottom: 20, flex: 1}}>
                                    <Button raised title='Create Account' backgroundColor = 'white' color = '#5b6060' fontWeight = 'bold' onPress={this._handleNext}/>
                                </View>
                                <View style = {{height: 15, marginBottom: 20, flex: 1}}>
                                    <Button raised title='Login' backgroundColor = 'white' color = '#3948db' fontWeight = 'bold' onPress={this._handleSkip}/>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            }
            else if (this.state.login_status === 1) {
                return (
                    <View style={styles.contentFormStyle}>
                        <Text style={styles.profileName}>Wellness Challenge Consent Statement</Text>
                        <ScrollView>
                            <Text>The Office of Health Promotion is evaluating the Wellness Challenge to determine how
                                participation in various wellness activities affects the health of students at Carleton.
                                Your participation in this evaluation is voluntary, meaning you do not have to participate if you
                                do not want to. If you participate in the evaluation, the information you provide in the surveys will
                                be used to determine how the program is working and how it can improve. This evaluation is not
                                intended to assess how any particular student is responding, but rather how the Wellness
                                Challenge impacts the well-being and stress levels of the entire group of participants.{"\n"}{"\n"}All responses to the surveys will be confidential. Only the research staff will have access to this
                                information. Any identifiable information, such as your name or your email address, will be
                                removed from your responses prior to analysis.{"\n"}{"\n"}Risks and Benefits{"\n"}{"\n"}However, there is some risk that answering questions about stress may make you feel
                                uncomfortable. If any aspect of the evaluation makes you uncomfortable, you are free to
                                withdraw at any time and still continue participating in the Wellness Challenge.  Your
                                participation in the evaluation, or your decision not to participate, will not affect your educational
                                opportunities or relationships with Carleton.{"\n"}{"\n"}By clicking "Agree" below, you are acknowledging that you agree to participate in the
                                evaluation of the Wellness Challenge.
                            </Text>
                            <View style={styles.consentButtons}>
                                <View>
                                    <Button backgroundColor = 'white' color = '#5b6060' fontWeight = 'bold' raised title='Disagree' onPress={this._handleBack}/>
                                </View>
                                <View>
                                    <Button backgroundColor = 'white' color =  '#3948db' fontWeight = 'bold' raised title='Agree' onPress={this._handleNext}/>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
            )
        }
        else if (this.state.login_status === 2) {
            return (
                <KeyboardAvoidingView
                    style={styles.container_center}
                >
                    <View style={styles.container_center}>
                        <Image source={require('./public/TitleScreen.png')} style = {{width: 215, height: 215, marginBottom: 75}}/>
                        <TextInput
                            style={styles.input}
                            placeholder = " Name"
                            ref= "firstname"
                            onChangeText={(firstname) => this.setState({firstname})}
                            value={this.state.firstname}
                            secureTextEntry={false}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder = " Email"
                            ref= "email"
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                            autoCapitalize = 'none'
                        />
                        <TextInput
                            style={styles.input}
                            placeholder = " Password"
                            ref= "password"
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            secureTextEntry={true}
                            autoCapitalize = 'none'
                        />
                        <View style = {styles.flexBox}>
                            <View style = {{marginLeft: 68}}> 
                                <Button backgroundColor = 'white' color =  '#5b6060' fontWeight = 'bold' title='Back' onPress={this._handleBack}/>
                            </View>
                            <View style = {{marginRight:68}}> 
                                <Button backgroundColor = 'white' color =  '#3948db' fontWeight = 'bold' title='Next' onPress={this._handleCreateAccount}/>
                            </View>
                        </View>
                    </View>
                    <BusyIndicator/>
                </KeyboardAvoidingView>
            )
        }
        else if (this.state.login_status === 3) {
            return (
                <KeyboardAvoidingView
                    style={styles.container_center}
                >
                    <View style={styles.container_center}>
                        <View style={styles.container_center}>
                            <Image source={require('./public/TitleScreen.png')} style = {{width: 215, height: 215, marginBottom: 60}}/>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder = " Email"
                            ref= "email"
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                            autoCapitalize = 'none'
                        />
                        <TextInput
                            style={styles.input}
                            placeholder = " Password"
                            ref= "password" 
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            secureTextEntry={true}
                            autoCapitalize = 'none'
                        />
                        <View style = {styles.flexBox}>
                            <View> 
                                <Button backgroundColor = 'white' color =  '#5b6060' fontWeight = 'bold' title='Back' onPress={this._handleBack2}/>
                            </View>
                            <View> 
                                <Button backgroundColor = 'white' color =  '#3948db' fontWeight = 'bold' title='Next' onPress={this._handleLogin}/>
                            </View>
                        </View>
                    </View>
                    <BusyIndicator/>
                </KeyboardAvoidingView>
            )
        }
        else if (this.state.login_status === 4 && (this.state.track === 'none' || this.state.track === null)) {
            return (
                <View style={styles.container_center}>
                    <View style={styles.container_center}>
                        <Image source={require('./public/TitleScreen.png')} style = {{width: 215, height: 215, marginBottom: 60}}/>
                    </View>
                    <Text style={styles.profileName}> Winter Wellness Challenge </Text>
                    <Text style={styles.profileName}> Pre-Survey </Text>
                    <View style={styles.login}>
                        <View style = {{height: 15, marginBottom: 20}}>
                            <Button
                                raised title='Open Survey'
                                backgroundColor = 'white'
                                color = '#3948db'
                                fontWeight = 'bold'
                                onPress={ ()=>{ Linking.openURL(this.state.survey_link+this.state.unique_id)}}
                            />
                        </View>
                        <View style = {{height: 15, marginTop: 20}}>
                            <Button
                                raised title='Done'
                                backgroundColor = 'white'
                                color = '#3948db'
                                fontWeight = 'bold'
                                onPress={this._handleNext}
                            />
                        </View>
                    </View>
                </View>
            )
        }
        else {
            if (this.state.track === null || this.state.track === 'none') {
                return (
                    <SimpleApp_tracks screenProps = {this.state}/>
                )
            }
            else {
                return (
                    <SimpleApp_home screenProps = {this.state}/>
                )
            }
        }
    }
}