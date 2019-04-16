import React from "react";
import * as DataManager from "../../services/data_manager";
import * as CacheManager from "../../services/cache_manager";
import UserActivity from '../../models/user_activity.js'
import CustomFreqSelector from './CustomFreqSelector.js'
import * as ErrorHandling from './ErrorHandling';
import { Alert, View } from 'react-native';
import { Button } from 'react-native-elements';
import styles from "../styles/styles";


export default class EditTrackScreen extends React.Component {
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

    updateUserActivities(toAdd, userId) {
        toAdd.forEach((a) => {
            DataManager.addUserActivityForUid(a, userId, ErrorHandling.generalWriteCallback)
        });
    }

    editTrack() {
        CacheManager.getCurrentUserId((userId) => {
            DataManager.getTrackForUid(userId, (track) => {
                DataManager.getAllActivitiesById((allActivities) => {
                    DataManager.getUserActivitiesForUid(userId, (userActivities) => {
                        DataManager.getActivitiesForTrack(track._id, (trackActivities) => {

                            //Error handling
                            if (ErrorHandling.generalReadCallback(allActivities) ||
                                ErrorHandling.generalReadCallback(userActivities) ||
                                ErrorHandling.generalReadCallback(trackActivities) ||
                                ErrorHandling.generalReadCallback(userId) ||
                                ErrorHandling.generalReadCallback(track)) {
                                return;
                            }

                            // Figure out which activities need freq info
                            const activitiesNeedMoreInfo = [];
                            trackActivities.forEach((activity) => {
                                if (activity._freqEnd !== 0) {
                                    activitiesNeedMoreInfo.push(activity);
                                }
                            });

                            // Create and remove user activities as needed
                            let newUserActivities = [];
                            if (activitiesNeedMoreInfo.length > 0) {
                                alreadyExistActivityIds = userActivities.map((ua) => ua._activity_id);
                                existsFreqByActivityId = [];
                                userActivities.forEach((ua) => {
                                    existsFreqByActivityId[ua._activity_id] = ua._freq;
                                });
                                this.selectors.showModal(activitiesNeedMoreInfo, (activitiesWithFrequencies) => {
                                    activitiesWithFrequencies.forEach((a) => {
                                        exists = alreadyExistActivityIds.indexOf(a._uid);
                                        if (exists === -1 && a._freq !== 0) {
                                            newUserActivities = newUserActivities.concat(this.createRelevantUserActivities(a))
                                        }
                                        else {
                                            if(a._freq === 0) {
                                                DataManager.removeUserActivityForUid(userActivities[exists], userId, ErrorHandling.generalWriteCallback)
                                            }
                                            else {
                                                DataManager.updateUserActivityFreq(userActivities[exists], a._freq, userId, ErrorHandling.generalWriteCallback)
                                            }
                                        }
                                    });
                                    if(newUserActivities) {
                                        this.updateUserActivities(newUserActivities, userId);
                                    }
                                }, existsFreqByActivityId);
                            }
                            else {
                                Alert.alert("This track has no editable activities.");
                            }
                        });
                    });
                });
            });
        });
    }

    render() {
        return (
            <View>
                <View style={styles.buttonRowProfile}>
                    <Button raised color='#3948db' fontWeight='bold' backgroundColor='white' title='Edit Current Activities' icon={{name: 'tasks', color: '#3948db', type: 'font-awesome'}} onPress={this.editTrack.bind(this)}/>
                </View>
                <CustomFreqSelector onRef={ref => (this.selectors = ref)}/>
            </View>
        );
    }
}
