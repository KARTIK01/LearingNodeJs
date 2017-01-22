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

/**
 * ### Cache Invalidation Header
 * Calculate the header string for the X-Cache-Invalidate: header.
 * The resulting string instructs any cache in front of the blog that request has occurred which invalidates any cached
 * versions of the listed URIs.
 *
 * `/*` is used to mean the entire cache is invalid
 *
 * @private
 * @param {Express.request} req Original HTTP Request
 * @param {Object} result API method result
 * @return {String} Resolves to header string
 */
cacheInvalidationHeader = function cacheInvalidationHeader(req, result) {
    var parsedUrl  = req._parsedUrl.pathname.replace(/^\/|\/$/g, '').split('/'),
        method     = req.method,
        endpoint   = parsedUrl[0],
        cacheInvalidate,
        jsonResult = result.toJSON ? result.toJSON() : result,
        post,
        hasStatusChanged,
        wasDeleted,
        wasPublishedUpdated;

    if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        if (endpoint === 'settings' || endpoint === 'users' || endpoint === 'db' || endpoint === 'tags') {
            cacheInvalidate = '/*';
        } else if (endpoint === 'posts') {
            post                = jsonResult.posts[0];
            hasStatusChanged    = post.statusChanged;
            wasDeleted          = method === 'DELETE';
            // Invalidate cache when post was updated but not when post is draft
            wasPublishedUpdated = method === 'PUT' && post.status === 'published';

            // Remove the statusChanged value from the response
            delete post.statusChanged;

            // Don't set x-cache-invalidate header for drafts
            if (hasStatusChanged || wasDeleted || wasPublishedUpdated) {
                cacheInvalidate = '/*';
            } else {
                cacheInvalidate = '/' + config.routeKeywords.preview + '/' + post.uuid + '/';
            }
        }
    }

    return cacheInvalidate;
};

addHeaders = function addHeaders(apiMethod, req, res, result) {
    var cacheInvalidation,
        location,
        contentDisposition;

    cacheInvalidation = cacheInvalidationHeader(req, result);
    if (cacheInvalidation) {
        res.set({'X-Cache-Invalidate': cacheInvalidation});
    }

    if (req.method === 'POST') {
        location = locationHeader(req, result);
        if (location) {
            res.set({Location: location});
            // The location header indicates that a new object was created.
            // In this case the status code should be 201 Created
            res.status(201);
        }
    }

    return contentDisposition;
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