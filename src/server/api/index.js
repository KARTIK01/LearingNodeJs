"use strict";
// import _ from 'lodash'
// import config from '../config'
// Include Endpoints
import usersApi from "./user-account";
import _ from "lodash";


let http,
    addHeaders,
    cacheInvalidationHeader,
    locationHeader,
    contentDispositionHeader,
    init;


init = function init() {
    return Promise.resolve(true);
};


http = function http(apiMethod) {
    return function apiHandler(req, res, next) {
        // We define 2 properties for using as arguments in API calls:
        let object      = req.body,
            requestKeys = ['file', 'files', 'headers', 'params', 'query'],
            options     = _.extend({}, _.pick(req, requestKeys));

        _.extend(options, {
            user: req.user ? req.user : null
        });

        return apiMethod(object, options)
            .tap(response => {
                // Add X-Cache-Invalidate, Location, and Content-Disposition headers
                return addHeaders(apiMethod, req, res, (response || {}));
            })
            .then(response => {
                if (req.method === 'DELETE') {
                    // if response isn't empty then send 200
                    if (response) return res.status(200).send(response);
                    else return res.status(204).end();
                }

                // Keep CSV header and formatting
                if (res.get('Content-Type') && res.get('Content-Type').indexOf('text/csv') === 0) {
                    return res.status(200).send(response);
                }

                // CASE: api method response wants to handle the express response
                // example: serve files (stream)
                if (_.isFunction(response)) {
                    return response(req, res, next);
                }

                // Send a properly formatting HTTP response containing the data with correct headers
                res.json(response || {});
            })
            .catch(error => {
                // To be handled by the API middleware
                next(error);
            })
    };
};

/**
 * ## Public API
 */
module.exports =
    {
        // Extras
        init,
        http,

        // api end points
        usersApi
    };