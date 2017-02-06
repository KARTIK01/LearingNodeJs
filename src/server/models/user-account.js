import mongoose, {Schema} from "mongoose";
import bcrypt from 'bcrypt'
const compareAsync = Promise.promisify(bcrypt.compare);

const UserSchema = new Schema({
    email   :{ type:String, trim:true },
    mobileNo:{ type:String, trim:true },
    password:{ type:String }
});


UserSchema.method.comparePassword = async function (plainText) {
    return await compareAsync(plainText, this.password);
};

const UserAccount = mongoose.model('UserAccount', UserSchema);
export default UserAccount;