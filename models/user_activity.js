import Model from "react-native-models";

export default class UserActivity extends Model {
    // MARK: - Initialization
    constructor(uid, activity_id, freq, completed_instances, last_completed_date, date, created_on) {
        super({
            uid: "String",
            activity_id: "String",
            freq: "String",
            completed_instances: "Number",
            date: "String",
            last_completed_date: "String",
            created_on: "String",
        });

        this._uid = uid;
        this._activity_id = activity_id;
        this._freq = freq;
        this._completed_instances = completed_instances;
        this._last_completed_date = last_completed_date;
        this._date = date;
        this._created_on = created_on;
    }


    // MARK: - Public functions
    incrementCompletedInstanceCount(){
        this._completed_instances = this._completed_instances + 1;
    }
    decrementCompletedInstanceCount(){
        this._completed_instances = this._completed_instances - 1;
    }

    // MARK: - Testing-related functions
    output() {
        console.warn(this._uid);
        console.warn(this._activity_id);
        console.warn(this._freq);
        console.warn(this._completed_instances);
        console.warn(this._last_completed_date);
        console.warn(this._date);
        console.warn(this._created_on);
    }
}
