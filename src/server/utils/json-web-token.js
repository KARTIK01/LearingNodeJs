/**
 * Created by anand on 24/05/16.
 */
const jwt     = require('jsonwebtoken');
const Promise = require('bluebird');
const _       = require('lodash');

const config      = require('../config');
const errors      = require('../errors');
const verifyAsync = Promise.promisify(jwt.verify);

/**
 * Reads secret used to sign all tokens
 */
function readTokenSecret() {
    return Promise.resolve(config.get("tokenSecret"));
}

var jwtHelper = {

    /**
     * Verifies(decodes) a given token with a given secret
     * @param token
     * @returns {Promise.<T>}
     */
    verifyJWToken: function (token) {
        return readTokenSecret().then((jwtSecret) => {
            // verify the token for signature authenticity
            return verifyAsync(token, jwtSecret);
        }).then(function (decoded) {
            return Promise.resolve(decoded);
        }).catch(function onError(error) {
            // decorate the error while decoding
            var errorToPropagate;
            switch (error.name) {
                // token expiration error
                case 'TokenExpiredError':
                    errorToPropagate = new errors.UnauthorizedError({message: error.message});
                    break;
                // token malformed, signature missing, invalid sign etc.
                case 'JsonWebTokenError':
                    errorToPropagate = new errors.BadRequestError({message: error.message});
                    break;
                default:
                    errorToPropagate = error;
                    break;
            }
            return Promise.reject(errorToPropagate);
        });
    },

    /**
     * Generates a new new token from the given payload
     * @param payload
     * @param expiryTime
     */
    generateToken: (payload, expiryTime) => {
        return readTokenSecret().then((jwtSecret) => {
            return new Promise((resolve, reject) => {
                jwt.sign(payload, jwtSecret, {
                    expiresIn: expiryTime
                }, (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                });
            });
        });
    },

    /**
     * Refresh a token either only one or multiple active at a time
     * @param token
     * @returns {*|{get}}
     */
    refreshToken: function (token) {
        return jwtHelper.verifyJWToken(token).then(function (decodedInfo) {
            return jwtHelper.generateToken(decodedInfo);
        });
    }
};

module.exports = jwtHelper;