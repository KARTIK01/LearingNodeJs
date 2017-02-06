import UserAccount from "../models/user-account";
import Books from "../models/books";
import apiUtils from "./utils/utils";
import {CATEGORY, DEFAULT_RADIUS} from "../constants/database";
import * as error from "../errors";
import * as _ from "lodash";

let defaultCategories = [CATEGORY.RANDOM];
const booksApi = {

    async registerUser(object, options) {
        let { deviceId } = object;

        // if (!deviceId)  throw  new error.ValidationError({ message:"send device id" });
        let user = await new UserAccount().save();

        return {
            message:"New user created",
            user   :user
        }
    },

    async getBooks(object, options) {
        let { params: urlParams } = options;
        let { userID } = urlParams;

        await apiUtils.checkUserID(UserAccount, userID);

        let selectFields = ['_id', 'tittle', 'author', 'publisher', 'location'];
        selectFields = _.join(selectFields, ' ');

        let books = await Books.find({ user:userID })
            .select(selectFields)
            .lean();

        return {
            message:"Books fetched successfully",
            books  :books
        }
    },

    async getBook(object, options) {
        let { params: urlParams } = options;
        let { userID, bookID } = urlParams;

        await apiUtils.checkUserID(UserAccount, userID);

        let book = await Books.findOne({ _id:bookID, user:userID }).lean();

        if (!book) throw new error.NotFoundError({ message:`Book '${bookID}' not found.` });

        return {
            message:"Book fetched successfully",
            books  :book
        }
    },

    async saveBooks(object, options) {
        let { params: urlParams } = options;
        let { userID } = urlParams;

        await apiUtils.checkUserID(UserAccount, userID);

        let books = object;
        let saveData = null;

        if (_.isArray(books)) {
            _.forEach(books, book => {
                _.extend(book, { user:userID });
            });
            saveData = await Books.insertMany(books);
        }

        return {
            message:`Books added successfully`,
            books  :books
        }
    },

    async deleteBook(object, options) {
        let { params:urlParams } = options;
        let { userID, bookID } = urlParams;

        await apiUtils.checkUserID(UserAccount, userID);

        let book = await Books.findOne({ _id:bookID, user:userID });
        if (!book) throw new error.NotFoundError({ message:`Book '${bookID}' not found.` });

        // delete the book along with other information
        await book.remove();

        return {
            message:"Book deleted successfully.",
            data   :book
        }
    },

    async fetchBook(object, options){
        let { params : urlParams } = options;
        let { longitude, latitude , radius = DEFAULT_RADIUS } =urlParams;
    }
};

export default booksApi;