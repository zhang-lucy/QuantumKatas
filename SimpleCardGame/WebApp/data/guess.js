'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /guess
 */
module.exports = {
    /**
     * summary: Specifies a card to reveal and checks for a match to the previous.
     * description: 
     * parameters: card
     * produces: application/json, text/json
     * responses: 200
     * operationId: game_guess
     */
    put: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/guess',
                operation: 'put',
                response: '200'
            }, callback);
        }
    }
};
