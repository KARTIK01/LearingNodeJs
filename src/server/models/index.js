import fs from "fs";
import _ from "lodash";
import mongoose from "mongoose";
import config from "../config";
// use bluebird promise for mongoose promises
mongoose.Promise = Promise;

/** Expose all models */
exports = module.exports;


export function init() {
    let connectionUrl;
    /** Connect with the database here */
    let dbConf                                   = config.get('database');
    let {user, host, schema: database, password} = dbConf;

    connectionUrl = `mongodb://`;
    if (user && password) connectionUrl += `${user}:${password}@`;
    connectionUrl += `${host}/${database}`;

    const timeout = 5 * 60 * 1000;

    const mongooseOptions = {
        db     : {native_parser: true},
        server : {
            // default pool size is 5
            poolSize     : 5,
            socketOptions: {keepAlive: 120, connectTimeoutMS: timeout}
        },
        replset: {socketOptions: {keepAlive: 120, connectTimeoutMS: timeout}},
    };

    mongoose.connect(connectionUrl, mongooseOptions);

    // pre-load all models
    fs.readdirSync(__dirname).filter((file) => {
        return (file.indexOf(".") > 0) && (file !== "index.js");
    }).forEach((name) => {
        _.extend(module.exports, require('./' + name));
    });
    // _.extend(module.exports, require('./development-flow'));

    return Promise.resolve();
}

// expose mongoose connection object
module.exports.mongoose = mongoose;
