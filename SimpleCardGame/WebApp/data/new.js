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
var DEFAULT_CARD_FREQUENCIES = [2,2,2,2];
var DEFAULT_QUBIT_VALUES = [0, 0, 1, 0];
var DEFAULT_CARDS_PER_PLAYER = 2;

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

// function getPlayers(player_names, cards) {
//   var players = [];
//   let count = 0;
//   player_names.forEach(name => {
//     players.push({"name": name, "score": DEFAULT_PLAYER_SCORE, "id": count});
//     count++;
//   });
//   return players;
// }

function getCards(card_types, card_frequencies) {
  var cards = [];
  let index = 0;
  card_types.forEach(card => {
    var i;
    for (i = 0; i < card_frequencies[index]; i++) {
      cards.push({ "name": card });
    }
    index++;
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
   * TODO: Re-write
   * summary: Sets up a new game board with specified # of matches
   * description: The game board is a global array of "card" objects, where
   *  their position in the array indicates their ID, and their "value" and
   *  "cleared" properties represent their value and game status. For example,
   * a new board of size=1 (1 matches) would be generated as:
   *  [ 
   *      { "cleared":"false", 
   *        "value":"0", 
   *      }, 
   *      { "cleared":"false", 
   *        "value":"0", 
   *      }
   *  ]
   * parameters: size
   * produces: application/json, text/json
   * responses: 200
   * operationId: game_new
   */
  post: {
    200: function (req, res, callback) {
      // Generate random [0...size] value pairs and shuffle them
      //  var values = Array.from(Array(req.query.size).keys());
      //  var deck = values.concat(values.slice());
      //  deck.shuffle();

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

      // For sample purposes only; use cloud storage
      global.board = board;
    }
  }
};