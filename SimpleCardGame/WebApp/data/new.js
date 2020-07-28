'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /new
 */
module.exports = {
    /**
     * summary: Initializes a new game board of the specified size (# of matches).
     * description: 
     * parameters: size
     * produces: application/json, text/json
     * responses: 200
     * operationId: game_new
     */
    post: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/new',
                operation: 'post',
                response: '200'
            }, callback);
        }
    }
};
