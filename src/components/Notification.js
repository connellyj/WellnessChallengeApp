// COMMENTED OUT UNTIL FIX IOS
 import React from 'react';
 const PushNotification = require('react-native-push-notification');

 export function CreateScheduledNotification(date, message) {
     PushNotification.configure({
       // Called when a remote or local notification is opened or received
       onNotification: function(notification) {
           //console.warn( 'NOTIFICATION:', notification.message, notification.date);
       },
   });
   const notification = {
       /* Android Only Properties */
       largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
       smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"

       /* iOS and Android properties */
       message: message,
       date: date,

   };
   PushNotification.localNotificationSchedule(notification);
 }

 // TODO: this isn't working
 export function CancelNotification(uniqueId) {
     PushNotification.cancelLocalNotifications({id: '' + uniqueId});
 }
