'use strict';
var dataProvider = require('../data/guess.js');
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
     */
    put: function game_guess(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['put']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
