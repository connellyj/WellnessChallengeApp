// MARK: - Imports
import * as Firebase from 'firebase';
import Activity from '../models/activity.js';
import Track from '../models/track.js';
import UserActivity from '../models/user_activity.js';
import Survey from '../models/survey.js';
import User from '../models/user.js';
import React from 'react';
import * as CacheManager from './cache_manager';


// MARK: - Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3RNuaquhd7iY66H-JjfnuLx3WB8WH5nc",
  authDomain: "health-comps-1718.firebaseapp.com",
  databaseURL: "https://health-comps-1718.firebaseio.com/",
  storageBucket: "gs://health-comps-1718.appspot.com/"
};
const firebase = Firebase.initializeApp(firebaseConfig);

// MARK: - Tracks
export function getAllTracks(callback){
    var ref = firebase.database().ref("/tracks/").orderByKey();

    ref.once("value", function(snapshot) {
        var tracks = [];

        snapshot.forEach(function(track_snapshot) {
            tracks.push(createTrack(track_snapshot));
        });
        
        callback(tracks);
    });
}
export function changeTrackForUid(uid, newTrack, callback){
    var ref = firebase.database().ref("/user-info/" + uid);
    update(ref, {track:  newTrack}, callback);
}
export function getTrackForUid(uid, callback){
    var userRef = firebase.database().ref("/user-info/" + uid + "/track/");
    var userTrack = "";
    userRef.once("value", (snapshot) => {
        userTrack = snapshot.val();
        var trackRef = firebase.database().ref("/tracks/" + userTrack);
        trackRef.once("value", function(snapshot){
            callback(createTrack(snapshot));
        });
    });
}
export function addListenerToTrackForUid(uid, callback){
    var ref = firebase.database().ref("/user-info/" + uid + "/track/");
    ref.on("value", function(snapshot) {
        callback(snapshot.val());
    });
}
export function removeListenerToTrackForUid(uid) {
    var ref = firebase.database().ref("/user-info/" + uid + "/track/");
    ref.off();
}

// MARK: - Activities
export function getActivitiesForTrack(track, callback){
    var ref = firebase.database().ref("/activities/").orderByChild("track").startAt(track).endAt(track);

    ref.once("value", function(snapshot) {
        var activities = [];

        snapshot.forEach(function(activity_snapshot) {
            activities.push(createActivity(activity_snapshot));
        });

        callback(activities);
    });
}
export function getAllActivities(callback){
    var ref = firebase.database().ref("/activities/").orderByKey();

    ref.once("value", function(snapshot) {
        var activities = [];

        snapshot.forEach(function(activity_snapshot) {
            activities.push(createActivity(activity_snapshot));
        });

        callback(activities);
    });
}
export function getActivityWithId(id, callback){
    var ref = firebase.database().ref("/activities/" + id);

    ref.once("value", function(snapshot) {
        callback(createActivity(snapshot));
    });
}
export function getAllActivitiesById(callback) {
    const ref = firebase.database().ref("/activities/").orderByKey();

    ref.once("value", function(snapshot) {
        const activities = [];

        snapshot.forEach(function(activity_snapshot) {
            activities[activity_snapshot.key] = createActivity(activity_snapshot)
        });

        callback(activities);
    });
}


// MARK: - Surveys
export function getAllSurveys(callback){
    const ref = firebase.database().ref("/surveys/").orderByKey();

    ref.once("value", function(snapshot) {
        const surveys = [];

        snapshot.forEach(function(survey_snapshot) {
            surveys.push(createSurvey(survey_snapshot));
        });

        callback(surveys);
    });
}


