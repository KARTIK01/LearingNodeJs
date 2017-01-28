import {DEFAULT_JOKES_CHUNK_SIZE, DEFAULT_JOKE_IMAGE_URL, DEFAULT_JOKE_IMAGE_TITTLE} from "../constants/applications";
import JokesModel from "../models/jokes";
import {LANGUAGE, CATEGORY} from "../constants/database";
import * as error from "../errors";

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
        if (isNaN(endIndex) || endIndex <= startIndex) endIndex = parseInt(startIndex) + DEFAULT_JOKES_CHUNK_SIZE;
        startIndex = parseInt(startIndex);
        endIndex = parseInt(endIndex);

        //skip limit
        let jokes = await JokesModel.find({
            language  :language,
            categories:categories || defaultCategories
        }).limit(endIndex - startIndex).skip(startIndex);

        return {
            message:"Have some funny jokes",
            request:{
                startIndex:startIndex,
                endIndex  :endIndex,
                categories:categories,
                language  :language
            },
            jokes  :jokes
        }
    },


    async saveSingleJoke(object, options) {
        let { text, tittle, imageUrl, language, categories } =  object;
        if (!text) throw  new error.ValidationError({ message:"joke text is must" });

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