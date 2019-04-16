import Model from "react-native-models";

export default class Activity extends Model {
    // MARK: - Intialization
    constructor(uid, name, description, dates, track, web_link, image_link, video_link, freq, freqEnd, location, extraInfo, last_modified) {
        super({
            uid: "String",
            name: "String",
            description: "String",
            dates: "Array",
            track: "String",
            web_link: "String",
            image_link: "String",
            video_link: "String",
            freq: "String",
            freqEnd: "String",
            location: "String",
            extraInfo: "Array",
            last_modified: "String"
        });

        this._uid = uid;
        this._name = name;
        this._description = description;
        this._dates = dates;
        this._track = track;
        this._web_link = web_link;
        this._image_link = image_link;
        this._video_link = video_link;
        this._freq = freq;
        this._location = location;
        this._extraInfo = extraInfo;
        this._freqEnd = freqEnd;
        this._last_modified = last_modified;
    }

    // MARK: - Testing-related functions
    output() {
        console.warn(this._uid);
        console.warn(this._name);
        console.warn(this._description);
        console.warn(this._dates);
        console.warn(this._track);
        console.warn(this._web_link);
        console.warn(this._image_link);
        console.warn(this._video_link);
        console.warn(this._freq);
        console.warn(this._freqEnd);
        console.warn(this._location);
        console.warn(this._extraInfo);
        console.warn(this._last_modified);
    }
}
