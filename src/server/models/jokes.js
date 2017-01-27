import mongoose, {Schema} from "mongoose";
import _ from "lodash";
import {LANGUAGE, CATEGORY} from "../constants/database";

const JokesSchema = new Schema({
    index     :{ type:Number, default:0 },
    tittle    :{ type:String, trim:true },
    text      :{ type:String, trim:true },
    imageUrl  :{ type:String, trim:true },
    categories:[{ type:String, enum:_.values(CATEGORY), required:true }],
    language  :{ type:String, enum:_.values(LANGUAGE), required:true },
});

const Jokes = mongoose.model('Jokes', JokesSchema);
export default Jokes;