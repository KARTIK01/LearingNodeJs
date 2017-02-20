import mongoose, {Schema} from "mongoose";
import _ from "lodash";
import {LANGUAGE, BOOKS_CATEGORY, BOOKS_CONDITION} from "../constants/database";

const BooksSchema = new Schema({

    tittle:{ type:String, required:true },

    author:{ type:String },

    publisher:{ type:String },

    originalPrize:{ type:Number },

    currentPrize:{ type:Number },

    //http://stackoverflow.com/questions/25734092/query-locations-within-a-radius
    //https://www.compose.com/articles/geofile-everything-in-the-radius-with-mongodb-geospatial-queries/
    location:{ type:{ type:String }, coordinates:[Number] },

    categories:[{ type:String, enum:_.values(BOOKS_CATEGORY), required:true }],

    condition:[{ type:String, enum:_.values(BOOKS_CONDITION), required:true }],

    language:{ type:String, enum:_.values(LANGUAGE) },

    user:{ type:Schema.ObjectId, ref:'User', required:true }
});


const Books = mongoose.model('Books', BooksSchema);
export default Books;