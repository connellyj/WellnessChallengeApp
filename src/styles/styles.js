import React from 'react';
import { StyleSheet } from 'react-native';
import { registerCustomIconType }from 'react-native-elements';

const styles = StyleSheet.create({
    contentContainerStyle: {
        paddingBottom: 20,
    },
    contentFormStyle: {
        flex: 1,
        paddingVertical: 40,
        height: 680,
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container_center: {
        paddingTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    container_margin: {
        padding: 30,
        flex: 1,
    },
    myDescription: {
        padding: 10,
    },
    customContent: {
        backgroundColor: '#bada55',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    img: {
    	width: 40, 
    	height: 40,
    	margin: 10,
    },
    buttonRow: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        flexDirection: 'row',
    },
    buttonRowProfile: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 13,
        flexDirection: 'row',
    },
    flexBox: {
        flex: 1, 
        flexDirection: 'row',
        height: 10, 
        paddingVertical: 15,
    },
    consentButtons: {
        paddingVertical: 15,
    },
    profileContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20
    },
    circularImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        width: 150,
        borderRadius: 75,
        backgroundColor: '#3498db'
    },
    circularText: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    largeText: {
        fontSize: 75
    },
    welcomeImage: {
        flex: 2,
        height: undefined,
        width: undefined
    },
    profileName: {
        paddingVertical: 15,
        fontSize: 22,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
    },
    currentTrack: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        height: 40,
        fontSize: 22,
    },
    numCompleted: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        height: 40,
        fontSize: 18
    },
    settings: {
        textAlign: 'center',
        textAlignVertical: 'bottom',
        backgroundColor: '#A7A3AC',
        color: 'black',
        height: 35,
        fontWeight: 'bold',
        fontSize: 22
    },
    login: {
        width: 300,
        flex: 1
    },
    login_page: {
        paddingVertical: 15,
        padding: 20,
    },
    input: {
        height: 40,
        width: 300,
        borderWidth: 2,
        padding: 5,
        margin: 5,
        borderColor: 'rgba(0,30,30,0.1)',
        backgroundColor: 'rgba(0,30,30,0.1)',
    },
    text: {
        height: 20,
        width: 300,
    },
    upcomingText: {
        fontSize: 30,
        backgroundColor: '#F0F8FF',
        color: 'black',
        borderBottomColor: 'black',
        height: 27,
        textAlignVertical: 'bottom',
    },
    nothingCompletedText: {
        fontSize: 24,
        textAlign: 'center',
        padding: 30,
        marginTop: 20,
        fontWeight:"300"
    },
    nothingThisWeekText: {
        fontSize: 24,
        textAlign: 'center',
        padding: 20,
        fontWeight: "300"
    }
});

module.exports = styles;