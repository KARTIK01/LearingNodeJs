import mongoose, {Schema} from "mongoose";
import _ from "lodash";
import {LANGUAGE, BOOKS_CATEGORY, BOOKS_CONDITION} from "../constants/database";

const Location = new Schema({
    latitude :{ type:Number },
    longitude:{ type:Number },
});

const BooksSchema = new Schema({

    tittle:{ type:String, required:true },

    author:{ type:String },

    publisher:{ type:String },

    originalPrize:{ type:Number },

    currentPrize:{ type:Number },

    location:{ type:Location, required:true },

    categories:[{ type:String, enum:_.values(BOOKS_CATEGORY), required:true }],

    condition:[{ type:String, enum:_.values(BOOKS_CONDITION), required:true }],

    language:{ type:String, enum:_.values(LANGUAGE) },

    user:{
        type:Schema.ObjectId, ref:'User', required:true
    }
});

const Jokes = mongoose.model('Books', BooksSchema);
export default Jokes;