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

function updateQubit(cards, q1_hist, q2_hist) {
    var body = {
        "cards": cards,
        "q1_hist": q1_hist,
        "q2_hist": q2_hist,
    }
    $.toJSON(body);
    $.post("http://localhost:5000/simulate", function (response) {
        if(response.status == 200) {
            return {"logs": response.logs, "states": response.states, "measurements": response.measurements};
        }
    });
}

/**
 * Operations on /play
 */
module.exports = {
    /**
     * summary: Plays the specified card from the indicated player's hand.
     * description: Each play consists of a card, player, and qubit.
     * parameters: card_id, player_id, qubit_index
     * produces: application/json, text/json
     * responses: 200
     * operationId: game_play
     */
    put: {
        200: function (req, res, callback) {
            // Obtain the card values
            var response = {};

            var player_id = req.query.player_id;
            var card_id_1 = req.query.card_id_1;
            var card_id_2 = req.query.card_id_2;
            
            // get current player's cards
            var player_cards = global.board.players.filter(p=>p.id==player_id)[0].cards;

            // find the indicated cards
            var card_indices = [-1, -1];
            for (var i = 0; i < player_cards.length; i++) {
                if (player_cards[i].id == card_id_1) {
                    card_indices[0] = i;
                }
                else if (player_cards[i].id == card_id_2) {
                    card_indices[1] = i;
                }
            }
            // TODO: assert that card_index is not -1

            // store played cards, removing from player's hand
            var played_card_1 = player_cards.pop(card_indices[0]);
            var played_card_2 = player_cards.pop(card_indices[1]);
            global.board.played_cards["0"].push(played_card_1);
            global.board.played_cards["1"].push(played_card_2);

            // deal two cards from the deck
            var new_card = global.board.deck.pop();
            player_cards.push(new_card);
            new_card = global.board.deck.pop();
            player_cards.push(new_card);

            // update corresponding players cards
            global.board.players = global.board.players.map(p => {
                if (p.id == player_id) {
                    p.cards = player_cards;
                } 
                return p;
            });

            // update qubit
            var newQubit = updateQubit(player_cards.map(c => c.name), global.board.played_cards["0"].map(c => c.name), global.board.played_cards["1"].map(c => c.name))
            global.board.qubits[qubit_index] = newQubit;

            response.player_id = player_id;
            response.qubits = global.board.qubits;

            return response;
        }
    }
};