import authentication from "./authentication";
import passport from './passport'

exports.init = function (nConfig) {
    return passport.init(nConfig).then(function (response) {
        return { auth:response.passport };
    });
};


module.exports.authenticate = authentication;