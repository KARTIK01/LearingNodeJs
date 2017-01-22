'use strict';
/* eslint-disable global-require, no-process-env */

// Register babel hook so we can write the real entry file (server.js) in ES6
// In production, the es6 code is pre-transpiled so it doesn't need it
if (process.env.NODE_ENV !== 'production') {
    require("source-map-support").install();
    require('babel-register');
}

if (process.env.NODE_ENV === 'production') {
    require('newrelic');
}

// The BabelJS polyfill is needed in production too
require('babel-polyfill');

// Setup Bluebird as the global promise library
global.Promise = require('bluebird');

// Module dependencies
const _       = require('lodash');
const uuid    = require('uuid');
const chalk   = require('chalk');
const express = require('express');

const co  = Promise.coroutine;
var debug = require('debug')('learningnodejs:boot:init');

const api           = require('./api');
const models        = require('./models');
const ServerFactory = require('./Server');
let init            = co(function*() {
    try {
        debug("Init Start...");

        // // Initialize Internationalization
        // i18n.init();
        // debug('I18n done');

        // Initialise the models
        // yield Promise.all([models.init()]);
        // debug('Models & database done');

        yield Promise.all([api.init()]);
        // yield Promise.all([api.init(), cronJobs.init()]);
        debug('API done');

        // return permissions.init();
        debug('Permissions done');

        // Setup our collection of express apps
        let parentApp = require('./app')();
        // debug('Express Apps done');
        //
        // let response = yield auth.init(config);
        // parentApp.use(response.auth);
        // debug('Auth done');
        //
        let server = new ServerFactory(parentApp);
        debug('...Init End');
        //
        // debug('Starting Server...');
        // Let Ghost handle starting our server instance.
        return yield server.start(parentApp);

    } catch (err) {
        console.log(err);
        // logging.error(new errors.ChatteronError({err: err}));
        process.exit(0);
    }
});

init();