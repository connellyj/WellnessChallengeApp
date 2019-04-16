import React from 'react';
import { StyleSheet, ScrollView, Text, Linking } from 'react-native';
import PanelItem from './PanelItem.js'
import * as DataManager from '../../services/data_manager.js';
import * as CacheManager from "../../services/cache_manager";
import * as ErrorHandling from "./ErrorHandling";
import NothingCompleted from "./NothingCompleted";
import NothingThisWeek from "./NothingThisWeek";
const loaderHandler = require('react-native-busy-indicator/LoaderHandler');

export class TabPanelPage extends React.Component {
    state = {
        userActivities: [],
        userId: ""
    };

    componentDidMount() {
        loaderHandler.showLoader("Loading");
        // get all the activity info
        CacheManager.getCurrentUserId((userId) => {
            DataManager.addListenerToAllUserActivities(userId, (userActivities) => {
                DataManager.getAllActivitiesById((activities) => {

                    // Error handling
                    if(ErrorHandling.generalReadCallback(userId) ||
                        ErrorHandling.generalReadCallback(activities) ||
                        ErrorHandling.generalReadCallback(userActivities)) {
                        return;
                    }

                    const newActivities = [];
                    userActivities.forEach((ua, index) => {
                        if(activities[ua._activity_id]) {
                            newActivities.push({
                                date: new Date(ua._date),
                                name: activities[ua._activity_id]._name,
                                description: activities[ua._activity_id]._description,
                                webLink: activities[ua._activity_id]._web_link,
                                imageLink: activities[ua._activity_id]._image_link,
                                videoLink: activities[ua._activity_id]._video_link,
                                freq: ua._freq,
                                extraInfo: activities[ua._activity_id]._extraInfo,
                                track: activities[ua._activity_id]._track,
                                numCompletedInstances: ua._completed_instances,
                                location: activities[ua._activity_id]._location,
                                id: ua._uid,
                                // the key is used by react native to render efficiently
                                key: index+''
                            });
                        }
                    });
                    this.setState({
                        userActivities: newActivities,
                        userId: userId
                    });
                });
            });
        });
    }

    render() {
        if(this.props.isTodo) {
            return <TodoPanelPage userActivities={this.state.userActivities}/>
        }
        else {
            return <CompletedPanelPage userActivities={this.state.userActivities}/>
        }
    }
}

class CompletedPanelPage extends React.Component {
    handleDecrement(userActivityId){
        CacheManager.getCurrentUserId((userId) => {
            DataManager.getUserActivityForUid(userId, userActivityId, (userActivity) => {

                // Error handling
                if(ErrorHandling.generalReadCallback(userActivity) ||
                    ErrorHandling.generalReadCallback(userId)) {
                    return;
                }

                DataManager.decrementUserActivityCompletedInstances(userActivity, userId, ErrorHandling.generalWriteCallback)
            });
        });
    };

    componentDidUpdate() {
        loaderHandler.hideLoader();
    }

    render() {
        const activities = [];

        // sort user activities by date
        this.props.userActivities.sort((a, b) => {
            return a.date.getTime() >= b.date.getTime() ? 1 : -1;
        });

        // only display the user activities that that have been completed in some capacity
        this.props.userActivities.forEach(a => {
            const description = a.location ? a.description + "\nLocation: " + a.location : a.description;
            if(a.numCompletedInstances > 0) {
                activities.push(
                    (<PanelItem
                        header={a.name}
                        text={description}
                        videoLink={a.videoLink}
                        externalLink={a.webLink}
                        imageLink={a.imageLink}
                        completed={a.numCompletedInstances}
                        completedAction={() => this.handleDecrement(a.id)}
                        // the key is used by react native to render efficiently
                        key={a.key}
                    />)
                );
            }
        });

        if(activities.length === 0) {
            activities.push((
                <NothingCompleted key="nothing"/>
            ));
        }

        return (
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                {activities}
            </ScrollView>
        );
    }
}

class TodoPanelPage extends React.Component {
    state = {
        track: "",
        surveys: [],
        userId: ""
    };

    componentWillUnmount() {
        DataManager.removeListenerToTrackForUid(this.state.userId);
    }

    componentDidUpdate() {
        loaderHandler.hideLoader();
    }

