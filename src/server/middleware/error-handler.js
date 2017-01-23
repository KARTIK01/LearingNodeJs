import _ from "lodash";
import * as errors from "../errors";

const internals    = {};
const errorHandler = {};

/**
 * Get an error ready to be shown the the user
 *
 * @TODO: support multiple errors
 * @TODO: decouple req.err
 */
internals.prepareError = function prepareError(err, req, res, next) {
    // In case of a ChatteronError class, use it's data
    // Otherwise try to identify the type of error (mongoose validation, mongodb unique, ...)
    // If we can't identify it, respond with a generic 500 error
    if (!(err instanceof errors.CustomError)) {
        // We need a special case for 404 errors
        if (err.statusCode && err.statusCode === 404) {
            err = new errors.NotFoundError({err: err});
        } else {
            err = new errors.CustomError({err: err, statusCode: err.statusCode});
        }
    }

    if (!err || err.statusCode >= 500) {
        // Try to identify the error...
        // ...
        // Otherwise create an InternalServerError and use it
        // we don't want to leak anything, just a generic error message
        // Use it also in case of identified errors but with httpCode === 500
        err = new errors.CustomError({err: err});
    }

    console.log(err);

    // Handle validation errors
    // Todo add multiple error messages for validation error
    if (err.name === 'ValidationError') {
        // responseErr = new errors.BadRequestError({message: err.message}); // TODO standard message? translate?
        // jsonRes.errors = _.map(err.errors, (mongooseErr) => {
        //     return {
        //         message: mongooseErr.message,
        //         path   : mongooseErr.path,
        //         value  : mongooseErr.value,
        //     };
        // });
    }

    // used for express logging middleware see core/server/app.js
    req.err = err;

    // alternative for res.status();
    res.statusCode = err.statusCode;

    // never cache errors
    res.set({
        'Cache-Control': 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
    });

    next(err);
};

internals.JSONErrorRenderer = function JSONErrorRenderer(err, req, res, /*jshint unused:false */ next) {
    // Create json response for the error
    let jsonRes = {};

    /* Attach multiple errors to the response*/
    if (!err.errors) {
        jsonRes.errors = [{
            errorType   : err.errorType,
            message     : err.message,
            errorDetails: err.errorDetails
        }];
    } else {
        // todo this case never comes up. fix this
        jsonRes.errors = _.map(err.errors, (errorItem) => {
            return {
                errorType   : errorItem.errorType,
                message     : errorItem.message,
                errorDetails: errorItem.errorDetails
            }
        });
    }

    res.json(jsonRes);
};

errorHandler.resourceNotFound = function resourceNotFound(req, res, next) {
    // TODO, handle unknown resources & methods differently, so that we can also produce
    // 405 Method Not Allowed
    next(new errors.NotFoundError({message: "Resource not found"}));
};

errorHandler.handleJSONResponse = [
    // Make sure the error can be served
    internals.prepareError,
    // Render the error using JSON format
    internals.JSONErrorRenderer
];

export default errorHandler
