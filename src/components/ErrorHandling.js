import React from "react";
import {Alert} from 'react-native';
const loaderHandler = require('react-native-busy-indicator/LoaderHandler');

//ERROR HANDLING

//WRITE
export function submitSurveyAnswerCallback(success){
    if(!success) {
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, we were unable to submit your survey. Please check your internet connection and try again.")
        )
    } 
}

export function loginCallback(errorMessage){
    if (errorMessage !== null){
        loaderHandler.hideLoader();
        return(
        Alert.alert(errorMessage)
        )
    }
    return(null);
}

export function logoutCallback(login){
    if (login==null){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, we were unable to log you out. Please check your internet connection and try again.")
        )
    }
}

export function createAccountCallback(errorMessage){
    if(errorMessage !== null){
        loaderHandler.hideLoader();
        return(
        Alert.alert(errorMessage)
        )
    }
    return(null);
}

export function changeTrackForUid(success){
    if (!success){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, we were unable to complete your request to switch tracks. Please check your internet connection and try again.")
        )
    }
}


//to be used for: set, update, setAll, remove, removeAll, removeUserActivityForUid, removeUserActivitiesForUid, incrementUserActivityCompletedInstances, addListenerToAllUserActivities, addUserActivityForUid, addUserActivitiesForUid
export function generalWriteCallback(success){
    if(!success){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry! Something went wrong with our system. Please check your internet connection and try again.")
        )
    }
    return(null)
}

//READ

export function getAllTracksCallback(tracks){
   if(tracks==null){
       loaderHandler.hideLoader();
       return(
       Alert.alert("We're sorry, something went wrong with our database. Please check your internet connection and try again.")
       )
   } else {
       return(tracks)
   }
}

export function getTrackForUidCallback(track){
    if(track==null){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, something went wrong with our database. Please check your internet connection and try again.")
        )
    } else {
        return(track)
    }
}

export function getActivitiesForTrackCallback(activities){
    if(activities==null){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, something went wrong with our database. Please check your internet connection and try again.")
        )
    } else {
        return(activities)
    }
}

export function getAllActivitiesCallback(activities){
    if(activities==null){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, something went wrong with our database. Please check your internet connection and try again.")
        )
    } else {
        return(activities)
    }
}

export function getActivityWithIdCallback(activity){
    if(activity==null){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, something went wrong with our database. Please check your internet connection and try again.")
        )
    } else {
        return(activity)
    }
}

export function getActivitiesByIdCallback(activity){
    if(activity==null){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, something went wrong with our database. Please check your internet connection and try again.")
        )
    } else {
        return(activity)
    }
}

export function getSurveyWithIdCallback(survey){
    if(survey==null){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, something went wrong with our survey database. Please check your internet connection and try again.")
        )
    } else {
        return(survey)
    }
}

export function getQuestionsForSurveyIdCallback(survey){
    if(survey==null){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, something went wrong with our survey database. Please check your internet connection and try again.")
        )
    } else {
        return(survey)
    }
}

export function getUserActivitiesForUidCallback(activities){
    if(activities==null){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, something went wrong with our survey database. Please check your internet connection and try again.")
        )
    } else {
        return(activities)
    }
}

export function getUserActivityForUidCallback(activity){
    if(activities==null){
        loaderHandler.hideLoader();
        return(
        Alert.alert("We're sorry, something went wrong with our survey database. Please check your internet connection and try again.")
        )
    } else {
        return(activity)
    }
}

export function generalReadCallback(readItem){
    if(readItem == null){
        loaderHandler.hideLoader();
        return(
            Alert.alert("We're sorry! Something went wrong with our system. Please check your internet connection and try again.")
        )
    }
    return(null);
}
