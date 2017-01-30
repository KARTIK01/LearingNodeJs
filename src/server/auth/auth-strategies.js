import * as errors from '../errors'
import UserAccountModel from '../models/user-account'

const strategies = {

    /**
     * This strategy is used to authenticate users by username or email or phone.
     * @param userName
     * @param password
     * @param done
     * @return {*}
     * @constructor
     */
    async LocalStrategy(userName, password, done)  {
        try {
            let theUser = await UserAccountModel.findOne({ userName:userName });
            if (!theUser)return done(null, false, { message:'User Not Found.' });
            else {
                // check if passwords are equal
                let isEqual = await theUser.comparePassword(password);
                return (isEqual) ? done(null, theUser) : done(null, false, { message:'Incorrect password.' });
            }
        } catch (err) {
            return done(err);
        }
    },

    /**
     * This strategy is used to authenticate users based on a JWT token.
     * Verifies a token and checks for the existence of given id in the database
     * @param jwtPayload
     * @param done
     * @return {*}
     * @constructor
     */
    async JwtStrategy(jwtPayload, done) {
        let theUser = await UserAccountModel.findOne({ _id:jwtPayload._id });
        return theUser ? done(null, theUser) : done(null, false);
    }
};

module.exports = strategies;
