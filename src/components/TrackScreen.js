import styles from "../styles/styles";
import React from "react";
import * as DataManager from "../../services/data_manager";
import * as CacheManager from "../../services/cache_manager";
import { ScrollView } from 'react-native';
import PanelItem from './PanelItem.js'
import UserActivity from '../../models/user_activity.js'
import CustomFreqSelector from './CustomFreqSelector.js'
import * as ErrorHandling from './ErrorHandling';


export default class TrackScreen extends React.Component {
    state = {
        tracks: []
    };

    static navigationOptions = {
    };

    componentDidMount() {
        DataManager.getAllTracks((tracks) => {

            if(ErrorHandling.generalReadCallback(tracks)) {
                return;
            }

            this.setState({
                tracks: tracks
            });
        });
    }

    onFreqSelectorClose() {
        this.setState({
            tracks: this.state.tracks
        });
    }

    createRelevantUserActivities(activity) {
        const userActivities = [];
        const todaysDate = new Date(Date.now());
        todaysDate.setHours(0, 0, 0, 0);
        activity._dates.forEach((date) => {
            const adjustedDate = new Date(date);
            adjustedDate.setHours(0, 0, 0, 0);
            if(adjustedDate >= todaysDate) {
                userActivities.push(new UserActivity("", activity._uid, activity._freq, 0, null, date, todaysDate));
            }
        });
        return userActivities;
    }

    updateUserActivities(toRemove, toAdd, newTrack, userId) {
        DataManager.changeTrackForUid(userId, newTrack._id, (success) => {
            if(ErrorHandling.generalWriteCallback(success)) return;
            toRemove.forEach((a) => {
                DataManager.removeUserActivityForUid(a, userId, ErrorHandling.generalWriteCallback)
            });

            toAdd.forEach((a) => {
                DataManager.addUserActivityForUid(a, userId, ErrorHandling.generalWriteCallback)
            });
            this.navigateHome();
        });
    }

    navigateHome() {
        const {navigate} = this.props.navigation;
        navigate('Home');
    }

    changeTrack(newTrack) {
        CacheManager.getCurrentUserId((userId) => {
            DataManager.getAllActivitiesById((allActivities) => {
                DataManager.getUserActivitiesForUid(userId, (userActivities) => {
                    DataManager.getActivitiesForTrack(newTrack._id, (newTrackActivities) => {

                        //Error handling
                        if(ErrorHandling.generalReadCallback(userId) ||
                            ErrorHandling.generalReadCallback(allActivities) ||
                            ErrorHandling.generalReadCallback(userActivities) ||
                            ErrorHandling.generalReadCallback(newTrackActivities)) {
                            return;
                        }

                        // Figure out which user activities to remove
                        const userActivitiesToRemove = [];
                        let newUserActivities = [];
                        userActivities.forEach(ua => {
                            if(ua._completed_instances === 0 || allActivities[ua._activity_id]._track === newTrack._id) {
                                userActivitiesToRemove.push(ua);
                            }
                        });

                        // Figure out which activities need to be added, and which ones need freq info
                        const activitiesNeedMoreInfo = [];
                        newTrackActivities.forEach((activity) => {
                            if(activity._freqEnd !== 0) {
                                activitiesNeedMoreInfo.push(activity);
                            }
                            else {
                                newUserActivities = newUserActivities.concat(this.createRelevantUserActivities(activity));
                            }
                        });

                        // Create and remove user activities as needed
                        if(activitiesNeedMoreInfo.length > 0) {
                            this.selectors.showModal(activitiesNeedMoreInfo, (activitiesWithFrequencies) => {
                                activitiesWithFrequencies.forEach((a) => {
                                    if(a._freq !== 0) {
                                        newUserActivities = newUserActivities.concat(this.createRelevantUserActivities(a))
                                    }
                                });
                                this.updateUserActivities(userActivitiesToRemove, newUserActivities, newTrack, userId);
                            });
                        }
                        else {
                            this.updateUserActivities(userActivitiesToRemove, newUserActivities, newTrack, userId);
                        }
                    });
                });
            });
        });
    }

    render() {
        const trackViews = this.state.tracks.map((track, index) => {
            return (
                <PanelItem
                    header={track._name}
                    text={track._description}
                    actionName="Sign Up"
                    action={() => this.changeTrack(track)}
                    // the key helps react-native render efficiently
                    key={index}
                />
            )
        });

        return (
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                {trackViews}
                <CustomFreqSelector onRef={ref => (this.selectors = ref)}/>
            </ScrollView>
        );
    }
}