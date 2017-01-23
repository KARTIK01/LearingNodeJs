import UserAccountModel from "../models/user-account";
import * as errors from "../errors";

const usersApi = {

    /**
     * Create a new user
     * @param object
     * @param options
     */
    async register(object, options) {
        return await usersApi.loginOrRegister(object, options);
    },

    async loginOrRegister(object, options) {
        let response;
        let {email, password}  = object;

        let userInfo = await UserAccountModel.findOne({email: email});

        if (!userInfo) {
            userInfo = await new UserAccountModel({
                email   : email,
                password: password
            }).save();
            response = {
                message: 'Register Successful.',
                token  : "token"
            };
        }
        else {
            let isPasswordMatched = userInfo.password == password;
            if (!isPasswordMatched)
                throw new errors.UnauthorizedError({message: 'Wrong Password.'});

            response = {
                message: 'Login Successful.',
                token  : "token"
            };
        }
        return response;
    },

    async checkEmailAvailable(object, options){
        let response;
        let {email} = options.query;

        if (!email) throw new errors.BadRequestError({message: "Email not provided."});

        let emailCount = await UserAccountModel.count({email: email});
        if (emailCount > 0) throw new errors.ValidationError({message: "Duplicate Email."});

        return {
            message: 'Email available.'
        }
    },

    async forgotPassword(obejct, options){
        let {headers, query : qparams} = options;
        let {email}                    = qparams;

        if (!email) throw new errors.BadRequestError({message: "Email not provided."});

        let userInfo = await UserAccountModel.findOne({email: email});
        if (!userInfo) throw new errors.ValidationError({message: "No user with given email"});

        //TODO send mail

        return {
            message: `Email has been sent to ${email}.`
        }
    },

    async resetPassword(obejct, options){

    }
};

export default usersApi;