    componentDidMount() {
        CacheManager.getCurrentUserId((userId) => {
            DataManager.addListenerToTrackForUid(userId, (track) => {

                // Error handling
                if(ErrorHandling.generalReadCallback(userId) ||
                    ErrorHandling.generalReadCallback(track)) {
                    return;
                }

                this.setState({
                    track: track,
                    surveys: this.state.surveys,
                    userId: userId
                });
            });
        });
        DataManager.getAllSurveys((surveys) => {

            if(ErrorHandling.generalReadCallback(surveys)) {
                return;
            }

            surveys.sort((a, b) => {
                return a._date >= b._date ? 1 : -1;
            });
            this.setState({
                track: this.state.track,
                surveys: surveys,
                userId: this.state.userId
            });
        });
    }

    numDaysBetweenDates(d1, d2) {
        const diff = Math.abs(d1.getTime() - d2.getTime());
        return diff / (1000 * 60 * 60 * 24);
    };

    handleIncrement(userActivityId) {
        CacheManager.getCurrentUserId((userId) => {
            DataManager.getUserActivityForUid(userId, userActivityId, (userActivity) => {

                // Error handling
                if(ErrorHandling.generalReadCallback(userId) ||
                    ErrorHandling.generalReadCallback(userActivity)) {
                    return;
                }

                DataManager.incrementUserActivityCompletedInstances(userActivity, userId, ErrorHandling.generalWriteCallback);
            });
        });
    };

    render() {
        const activities = [];
        const todaysDate = new Date(Date.now());
        todaysDate.setHours(0, 0, 0, 0);

        // sort the user activities by date
        this.props.userActivities.sort((a, b) => {
            return a.date.getTime() >= b.date.getTime() ? 1 : -1;
        });

        // initialize this week/future weeks separator
        let firstDate = null;
        let separatorAdded = false;
        activities.push((
            <Text key="current" style={styles.text}>This Week</Text>
        ));

        // add all relevant user activities as Panel Items
        this.props.userActivities.forEach((a) => {
            const adjustedDate = new Date(a.date);
            adjustedDate.setHours(0, 0, 0, 0);
            const description = a.location ? a.description + "\nLocation: " + a.location : a.description;

            // add the future weeks separator if needed
            if(firstDate !== null && this.numDaysBetweenDates(firstDate, adjustedDate) >= 7 && !separatorAdded) {
                activities.push((
                    <Text key="future" style={styles.text}>Future Weeks</Text>
                ));
                separatorAdded = true;
            }

            // add the user activity if it's the right track, date, and isn't fully completed
            if(todaysDate <= adjustedDate && a.numCompletedInstances !== a.freq && a.track === this.state.track) {
                if(firstDate === null) {
                    firstDate = new Date(a.date);
                    firstDate.setHours(0, 0, 0, 0);
                    if(this.numDaysBetweenDates(todaysDate, firstDate) >= 7) {
                        activities.push((
                            <NothingThisWeek key="nothing"/>
                        ));
                        activities.push((
                            <Text key="future" style={styles.text}>Future Weeks</Text>
                        ));
                        separatorAdded = true;
                    }
                }
                activities.push(
                    (<PanelItem
                        header={a.name}
                        text={description}
                        videoLink={a.videoLink}
                        imageLink={a.imageLink}
                        externalLink={a.webLink}
                        todo={a.freq - a.numCompletedInstances}
                        todoAction={() => this.handleIncrement(a.id)}
                        date={adjustedDate}
                        dateTime={(a.date.getHours() > 0 || a.date.getMinutes() > 0) && a.freq === 1 ? a.date : null}
                        listItems={a.extraInfo}
                        // the key is used by react native to render efficiently
                        key={a.key}
                    />)
                );
            }
        });

        // add post challenge surveys to the list
        this.state.surveys.forEach((s) => {
            const surveyDate = new Date(s._date);
            surveyDate.setHours(0, 0, 0, 0);
            const locked = surveyDate.getTime() > todaysDate.getTime() ? s._locked_text : null;
            activities.push((
                <PanelItem
                    header={s._name}
                    text={s._description}
                    key={s._uid}
                    actionName="Take Survey"
                    action={() => Linking.openURL(s._form_link + this.state.userId)}
                    locked={locked}
                />
            ));
        });

        return (
            <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                {activities}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  contentContainerStyle: {
      paddingBottom: 20,
  },
  text: {
    fontSize: 15,
    padding: 10,
  },
});