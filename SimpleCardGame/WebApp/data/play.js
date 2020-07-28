'use strict';
var Mockgen = require('./mockgen.js');
/**
 * Operations on /play
 */
module.exports = {
    /**
     * summary: Specifies a card to play, indicated by the number index into the list of cards
     * description: 
     * parameters: card
     * produces: application/json, text/json
     * responses: 200
     * operationId: game_play
     */
    put: {
        200: function (req, res, callback) {
            /**
             * Using mock data generator module.
             * Replace this by actual data for the api.
             */
            Mockgen().responses({
                path: '/play',
                operation: 'put',
                response: '200'
            }, callback);
        }
    }
};
