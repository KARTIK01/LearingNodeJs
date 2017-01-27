import {DEFAULT_JOKES_CHUNK_SIZE, DEFAULT_JOKE_IMAGE_URL, DEFAULT_JOKE_IMAGE_TITTLE} from "../constants/applications";
import JokesModel from "../models/jokes";
import {LANGUAGE, CATEGORY} from "../constants/database";

let defaultCategories = [CATEGORY.RANDOM];
const jokesApi = {

    /**
     * Create a new user
     * @param object
     * @param options
     */
    async fetchJokes(object, options) {
        let { query : qParam } =  options;
        let { startIndex = 0, endIndex = 0, categories, language } =  qParam;
        if (isNaN(startIndex)) startIndex = 0;
        if (endIndex <= startIndex) endIndex = parseInt(startIndex) + DEFAULT_JOKES_CHUNK_SIZE;


        let jokes = await JokesModel.find({
            index     :{ $gt:startIndex, $lt:endIndex },
            categories:categories,
            language  :language
        });

        return {
            message:"Have some funny jokes",
            object :qParam,
            jokes  :jokes
        }
    },


    async saveSingleJoke(object, options) {
        let { text, tittle, imageUrl, language, categories } =  object;
        if (!text) throw  new error.assert.ValidationError({ message:"joke text is must" });

        let currentJoke = await new JokesModel({
            text      :text,
            tittle    :tittle || DEFAULT_JOKE_IMAGE_TITTLE,
            imageUrl  :imageUrl || DEFAULT_JOKE_IMAGE_URL,
            language  :language || LANGUAGE.ENGLISH,
            categories:categories || defaultCategories
        }).save();

        return {
            message:`Joke Saved `,
            joke   :currentJoke
        }
    }
};

export default jokesApi;