import React from 'react';
import {
	StyleSheet,
	Text,
	View,
    Linking
} from 'react-native';
import { Icon,
       registerCustomIconType,
        Button
} from 'react-native-elements';
import Panel from 'react-native-panel';
import Reminder from './Reminder.js';
import * as Notification from './Notification'
import MoreDetailsModal from "./MoreDetailsModal";


function Action(props) {
	if (props.action && props.actionName) {
        return(
            <View style = {{marginBottom: 6, marginTop:6, marginLeft: -6}}>
                <Button
                    raised title={props.actionName}
                    backgroundColor = '#F8F8FF'
                    color = 'black'
                    fontWeight = 'bold'
                    onPress={props.action}
                />
		    </View>
	    )
	}
	return(null)
}

function Video(props) {
	if (props.link) {
		return(
			<View>
				<Icon
                    reverse
                    raised
                    name="video-camera"
                    type="font-awesome"
                    color='#8B0000'
                    size={17}
                    onPress={ ()=>{ Linking.openURL(props.link)}}
		        />
		    </View>
        )
  }
  return(null)
}

function Image(props) {
    if (props.link) {
        return(
            <View>
                <Icon
                    reverse
                    raised
                    name="camera"
                    type="font-awesome"
                    color='#620039'
                    size={17}
                    onPress={ ()=>{ Linking.openURL(props.link)}}
                />
            </View>
        )
    }
    return(null)
}

function External(props) {
	if (props.link) {
		return(
			<View>
                <Icon
                    reverse
                    raised
                    name="external-link"
                    type="font-awesome"
                    color='#191970'
                    size={17}
                    onPress={ ()=>{ Linking.openURL(props.link)}}
                />
	        </View>
    )
  }
  return(null)
}


function Completed(props) {
    if(props.completed > 0) {
        return (
            <View>
			<View>
                <Icon
                    reverse
                    raised
                    name="undo"
                    type="MaterialCommunityIcons"
                    color='#dd1212'
                    size={17}
                    onPress={props.callback}
                />
	        </View>
            </View>
        )
    }
    return(null)
}

function CompletedMessage(props){
    if(props.completed > 0){
        const timeWord = props.completed === 1 ? "time" : "times";
        return(
        <Text>Completed {props.completed + ' ' + timeWord}</Text>
        )
    }
    return(null)
}

function SetNotification(date, activityName){
    if(date){
        const message = 'Reminder: ' + activityName;
        Notification.CreateScheduledNotification(date, message);
    }
}

function List(props) {
    if(props.listItems && props.listItems.length > 0) {
        const items = props.listItems.map((item, index) => {
            return (
                <Text
                    style={styles.myDescription}
                    onPress={() => Linking.openURL(item)}
                    key={index}
                >
                    {item}
                </Text>
            )
        });
        return (
            <View>
                {items}
            </View>
        )
    }
    return(null)
}

