import * as _ from "lodash";
import jwtHelper from "../../utils/json-web-token";
import  AccessTokenModel from "../../models/access-token";
import * as errors from "../../errors";

let apiUtils = {
    generateLoginToken(userInfo) {
        let tokenPayload = _.pick(userInfo, ["_id", "name", "role"]);
        return jwtHelper.generateToken(tokenPayload)
            .then(token => apiUtils.storeLoginToken(token, userInfo).then(() => token));
    },

    /**
     * Store the generated token for a user after the user logins
     */
    storeLoginToken:(token, user) => {
        return new AccessTokenModel({
            token:token,
            user :user._id
        }).save();
    },


    async checkUserID(UserModel, userID){
        let count = await UserModel.count({ _id:userID });
        if (count == 0) throw new errors.NotFoundError({ message:`User id '${userID}' not found.` })
    }
};


export default  apiUtils;