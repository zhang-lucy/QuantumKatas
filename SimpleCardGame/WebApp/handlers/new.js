'use strict';
var dataProvider = require('../data/new.js');
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
     */
    post: function game_new(req, res, next) {
        /**
         * Get the data for response 200
         * For response `default` status 200 is used.
         */
        var status = 200;
        var provider = dataProvider['post']['200'];
        provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
            res.status(status).send(data && data.responses);
        });
    }
};
