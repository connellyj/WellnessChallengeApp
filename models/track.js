import Model from "react-native-models";

export default class Track extends Model {
     // MARK: - Intialization
    constructor(id, name, description, image) {
        super({
            id: "String",
            name: "String",
            description: "String",
            image: "String"
        });

        this._id = id;
        this._name = name;
        this._description = description; 
        this._image = image;
    }
    
    // MARK: - Testing-related functions
    output() {
        console.warn(this._id);
        console.warn(this._name);
        console.warn(this._description);
        console.warn(this._image);
    }
}