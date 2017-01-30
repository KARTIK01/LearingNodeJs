var passport = require('passport');
import * as strategies from "./auth-strategies";

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

exports.init = function initPassport(config) {

    const tokenSecret = config.get("tokenSecret");

    // Initialize passport for authentication
    const jwtOptions = {
        secretOrKey   :tokenSecret,
        jwtFromRequest:ExtractJwt.fromAuthHeader()
    };

    passport.use(new JwtStrategy(jwtOptions, strategies.JwtStrategy));
};