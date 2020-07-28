'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /game
 */
module.exports = {
    /**
     * summary: Retrieves the current state of the memory game board.
     * description: 
     * parameters: 
     * produces: application/json, text/json
     * responses: 200
     * operationId: game_get
     */
    get: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/game',
                operation: 'get',
                response: '200'
            }, callback);
        }
    }
};
