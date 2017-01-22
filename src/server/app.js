import express from "express";
import config from "./config";
const debug = require('debug')('chatteron:app');

module.exports = function setupParentApp() {
    debug('ParentApp setup start');
    const parentApp = express();


    // ## Global settings

    // Make sure 'req.secure' is valid for proxied requests
    // (X-Forwarded-Proto header will be checked, if present)
    parentApp.enable('trust proxy');


    // request logging
    // parentApp.use(logRequest);

    // if (debug.enabled) {
    //     // debug keeps a timer, so this is super useful
    //     parentApp.use((function () {
    //         let reqDebug = require('debug')('chatteron:req');
    //         return function debugLog(req, res, next) {
    //             reqDebug('Request', req.originalUrl);
    //             next();
    //         };
    //     })());
    // }

    // enabled gzip compression by default
    // if (config.get('server').compress !== false) {
    //     parentApp.use(compress());
    // }

    // // Preload link headers
    // if (config.get('preloadHeaders')) {
    //     parentApp.use(netjet({
    //         cache: {
    //             max: config.get('preloadHeaders')
    //         }
    //     }));
    // }

    // Mount the  apps on the parentApp
    // API
    // let apiApp = require('./api/app')();
    // parentApp.use('/api', apiApp);

    // let cacheTime = 86400000;
    // let uploadPath = localStore.getBaseDir();
    // parentApp.use(express.static(uploadPath, {maxAge: cacheTime}));

    debug('ParentApp setup end');

    return parentApp;
};