export default class PanelItem extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    togglePanel(){
        if(this.arrow) this.arrow.flipArrow();
    }
    
    renderHeader() {
        return (
          <View style={styles.myHeader}>
            <Text style={styles.myHeaderText}>{this.props.header}</Text>
            <Icon
                name='angle-down'
                type="font-awesome"
                color="black"
                size={20}
            />
          </View>
        );
    }

    render() {
        const length = 600;
        let text;
        if(this.props.text.length > length) {
            text = (
                <View>
                    <Text style={styles.myDescription}>
                        {this.props.text.substring(0, length) + "..."}
                    </Text>
                    <View style = {{padding: 13, paddingLeft: 24,backgroundColor: 'white'}}>
                    <MoreDetailsModal
                        titleClick="More details..."
                        title={this.props.header}
                        details={this.props.text}
                        textStyle={styles.myDescription}
                        videoLink={this.props.videoLink}
                        link={this.props.externalLink}
                        image={this.props.imageLink}
                    />
                    </View>
                </View>
            );
        }
        else {
            text = (
                <Text style={styles.myDescription}>
                    {this.props.text}
                </Text>
            );
        }

        let content;
        if(this.props.locked){
            content = (
                <Text style={styles.myDescription}>{this.props.locked}</Text>
            )
        }
        else {
            content = (
                <View>
                    <View>
                        {text}
                        <List listItems={this.props.listItems} listTitle={this.props.listTitle}/>
                        <View style={{flexDirection: 'row', paddingLeft: 15, backgroundColor:'white'}}>
                            <Action action={this.props.action} actionName={this.props.actionName} />
                            <Video link={this.props.videoLink}/>
                            <Image link={this.props.imageLink}/>
                            <External link={this.props.externalLink}/>
                            <ToDoReminder todo={this.props.todo} date={this.props.date} dateTime={this.props.dateTime} callback={this.props.todoAction} header={this.props.header}/>
                            <ToDoMarkAsCompleted todo={this.props.todo} date={this.props.date} dateTime={this.props.dateTime} callback={this.props.todoAction} header={this.props.header}/>
                            <Completed
                            completed={this.props.completed}
                            callback={this.props.completedAction}/>
                        </View>
                        <View style={styles.myDescription}>
                            <ToDoMessage todo={this.props.todo} date={this.props.date} dateTime={this.props.dateTime} callback={this.props.todoAction} header={this.props.header}/>
                            <CompletedMessage 
                            completed={this.props.completed}
                            callback={this.props.completedAction}/>
                        </View>
                    </View>
                </View>
            )
        }
        return(
            <Panel style={styles.panelHeader} header={this.renderHeader.bind(this)} onPress={this.togglePanel.bind(this)}>
                {content}
            </Panel>
        )
    }
}

function ToDoReminder(props) {
    if(props.todo > 0) {
       const event = props.dateTime;
       return(
           <Reminder activityName={props.header} isEvent={event} date={props.date} callback={SetNotification}/>
       )
    }
    return(null)
}

function ToDoMarkAsCompleted(props){
    if(props.todo > 0) {
        return(
            <View>
            <Icon
                reverse
                raised
                name="check"
                type="EvilIcons"
                color='#00b718'
                size={17}
                onPress={props.callback}
		      />
            </View>
        )
    }
    return(null)
}


function ToDoMessage(props){
    if(props.todo > 0) {
        let complete;
        if(props.dateTime) {
            let dateTimeWithoutYear = props.dateTime.toDateString().split(" ");
            dateTimeWithoutYear.splice(3, 1);
            dateTimeWithoutYear = dateTimeWithoutYear.join(" ");
            const minutes = props.dateTime ? (props.dateTime.getMinutes() === 0 ? '00' : props.dateTime.getMinutes()+'') : null;
            const amPm = props.dateTime.getHours() < 12 ? "AM" : "PM";
            const dateTimeHours = props.dateTime.getHours();
            const hours = dateTimeHours === 0 ? 12 : (dateTimeHours > 12 ? dateTimeHours - 12 : dateTimeHours);

            complete = "This event is on " + dateTimeWithoutYear + " at " + hours + ":" + minutes + " " + amPm;
        }
        else if(props.date) {
            let timeVar;
            if(props.todo === 1){
                timeVar ='time';
            } else {
                timeVar='times';
            }
            let dateWithoutYear = props.date.toDateString().split(" ");
            dateWithoutYear.splice(3, 1);
            dateWithoutYear = dateWithoutYear.join(" ");

            complete = "Complete " + props.todo + " more " + timeVar + " before " + dateWithoutYear;
        }

        return(
            <Text>{complete}</Text>
        )
    }
    return(null)
}

const styles = StyleSheet.create({
    myDescription: {
        paddingTop: 10,
        paddingRight: 25,
        paddingBottom: 7,
        paddingLeft: 25,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    panelHeader: {
        backgroundColor: '#F8F8FF',
        margin: 1,
    },
    myHeader: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 15
    },
    myHeaderText: {
        flex: 2,
        padding: 20,
        fontSize: 18,
        fontWeight: 'bold'
    },
});