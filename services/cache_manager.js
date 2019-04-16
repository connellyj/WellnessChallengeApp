// MARK: - Imports
import * as Firebase from 'firebase';
import Activity from '../models/activity';
import UserActivity from '../models/user_activity';
import Track from '../models/track';
import Survey from '../models/survey.js';
import Event from '../models/event.js';
import Model from "react-native-models";
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import User from '../models/user';


// MARK: - Constants
const current_user_path = '/current_user/';
const track_path = '/track/';
const activity_path = '/activity/';
const user_activity_path = '/user-activity/';


// MARK: - User
export async function cacheCurrentUser(user, callback) {
    cache(user, current_user_path, callback);
}
export async function getCurrentUser(callback) {
    fetch(current_user_path, function(value) {
        User.require(User);
        let return_value = (value != null) ? User.deserialize(value) : null;
        callback(return_value);
    });
}
export async function userExists(callback) {
    fetch(current_user_path, function(value) {
        callback(value != null);
    });
}

export async function getCurrentUserId(callback) {
  getCurrentUser((user) => {
    if(user != null) {
      callback(user._uid);
    } else {
      callback(null);
    }
  });
}

// MARK: - Activities
export async function cacheActivity(activity, callback) {
    let path = activity_path + activity._uid;
    cache(activity, path, callback);
}
export async function getActivityWithId(id, callback) {
    let path = activity_path + id;

    fetch(path, function(value) {
      Activity.require(Activity);
      let return_value = (value != null) ? Activity.deserialize(value) : null;
      callback(return_value);
    });
}


// MARK: - User Activities
export async function cacheUserActivity(user_activity, callback) {
    let path = user_activity_path + user_activity._uid;
    cache(user_activity, path, callback);
}
export async function getUserActivityWithId(id, callback) {
    let path = user_activity_path + id;

    fetch(path, function(value) {
        UserActivity.require(UserActivity);
        let return_value = (value != null) ? UserActivity.deserialize(value) : null;
        callback(return_value);
    });
}


// MARK: - Utility functions
export function clearCache(callback) {
      AsyncStorage.getAllKeys((err, keys) => {
          AsyncStorage.multiRemove(keys, (err) => {
              callback(err == null);
          });
      });
}

export async function cacheLogoutBool(bool, callback) {
    try {
        await AsyncStorage.setItem("logout", JSON.stringify(bool));

        if(callback != null) {
          callback(true);
        }
    } catch (error) {
        console.error(error);

        if(callback != null) {
          callback(false);
        }
    }
}

export async function getLogoutBool(callback) {
    fetch("logout", callback);
}

// MARK: - Helper functions
async function cache(model, path, callback) {
    if(model == null) {
      callback(true);
      return;
    }

    try {
        let data = model.serialize();
        await AsyncStorage.setItem(path, data);

        if(callback != null) {
          callback(true);
        }
    } catch (error) {
        console.error(error);

        if(callback != null) {
          callback(false);
        }
    }
}
async function fetch(path, callback) {
    try {
        const value = await AsyncStorage.getItem(path);
        callback(value);
    } catch (error) {
        console.error(error);
        callback(null);
    }
}
