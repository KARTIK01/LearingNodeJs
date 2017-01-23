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

    async  loginOrRegister(object, options) {
        let response;
        let {email, password}  = object;

        let userInfo = await UserAccountModel.findOne({email: email});

        if (!userInfo) {
            userInfo = await new UserAccountModel({
                email   : email,
                password: password
            }).save();
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
    }

};

export default usersApi;