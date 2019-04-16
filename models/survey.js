import Model from "react-native-models";

export default class Survey extends Model {
     // MARK: - Intialization
    constructor(uid, name, description, date, form_link, locked_text) {
        super({
            uid: "String",
            date: "String",
            name: "String",
            description: "String",
            form_link: "String",
            locked_text: "String"
        });

        this._uid = uid;
        this._name = name;
        this._date = date;
        this._description = description;
        this._form_link = form_link;
        this._locked_text = locked_text;
    }
    
    
    // MARK: - Testing-related functions
    output() {
        console.warn(this._uid);
        console.warn(this._name);
        console.warn(this._description);
        console.warn(this._date);
        console.warn(this._form_link);
        console.warn(this._locked_text);
    }
}