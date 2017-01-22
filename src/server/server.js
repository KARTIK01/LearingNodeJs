import chalk from "chalk";
import config from "./config";
var debug = require('debug')('learningnodejs:server');

class Server {

    constructor(parameters) {
        let rootApp = parameters.rootApp;

        this.httpServer   = null;
        this.connections  = {};
        this.connectionId = 0;

        // Expose config module for use externally.
        this.config = config;
    }

    /**
     *
     * @param externalApp - Optional express app instance.
     * @return {Promise} Resolves once Sever has started
     */
    start(externalApp) {
        debug('Starting...');
        let self    = this,
            rootApp = externalApp ? externalApp : self.rootApp;

        return new Promise((resolve, reject) => {
            let port        = config.get('server').port;
            let host        = config.get('server').host;
            self.httpServer = rootApp.listen(port, host);

            self.httpServer.on('error', error => {
                let serverError;
                if (error.errno === 'EADDRINUSE') {
                    serverError = new errors.CustomError({
                        message: `(EADDRINUSE) Cannot start Server. Port  ${port} 
                                is already in use by another program. Is another Server instance already running?`
                    });
                } else {
                    serverError = new errors.CustomError({
                        message: `(Code: ' ${error.errno} ')``There was an error starting your server.`
                            `Please use the error code above to search for a solution.`
                    });
                }
                reject(serverError);
            });

            self.httpServer.on('connection', self.connection.bind(self));
            self.httpServer.on('listening', () => {
                debug('...Started');
                self.logStartMessages();
                resolve(self);
            });
        });
    }


    /**
     * ## Private (internal) methods
     *
     * ### Connection
     * @param {Object} socket
     */
    connection(socket) {
        var self = this;

        self.connectionId += 1;
        socket._ghostId = self.connectionId;

        socket.on('close', () => {
            delete self.connections[this._ghostId];
        });

        self.connections[socket._ghostId] = socket;
    }

    /**
     * ### Close Connections
     * Most browsers keep a persistent connection open to the server, which prevents the close callback of
     * httpServer from returning. We need to destroy all connections manually.
     */
    closeConnections() {
        var self = this;

        Object.keys(self.connections).forEach(function (socketId) {
            var socket = self.connections[socketId];

            if (socket) {
                socket.destroy();
            }
        });
    }

    /**
     * ### Log Start Messages
     */
    logStartMessages() {
        // Startup & Shutdown messages
        if (process.env.NODE_ENV === 'production') {
            console.log(
                chalk.green('Server is running in ' + process.env.NODE_ENV + '...'),
                '\nYour are live on',
                config.get('url'),
                chalk.gray('\nCtrl+C to shut down')
            );
        } else {
            console.log(
                chalk.green('Server is running in ' + process.env.NODE_ENV + '...'),
                '\nListening on',
                config.get('server').host + ':' + config.get('server').port,
                '\nUrl configured as:',
                config.get('url'),
                chalk.gray('\nCtrl+C to shut down')
            );
        }

        function shutdown() {
            console.log(chalk.red('\nServer has shut down'));
            if (process.env.NODE_ENV !== 'production') {
                console.log(
                    '\nChatteron was running for',
                    moment.duration(process.uptime(), 'seconds').humanize()
                );
            }
            process.exit(0);
        }

        // ensure that Ghost exits correctly on Ctrl+C and SIGTERM
        process.removeAllListeners('SIGINT').on('SIGINT', shutdown).removeAllListeners('SIGTERM').on('SIGTERM', shutdown);
    }

    /**
     * ### Log Shutdown Messages
     */
    logShutdownMessages() {
        console.log(chalk.red('Server is closing connections'));
    }
}


module.exports = Server;