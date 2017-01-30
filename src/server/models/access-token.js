/**
 * Created by anand on 19/10/16.
 */
import mongoose, {Schema} from 'mongoose'
// import baseModel from './base'

const AccessTokenSchema = new Schema({
    // access token of the user
    token:{
        type    :String,
        required:true
    },

    // token issued for the user
    user:{
        type    :Schema.Types.ObjectId,
        ref     :'UserAccount',
        required:true
    }
});

// AccessTokenSchema.plugin(baseModel, {});

const AccessTokenModel = mongoose.model('AccessToken', AccessTokenSchema);

// expose the access model
export default AccessTokenModel;

