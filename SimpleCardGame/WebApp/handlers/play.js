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
var dataProvider = require('../data/play.js');
/**
 * Operations on /play
 */
module.exports = {
    /**
     * summary: Specifies a card (ID) to reveal
     * parameters: card
     * produces: application/json, text/json
     * responses: 200, 400
     */
    put: function game_play(req, res, next) {
        var status, message;
        var validplay = true;
        var board = global.board;
        var player_id = req.query.player_id;
        var card_id = req.query.card_id;
        var qubit_index = req.query.qubit_index;
        var player_cards = board.players.filter(p => p.id == player_id)[0].cards;
        var player_turn = board.player_turn;
        var selected_cards = board.selected_cards;

        // Ensure there's a game running
        if (!board) {
            validplay = false;
            message = "Please start a new game (POST '/new?players={list of players}').";
        }
        // Ensure player exists 
        else if (!board.players.map(p => p.id).includes(player_id)) {
            validplay = false;
            message = board.players.map(p => p.id).toString() + "Invalid player ID.";
        }
        // // Ensure player has card
        else if (player_cards.filter(c=>c.id == card_id).length != 1) {
                validplay = false;
                message = "Not a valid card id. Please indicate a card in the player's hand";
        } 
        // Ensure qubit specified isn't out of range
        else if (qubit_index < 0 || qubit_index >= global.board.qubits.length) {
            validplay = false;
            message = "Not a valid index. Please specify qubit ids within the range of 0 to " +
                String(global.board.qubits.length - 1) + ".";
        } 
        // Ensure the correct player's turn
        else if (player_turn != player_id) {
            validplay = false;
            message = "It is not " + String(player_id) + "'s turn."
        }
        // Players can only play to the cards the haven't played to yet
        else {
            selected_cards.forEach(card => {
                if (card.qubit_index == qubit_index) {
                    validplay = false;
                    message = "You have already played a card to Qubit " + qubit_index + ". Please specify a qubit that has not been played to yet."
                }
            })
        }


        // This is a valid play: reveal the card
        if (validplay) {
            status = 200;
            var provider = dataProvider['put']['200'];
            var card = provider(req, res, function (err, data) {
                if (err) {
                    next(err);
                    return;
                }
            });
            res.json(card);
        } else {    // This is not a valid play: set bad request error
            status = 400;
        }

        res.status(status).send(message);
    }
};