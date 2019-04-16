// MARK: - Imports
import * as FirebaseManager from './firebase_manager';
import * as CacheManager from './cache_manager';
import Activity from '../models/activity.js';
import UserActivity from '../models/user_activity.js';
import Survey from '../models/survey.js';
import Event from '../models/event.js';
import Model from "react-native-models";

//MARK: - Tracks
export function getAllTracks(callback){
    FirebaseManager.getAllTracks(callback);
}
export function changeTrackForUid(uid, newTrack, callback){
    FirebaseManager.changeTrackForUid(uid, newTrack, callback);
}
export function getTrackForUid(uid, callback) {
  FirebaseManager.getTrackForUid(uid, callback);
}
export function addListenerToTrackForUid(uid, callback) {
    FirebaseManager.addListenerToTrackForUid(uid, callback);
}
export function removeListenerToTrackForUid(uid) {
    FirebaseManager.removeListenerToTrackForUid(uid);
}

//MARK: - Surveys
export function getAllSurveys(callback) {
    FirebaseManager.getAllSurveys(callback);
}

//MARK: - Activities
export function getActivitiesForTrack(track, callback) {
    FirebaseManager.getActivitiesForTrack(track, callback);
}
export function getAllActivities(callback){
    FirebaseManager.getAllActivities(callback);
}
export function getActivityWithId(id, callback){
    CacheManager.getActivityWithId(id, (cached_activity) => {
      if(cached_activity != null) {
        callback(cached_activity);
        return;
      }

      FirebaseManager.getActivityWithId(id, (fetched_activity) => {
        if(fetched_activity != null) {
          CacheManager.cacheActivity(fetched_activity);
        }

        callback(fetched_activity);
      });
    });
}
export function getAllActivitiesById(callback) {
    FirebaseManager.getAllActivitiesById(callback);
}


// MARK: - User Activities
export function addUserActivityForUid(user_activity, uid, callback) {
    FirebaseManager.addUserActivitiyForUid(user_activity, uid, callback);
}
export function addUserActivitiesForUid(user_activities, uid, callback){
    FirebaseManager.addUserActivitiesForUid(user_activities, uid, callback);
}
export function getUserActivitiesForUid(uid, callback){
    FirebaseManager.getUserActivitiesForUid(uid, callback);
}
export function getUserActivityForUid(uid, user_activity_id, callback) {
  CacheManager.getUserActivityWithId(user_activity_id, (cached_user_activity) => {
    if(cached_user_activity != null) {
      callback(cached_user_activity);
      return;
    }

    FirebaseManager.getUserActivityForUid(uid, user_activity_id, (fetched_user_activity) => {
      if(fetched_user_activity != null) {
        CacheManager.cacheUserActivity(fetched_user_activity);
      }

      callback(fetched_user_activity);
    });
  });
}
export function incrementUserActivityCompletedInstances(user_activity, uid, callback) {
    FirebaseManager.incrementUserActivityCompletedInstances(user_activity, uid, callback);
}
export function decrementUserActivityCompletedInstances(user_activity, uid, callback) {
    FirebaseManager.decrementUserActivityCompletedInstances(user_activity, uid, callback);
}
export function updateUserActivityFreq(user_activity, uid, freq,  callback) {
    FirebaseManager.updateUserActivityFreq(user_activity, uid, freq, callback);
}
export function removeUserActivityForUid(user_activity, uid, callback) {
   FirebaseManager.removeUserActivityForUid(user_activity, uid, callback);
}
export function removeUserActivitiesForUid(user_activities, uid, callback){
    FirebaseManager.removeUserActivitiesForUid(user_activities, uid, callback);
}
export function addListenerToAllUserActivities(uid, callback) {
    FirebaseManager.addListenerToAllUserActivities(uid, callback);
}
export function removeListenerToAllUserActivities(uid) {
    FirebaseManager.removeListenerToAllUserActivities(uid);
}


// MARK: - User
export function logInfoForUserWithId(uid, email, name, track, reminderHasBeenSet, callback) {
  FirebaseManager.logInfoForUserWithId(uid, email, name, track, reminderHasBeenSet, callback);
}
export function getUserWithId(uid, callback) {
   FirebaseManager.getUserWithId(uid, callback);
}

export function setReminderHasBeenSetForUid(value, uid, callback){
    FirebaseManager.setReminderHasBeenSetForUid(value, uid, callback);   
}
