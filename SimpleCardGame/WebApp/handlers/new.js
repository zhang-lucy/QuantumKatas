//  ---------------------------------------------------------------------------------
//  Copyright (c) Microsoft Corporation.  All rights reserved.
// 
//  The MIT License (MIT)
// 
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
// 
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
// 
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//  ---------------------------------------------------------------------------------
'use strict';
var dataProvider = require('../data/new.js');

/**
 * Operations on /new
 */
module.exports = {
    /**
     * summary: Initializes a new game board with the specified players
     * parameters: size
     * produces: application/json, text/json
     * responses: 200, 400
     */
    post: function game_new(req, res, next) {
        var status;
        var message;
        global.board = null;  // Null out the current game

        // This is a valid game size: initialize new game board
        status = 200;
        var provider = dataProvider['post']['200'];

        // Call the data layer to shuffle up a new game
        var board = provider(req, res, function (err, data) {
            if (err) {
                next(err);
                return;
            }
        });

        
        message = "Ready to play! Players: " +
                    req.query.players[0] + 
                    " and " + 
                    req.query.players[1]; 

        res.status(status).send(message);


    }
};