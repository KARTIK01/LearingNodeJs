import UserAccountModel from "../models/user-account";
import ResetTokenModel from '../models/reset-token'
import apiUtils from "./utils/utils";
import * as errors from "../errors";
import moment from "moment";

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
        let { email, password }  = object;

        let userInfo = await UserAccountModel.findOne({ email:email });

        if (!userInfo) {
            userInfo = await new UserAccountModel({
                email   :email,
                password:password
            }).save();

            // generate verification token to authenticate user while resetting the password
            let verificationToken = "1234567890-" || globalUtils.uid(60);

            //TODO send email in the background
            /*
             let siteUrl = config.get('frontend');
             let activateUrl = siteUrl.replace(/\/$/, '') + '/email-verify/?' +
             qs.stringify({verifyToken: globalUtils.encodeBase64URLsafe(verificationToken)}) +
             '/';
             eventsBus.emit(SEND_USER_MAIL_EVENT, {
             subject : `Welcome`,
             template: `welcome`,
             tags    : ['email-verification'],
             email
             }, {siteUrl, activateUrl, documentationUrl});
             */

            await new ResetTokenModel({
                token         :verificationToken,
                user          :userInfo._id,
                expirationTime:moment().add(24, "hours")
            }).save();

            response = {
                message:`Verification mail is sent to email ${email}. Please verify your email id`,
                newUser:true,
                url    :`http://learnnode.io:8080/api/email-verification?verifyToken=${verificationToken}`
            };
        }
        else {
            let isPasswordMatched = await userInfo.comparePassword(password);
            if (!isPasswordMatched)
                throw new errors.UnauthorizedError({ message:'Wrong Password.' });


            // generate login token for the user
            let token = await apiUtils.generateLoginToken(userInfo);

            // store the generated token
            await apiUtils.storeLoginToken(token, userInfo);
            response = {
                message:'Login Successful.',
                token  :token
            };
        }
        return response;
    },

    async checkEmailAvailable(object, options){
        let response;
        let { email } = options.query;

        if (!email) throw new errors.BadRequestError({ message:"Email not provided." });

        let emailCount = await UserAccountModel.count({ email:email });
        if (emailCount > 0) throw new errors.ValidationError({ message:"Duplicate Email." });

        return {
            message:'Email available.'
        }
    },

    async login(object, options){
        let { email, password }  = object;

        const userInfo = await UserAccountModel.findOne({ email:email });
        if (!userInfo) throw new errors.NotFoundError({ message:`User ${email} Not Found.` });

        let isMatch = await userInfo.comparePassword(password);
        if (!isMatch) throw new errors.UnauthorizedError({ message:'Wrong Password.' });

        // generate login token for the user
        let token = await apiUtils.generateLoginToken(userInfo);

        // store the generated token
        await apiUtils.storeLoginToken(token, userInfo);
        return {
            message:'Login Successful',
            token  :token
        };
    },

    async forgotPassword(obejct, options){
        let { headers, query : qparams } = options;
        let { email }                    = qparams;

        if (!email) throw new errors.BadRequestError({ message:"Email not provided." });

        let userInfo = await UserAccountModel.findOne({ email:email });
        if (!userInfo) throw new errors.ValidationError({ message:"No user with given email" });

        //TODO send mail

        return {
            message:`Email has been sent to ${email}.`
        }
    },

    async resetPassword(object, options){

    },

    /**
     * Verify the email id of the user against the reset token issued for the user on given email id
     * @param object
     * @param options
     * @return {{message: string}}
     */
    async verifyEmail(object, options){
        let { query : qParams } = options;
        let { verifyToken } = qParams;

        let tokenInfo = await ResetTokenModel.validateToken(verifyToken);
        let userInfo = await UserAccountModel.findOne({ _id:tokenInfo.user });
        //TODO change status to verified
        // userInfo.auth.local.status = DB_CONSTANTS.VERIFICATION.VERIFIED;
        // mark the user verified
        // await userInfo.save();

        // TODO send welcome mail
        // await userUtils.sendWelcomeMail(userInfo);

        // generate login token for the user
        let token = await apiUtils.generateLoginToken(userInfo);
        console.log("ok2");
        return {
            message:`Email verified successfully.`,
            token  :token
        }
    },
};

export default usersApi;