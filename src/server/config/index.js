import Nconf from "nconf";
import path from "path";

const nconf = new Nconf.Provider();
const env   = process.env.NODE_ENV || 'development';

/**
 * command line arguments
 */
nconf.argv();

/**
 * env arguments
 */
nconf.env({
    separator: '__'
});

let ROOT_PATH = path.join(__dirname);

/**
 * load config files
 */
nconf.file('overrides', path.join(ROOT_PATH, 'overrides.json'));
nconf.file('environment', path.join(ROOT_PATH, 'env', 'config.' + env + '.json'));
nconf.file('defaults', path.join(ROOT_PATH, 'defaults.json'));

/**
 * values we have to set manual
 */
nconf.set('env', env);

module.exports = nconf;
