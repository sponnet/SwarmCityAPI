'use strict';

const logger = require('../logs')('services/db');

/**
 * A service that collects all interactions with LevelDb
 */
class DBService {
    /**
     * Create a DBService
     * @param   {levelDb}   db      The connection to leveldb
     * @param   {Object}    options Contains options
     * @todo    Ensure all options are set
     */
    constructor(db, options) {
        this.db = db;
        this.options = options || {
            'parameterscontract': '',
            'parameterscontractstartblock': ''
        }
    }

    /**
     * Returns the cached data for a given shortcode
     *
     * @param      {String}   shortcode    The shortcode
     * @return     {Promise}  resolves with a JSON object, rejects with an Error object
     */
    readShortCode(shortcode) {
        logger.info('readShortCode start', shortcode);
        return new Promise((resolve, reject) => {
            let key = 'shortcode-' + shortcode;
            this.db.get(key).then((val) => {
                // so we have data..
                try {
                    let data = JSON.parse(val);
                    logger.info('We found data in DB', data);
                    // is the code still valid ? If it has not expired, return the data.
                    if (data.validUntil && data.validUntil >= (new Date).getTime()) {
                        logger.info('data is OK ', data);
                        return resolve(data.payload);
                    }
                    logger.info('data has expired');
                    return reject();
                } catch (e) {
                    // can't read the data.
                    return reject();
                }
            }).catch((err) => {
                if (err.notFound) {
                    logger.error('key', key, 'not found (yet) in DB. ');
                    return reject();
                }
                reject(new Error(err));
            });
        });
    }

    /**
     * Returns last processed block of the parameters contract
     * ( or the deployment block if not initialized yet...)
     *
     * @return     {Promise}  The last block.
     */
    getLastBlock() {
        return new Promise((resolve, reject) => {
            this.db.get('lastblock-' + this.options.parameterscontract, function(err, value) {
                if (err) {
                    if (err.notFound) {
                        // handle a 'NotFoundError' here
                        resolve(parseInt(this.options.parameterscontractstartblock));
                    }
                    // I/O or other error, pass it up the callback chain
                    reject();
                }
                resolve(parseInt(value));
            });
        });
    }

    /**
     * Sets the last block.
     *
     * @param      {Number}  blockNumber  The block number
     * @return     {promise}  promise
     */
    setLastBlock(blockNumber) {
        return db.put('lastblock-' + this.options.parameterscontract, blockNumber);
    }

}

module.exports = {
    'DBService': DBService,
};
