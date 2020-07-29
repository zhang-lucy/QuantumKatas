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

function updateQubit(qubit, card) {
    // TODO
    // qubit: {"value1": "integer", "value2": "integer"}
    // card: {"name": "string"}
    return qubit;
}

/**
 * Operations on /play
 */
module.exports = {
    /**
     * summary: Plays the specified card from the indicated player's hand.
     * description: Each play consists of 1 card and 1 player.
     * parameters: card, player_id
     * produces: application/json, text/json
     * responses: 200
     * operationId: game_play
     */
    put: {
        200: function (req, res, callback) {
            // Obtain the card values
            var response = {};

            var player_id = req.query.player_id;
            var card_index = req.query.card_index;
            var qubit_index = req.query.qubit_index;

            // get current player's cards
            var player_cards = global.board.players.filter(p=>p.id==player_id)[0].cards;
            var qubits = global.board.qubits;

            // store played card, removing from player's hand
            var played_card = player_cards.pop(card_index);
            played_card.player_id = player_id;
            global.board.played_cards.push(played_card);

            // deal another card from the deck
            var new_card = global.board.deck.pop();
            player_cards.push(new_card);

            // update corresponding players cards
            global.board.players = global.board.players.map(p => {
                if (p.id == player_id) {
                    p.cards = player_cards;
                } 
                return p;
            });

            // update qubit
            var newQubit = updateQubit(qubits[qubit_index], player_cards[card_index])
            global.board.qubits[qubit_index] = newQubit;

            response.player_id = player_id;
            response.qubits = global.board.qubits;

            return response;
        }
    }
};