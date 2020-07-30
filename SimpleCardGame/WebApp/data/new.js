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

var DEFAULT_PLAYER_SCORE = 0;
var DEFAULT_CARD_TYPES = ["H", "X", "Y", "Z"]; //TODO: add more
var DEFAULT_CARD_FREQUENCIES = [2, 2, 2, 2];
var DEFAULT_QUBIT_VALUES = [0, 0, 1, 0];
var DEFAULT_CARDS_PER_PLAYER = 1;

// Knuth shuffle courtesy of https://www.kirupa.com/html5/shuffling_array_js.htm
Array.prototype.shuffle = function () {
  var input = this;
  for (var i = input.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = input[randomIndex];
    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
};

function getCards(card_types, card_frequencies) {
  var cards = [];
  let index = 0;
  card_types.forEach(card => {
    var i;
    for (i = 0; i < card_frequencies[index]; i++) {
      cards.push({ "name": card, "id": index.toString() });
      index++;
    }
  });
  return cards;
}

function getQubits(qubit_values) {
  var output = []
  var i;
  for (i = 0; i < qubit_values.length-1; i+=2) {
    output.push({"value1": qubit_values[i], "value2": qubit_values[i+1]})
  }
  return output;
}

/**
 * Operations on /new
 */
module.exports = {
  /**
   * summary: Sets up a new game board with the specified players. Generates
   * a deck of cards, shuffled. Deals each player the indicated number of cards.
   * Example:
   *  {
   *      "players": [{"name": "JJ", "score": 0, "id": "0", 
   *                            "cards": [{"name": "Z", "id": "2"}]},
   *                  {"name": "BB", "score": 0, "id": "1", 
   *                            "cards": ["name": "Y", "id": "0"]}],
   *      "deck": [{"name": "H", "id": "1"}],
   *      "qubits": [{"value1": 0, "value2": 0}, {"value1": 1, "value2": 0}],
   *      "played_cards": [],
   *      ""player_turn": "0",
   *      "selected_cards": [],
   *      "game_over": false
   *  }
   * parameters: players
   * produces: application/json, text/json
   * responses: 200
   * operationId: game_new
   */
  post: {
    200: function (req, res, callback) {
      var cards = getCards(DEFAULT_CARD_TYPES, DEFAULT_CARD_FREQUENCIES);
      cards.shuffle();

      var players = [];
      var player_names = req.query.players;
      let count = 0;
      player_names.forEach(name => {
        var player_cards = [];
        var i;
        for (i = 0; i < DEFAULT_CARDS_PER_PLAYER; i++) {
          var player_card = cards.pop();
          player_cards.push(player_card);
        }
        players.push({ "name": name, "score": DEFAULT_PLAYER_SCORE, "id": count.toString(), "cards": player_cards });
        count++;
      });

      // Create corresponding card objects
      var board = {
        "players": players,
        "deck": cards,
        "qubits": getQubits(DEFAULT_QUBIT_VALUES),
        "played_cards": [],
        "player_turn": players[0].id,
        "selected_cards": [],
        "game_over": false
      }

      // For sample purposes only; use cloud storage for scaling up
      global.board = board;
    }
  }
};