import _ from "lodash";
import uuid from "uuid";
export class CustomError extends Error {
    constructor(options) {
        super(options.message);
        options    = options || {};
        const self = this;
        if (_.isString(options)) {
            throw new Error('Please instantiate Errors with the option pattern. e.g. new errors.CustomError({message: ...})');
        }

        Error.captureStackTrace(this, CustomError);
        /**
         * defaults
         */
        this.statusCode = 500;
        this.errorType = 'InternalServerError';
        this.level     = 'normal';
        this.id        = uuid.v1();

        /**
         * custom overrides
         */
        this.statusCode = options.statusCode || this.statusCode;
        this.level     = options.level || this.level;
        this.context   = options.context || this.context;
        this.help      = options.help || this.help;
        this.errorType = this.name = options.errorType || this.errorType;
        this.errorDetails = options.errorDetails;
        this.code         = options.code || null;

        // @TODO: ?
        this.property = options.property;
        this.value    = options.value;

        this.message   = options.message;
        this.hideStack = options.hideStack;

        // replace double quotes with single in the error message
        // this.message = (this.message || "").replace(/"/g, "'");

        // error to inherit from, override!
        console.log("ok() : 1", options);
        // nested objects are getting copied over in one piece (can be changed, but not needed right now)
        if (options.err) {

            // it can happen that third party libs return errors as strings, yes really
            // we are creating an error stack from this line, but we need to ensure not loosing the original error message
            if (_.isString(options.err)) {
                options.err = new Error(options.err);
            }

            Object.getOwnPropertyNames(options.err).forEach(function (property) {
                // original message is part of the stack, no need to pick it
                if (['errorType', 'name', 'statusCode'].indexOf(property) !== -1) {
                    return;
                }

                if (property === 'message' && !self[property]) {
                    self[property] = options.err[property];
                    return;
                }

                if (property === 'stack') {
                    self[property] += '\n\n' + options.err[property];
                    return;
                }

                self[property] = options.err[property] || self[property];
            });
        }
    }
}


export class UnauthorizedError extends CustomError {
    constructor(options) {
        super(_.merge({
            statusCode: 401
        }, options));
        this.errorType = this.constructor.name;
    }
}

export class NotFoundError extends CustomError {
    constructor(options) {
        super(_.merge({
            statusCode: 404
        }, options));
        this.errorType = this.constructor.name;
    }
}