/**
 * Created by anand on 19/10/16.
 */
import moment from 'moment'
import mongoose, {Schema} from 'mongoose'

import * as errors from '../errors'

const ResetTokenSchema = new Schema({
    // access token of the user
    token:{ type:String, required:true },

    // user for which token was issued
    user:{ type:Schema.Types.ObjectId, ref:'UserAccount', required:true },

    // no of times token has been attempted for usage
    hits:{ type:Number, default:0 },

    // expiry time of the token
    expirationTime:{ type:Date, required:true }
});

/**
 * Helper method to validate a given reset token
 * @param resetToken
 * @return {Query|*|Promise}
 */
ResetTokenSchema.statics.validateToken = async function (resetToken) {

    let tokenInfo = await ResetTokenModel.findOne({ "token":resetToken });
    if (!tokenInfo) throw new errors.ValidationError({ message:`Invalid reset token '${resetToken}.'` });

    let user = tokenInfo.user;

    // increment the hits counter for the token
    await ResetTokenModel.update({
        _id:tokenInfo._id
    }, {
        $inc:{ hits:1 }
    });

    let now = moment();
    let tokenExpiry = moment(tokenInfo.expirationTime);
    if (now > tokenExpiry) throw new errors.ValidationError({ message:"Token has expired" });

    return tokenInfo;
};

const ResetTokenModel = mongoose.model('ResetToken', ResetTokenSchema);

export default ResetTokenModel

