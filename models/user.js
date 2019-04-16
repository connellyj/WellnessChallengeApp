import Model from "react-native-models";

export default class User extends Model {
    // MARK: - Initialization
    constructor(uid, name, email, track, reminderHasBeenSet) {
        super({
            uid: "String",
            name: "String",
            email: "String",
            track: "String",
            reminderHasBeenSet: "Number"
        });

        this._uid = uid;
        this._name = name;
        this._email = email;
        this._track = track;
        this._reminderHasBeenSet = reminderHasBeenSet;
    }

    setReminderHasBeenSet(value){
        this._reminderHasBeenSet = value;
    }
    
    // MARK: - Testing-related functions
    output() {
        console.warn(this._uid);
        console.warn(this._name);
        console.warn(this._email);
        console.warn(this._track);
        console.warn(this._reminderHasBeenSet);
    }
}