// MARK: - User Activities
export function addUserActivitiyForUid(user_activity, uid, callback) {
    var ref = firebase.database().ref("/user-activities/" + uid);
    var key = ref.push().key;

    set(ref.child(key), {
        activity_id: user_activity._activity_id,
        completed_instances: user_activity._completed_instances,
        created_on: user_activity._created_on,
        last_completed_date: user_activity._last_completed_date,
        freq: user_activity._freq,
        date: user_activity._date
    }, callback);
}
export function getUserActivitiesForUid(uid, callback){
    var ref = firebase.database().ref("/user-activities/" + uid);

    ref.once("value", function(snapshot) {
        var user_activities = [];

        snapshot.forEach(function(snapshot) {
            user_activities.push(createUserActivity(snapshot));
        });

        callback(user_activities);
    });
}
export function getUserActivityForUid(uid, user_activity_id, callback){
    var ref = firebase.database().ref("/user-activities/" + uid + "/" + user_activity_id + "/");

    ref.once("value", function(snapshot) {
        callback(createUserActivity(snapshot));
    });
}
export function incrementUserActivityCompletedInstances(user_activity, uid, callback) {
    var ref = firebase.database().ref("/user-activities/" + uid).child(user_activity._uid);
    user_activity.incrementCompletedInstanceCount();

    update(ref, {
        completed_instances:  user_activity._completed_instances
    }, (success) => {
        if(success) {
            CacheManager.cacheUserActivity(user_activity);
            
        }
        callback(success);
        
    });
}
export function decrementUserActivityCompletedInstances(user_activity, uid, callback) {
    var ref = firebase.database().ref("/user-activities/" + uid).child(user_activity._uid);
    user_activity.decrementCompletedInstanceCount();

    update(ref, {
        completed_instances:  user_activity._completed_instances
    }, (success) => {
        if(success) {
            CacheManager.cacheUserActivity(user_activity);

        }
        callback(success);

    });
}
export function updateUserActivityFreq(user_activity, freq, uid, callback) {
    var ref = firebase.database().ref("/user-activities/" + uid).child(user_activity._uid);
    update(ref, {
        freq:  freq
    }, callback);
}
export function removeUserActivityForUid(user_activity, uid, callback) {
    var ref = firebase.database().ref("/user-activities/" + uid).child(user_activity._uid);
    remove(ref, callback);
}
export function removeUserActivitiesForUid(user_activities, uid, callback){
    var userActivitiesRefs = [];
    user_activities.forEach(function(user_activity){
        userActivitiesRefs.push(user_activity._uid);
    });
    removeAll(userActivitiesRefs, callback);
}
export function addListenerToAllUserActivities(uid, callback) {
    const ref = firebase.database().ref("/user-activities/" + uid);

    ref.on("value", function(snapshot) {
        const user_activities = [];

        snapshot.forEach(function(snapshot) {
            user_activities.push(createUserActivity(snapshot));
        });

        callback(user_activities);
    });
}
export function removeListenerToAllUserActivities(uid) {
    const ref = firebase.database().ref("/user-activities/" + uid);
    ref.off();
}


// MARK: - User
export function logInfoForUserWithId(uid, email, name, track, reminderHasBeenSet, callback) {
  var ref = firebase.database().ref("/user-info/" + uid);

  set(ref, {
      email: email,
      name: name,
      track: track,
      reminderHasBeenSet: reminderHasBeenSet
  }, (success) => {
    if(success) {
      callback(new User(uid, name, email, track, reminderHasBeenSet));
    } else {
      callback(null);
    }
  });
}

export function setReminderHasBeenSetForUid(value, uid, callback){
    var ref = firebase.database().ref("/user-info/" + uid);

    update(ref, {
        reminderHasBeenSet: value   
    },callback);
}

export function getUserWithId(uid, callback) {
  var ref = firebase.database().ref("/user-info/").child(uid);

  ref.once("value", function(snapshot) {
    callback(createUser(snapshot));
  });
}


// MARK: - Authentication
export async function createAccount(email, password, callback) {
  firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
    callback(user != null ? user.uid : null, null);
  }).catch((error) => {
    callback(null, error.message);
  });
}
export async function login(email, password, callback) {
  firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
    callback(user != null ? user.uid : null, null);
  }).catch((error) => {
    callback(null, error.message);
  });
}
export async function logout(callback) {
  firebase.auth().signOut().then(function() {
    callback(true);
  }, function(error) {
    console.warn(error.message);
    callback(false);
  });
}


