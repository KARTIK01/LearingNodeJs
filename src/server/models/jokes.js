import mongoose, {Schema} from "mongoose";
import _ from "lodash";
import {LANGUAGE, CATEGORY} from "../constants/database";

const JokesCategory = new Schema({
    category: {type: String, enum: _.values(CATEGORY), required: true},
});


const JokesSchema = new Schema({

    tittle    : {type: String, trim: true},
    text      : {type: String, trim: true},
    imageUrl  : {type: String, trim: true},
    categories: [JokesCategory],
    language  : {type: String, enum: _.values(LANGUAGE), required: true},
});

const Jokes = mongoose.model('Jokes', JokesSchema);
export default Jokes;