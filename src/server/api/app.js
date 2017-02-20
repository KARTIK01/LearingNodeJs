import express from "express";
// This essentially provides the controllers for the routes
//shared
import bodyParser from "body-parser";
// This essentially provides the controllers for the routes
import auth from '../auth'
import api from "../api";
import errorHandler from "../middleware/error-handler";
const debug = require('debug')('learningnodejs:app');

// import checkSSL from '../middleware/check-ssl'
// import maintenance from '../middleware/maintenance'

const authenticateUser = [
    auth.authenticate.authenticateUser
];

function apiRoutes() {
    let apiRouter = express.Router();

    // alias delete with del
    apiRouter.del = apiRouter.delete;

    // ## CORS pre-flight check
    // apiRouter.options('*', cors);

    // enable cors
    // apiRouter.use(cors);

    apiRouter.get('/email-verification', api.http(api.usersApi.verifyEmail));

    //######################################## USER API ########################################
    apiRouter.post('/users', api.http(api.usersApi.register));
    apiRouter.post('/users/login-signup', api.http(api.usersApi.loginOrRegister));
    apiRouter.post('/users/login', api.http(api.usersApi.login));
    apiRouter.post('/users/reset-password', api.http(api.usersApi.resetPassword));
    apiRouter.post('/users/forgot-password', api.http(api.usersApi.forgotPassword));
    apiRouter.get('/users/check-email', api.http(api.usersApi.checkEmailAvailable));

    apiRouter.put('/users/password', authenticateUser, api.http(api.usersApi.checkEmailAvailable));


    //######################################## JOKES API ########################################
    apiRouter.get('/jokes', api.http(api.jokesApi.fetchJokes));
    apiRouter.put('/jokes', api.http(api.jokesApi.saveSingleJoke));

    //######################################## BOOKS API USER ########################################
    apiRouter.post('/users/register', api.http(api.booksApi.registerUser));

    //######################################## BOOKS API ########################################
    apiRouter.get('/users/:userID/books/', api.http(api.booksApi.getBooks));
    apiRouter.put('/users/:userID/books/', api.http(api.booksApi.saveBooks));
    apiRouter.get('/users/:userID/books/:bookID', api.http(api.booksApi.getBook));
    apiRouter.del('/users/:userID/books/:bookID', api.http(api.booksApi.deleteBook));

    apiRouter.get('/fetchBooks', api.http(api.booksApi.fetchBook));

    apiRouter.get('/fetchBooks', api.http(api.booksApi.fetchBookTest));


    return apiRouter;
};


module.exports = function setupApiApp() {
    debug('API setup start');
    let apiApp = express();
// API middleware
    // parse application/json
    apiApp.use(bodyParser.json({ limit:'3mb' }));

    // parse application/x-www-form-urlencoded
    apiApp.use(bodyParser.urlencoded({ extended:true, limit:'5mb' }));

    // send 503 json response in case of maintenance
    // apiApp.use(maintenance);

    // Force SSL if required
    // must happen AFTER asset loading and BEFORE routing
    // apiApp.use(checkSSL);

    // Add in all trailing slashes & remove uppercase
    // must happen AFTER asset loading and BEFORE routing
    // apiApp.use(prettyURLs);

    // Check version matches for API requests, depends on res.locals.safeVersion being set
    // Therefore must come after themeHandler.ghostLocals, for now
    // apiApp.use(versionMatch);

    // API shouldn't be cached
    // apiApp.use(cacheControl('private'));

    // Routing
    apiApp.use(apiRoutes());

    // API error handling
    apiApp.use(errorHandler.resourceNotFound);
    apiApp.use(errorHandler.handleJSONResponse);

    debug('API setup end');

    return apiApp;
};