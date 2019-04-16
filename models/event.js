import Model from "react-native-models";

export default class Event extends Model {
    // MARK: - Initialization
    constructor(uid, name, description, date, location) {
        super({
            uid: "String",
            name: "String",
            description: "String",
            dates: "String",
            location: "String"
        });

        this._uid = uid; 
        this._name = name; 
        this._description = description;
        this._date = date;
        this._location = location;
    }
    
    // MARK: - Testing-related functions
    output() {
        console.warn(this._uid);
        console.warn(this._name);
        console.warn(this._description);
        console.warn(this._dates);
        console.warn(this._location);
    }
}