// MARK: - Updates
export function checkForUpdates(callback){
    var ref = firebase.database().ref("/updates/");
    
    ref.once("value", function(snapshot) {
        var completed_operations = [];
        
        snapshot.forEach(function(update_snapshot) {
            CacheManager.getActivityWithId(update_snapshot.key, (cached_activity) => {
                if(cached_activity != null && cached_activity._last_modified != update_snapshot.val()){
                    getActivityWithId(update_snapshot.key, (updated_firebase_activity) => {
                        CacheManager.cacheActivity(updated_firebase_activity, (success) => {
                            completed_operations.push(success);
                            
                            if(completed_operations.length === snapshot.numChildren()) {
                                callback();
                            }
                        });
                    });
                } else {
                    completed_operations.push(true);

                    if(completed_operations.length === snapshot.numChildren()) {
                        callback();
                    }
                }
            }); 
        });
    });
}


// MARK: - Helper functions
function createActivity(snapshot) {
    var activity = snapshot.val();

    if(activity == null) {
      return null;
    } else {
      return new Activity(snapshot.key,
                          activity.name,
                          activity.description,
                          parse(snapshot, "dates"),
                          activity.track,
                          activity.webLink,
                          activity.imageLink,
                          activity.videoLink,
                          activity.freq,
                          activity.freqEnd,
                          activity.location,
                          parseExtraInfo(snapshot),
                         activity.last_modified);
    }
}
function createUser(snapshot) {
  var user = snapshot.val();

  if(user == null) {
    return null;
  } else {
    return new User(snapshot.key,
                    user.name,
                    user.email,
                    user.track, 
                    user.reminderHasBeenSet);
  }
}
function createTrack(snapshot) {
    var track = snapshot.val();

    if(track == null) {
      return null;
    } else {
      return new Track(snapshot.key,
                       track.name,
                       track.description,
                       track.image);
    }
}
function createUserActivity(snapshot) {
    var user_activity = snapshot.val()

    if(user_activity == null) {
      return null;
    } else {
      return new UserActivity(snapshot.key,
                       user_activity.activity_id,
                       user_activity.freq,
                       user_activity.completed_instances,
                       user_activity.last_completed_date,
                       user_activity.date,
                       user_activity.created_on);
      }
}
function createSurvey(snapshot){
    var survey = snapshot.val();

    if(survey == null) {
      return null;
    } else {
      return new Survey(snapshot.key,
                        survey.name,
                        survey.description,
                        new Date(survey.date),
                        survey.form_link,
                        survey.locked_text);
    }
}
function parse(snapshot, key) {
    var elements = [];

    snapshot.child(key).forEach(function(element){
        elements.push(element.val());
    });

    return elements;
}
function parseExtraInfo(snapshot) {
    var info = [];

    snapshot.child("extra_info").forEach(function(info_snapshot){
        info.push(info_snapshot.val());
    });

    return info;
}
function set(ref, data, callback) {
    ref.set(data, function(error){
        if(error) {
            callback(false);
        } else {
            callback(true);
        }
    });
}
function update(ref, data, callback) {
    ref.update(data, function(error){
        if(error) {
            callback(false);
        } else {
            callback(true);
        }
    });
}
function setAll(ref, dataArray, callback){
    var setAllSuccessfully = true;

    dataArray.forEach(function(data){
       ref.set(data, function(error){
           if(error){
               setAllSuccessfully = false;
           }
       });
    });
    callback(setAllSuccessfully);
}
function remove(ref, callback){
    ref.remove(function(error){
        if(error) {
            callback(false);
        } else {
            callback(true);
        }
    });
}
function removeAll(refArray, callback){
    var removedAllSuccessfully = true;

    refArray.forEach(function(ref){
       ref.remove(function(error){
        if(error) {
            removedAllSuccessfully = false;
        }
        });
    });
    callback(removedAllSuccessfully);
}