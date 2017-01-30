const passport = require('passport');
import * as errors from "../errors";

// Check if the authorization header contains the supported scheme.
function isJWTAuthorizationHeader(req) {
    var parts,
        scheme;

    if (req.headers && req.headers.authorization) {
        parts = req.headers.authorization.split(' ');
    } else {
        return false;
    }

    if (parts.length === 2) {
        scheme = parts[0];
        if (/^JWT/i.test(scheme)) {
            return true;
        }
    }
    return false;
}

let auth = {
    authenticateUser(req, res, next) {
        return passport.authenticate('jwt', { session:false }, (err, user, info) => {
            if (err)return next(err);

            let errorMsg;
            if (user) {
                req.authInfo = info;
                req.user = user;
                return next(null, user, info);
            } else if (isJWTAuthorizationHeader(req)) {
                errorMsg = info ? info.message : "Invalid auth token.";
                return next(new errors.BadRequestError({ message:errorMsg }));
            }
        })(req, res, next);
    }
};

module.exports = auth;