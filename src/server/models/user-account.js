import mongoose, {Schema} from "mongoose";

const UserSchema = new Schema({
    email   : {type: String, trim: true},
    password: {type: String}
});

const UserAccount = mongoose.model('UserAccount', UserSchema);
export default UserAccount;