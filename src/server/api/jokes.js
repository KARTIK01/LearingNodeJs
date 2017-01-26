import {DEFAULT_JOKES_CHUNK_SIZE} from "../constants/applications";
import JokesModel from "../models/jokes";
const jokesApi = {

    /**
     * Create a new user
     * @param object
     * @param options
     */
    async fetchJokes(object, options) {
        let { query : qParam }                             =  options;

        let { startIndex = 0, endIndex = 0, categories, language } =  qParam;

        if (isNaN(startIndex)) startIndex = 0;

        if (endIndex <= startIndex) endIndex = parseInt(startIndex) + DEFAULT_JOKES_CHUNK_SIZE;


        let jokes = await JokesModel.findOne({ _id:null });

        return {
            message   :"every thing is fine",
            startIndex:startIndex,
            endIndex  :endIndex,
            categories:categories,
            language  :language,
            jokes     :jokes
        }
    },


};

export default jokesApi;