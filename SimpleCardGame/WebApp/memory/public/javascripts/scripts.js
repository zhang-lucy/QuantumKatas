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
var gameBoardSize = 0;
var cardsFlipped = 0;

var selectedCards = [];
var selectedCardsValues = [];

var playerTurn = 0;

function newGame() {
    // reset the game
    // gameBoardSize = 0;
    // cardsFlipped = 0;

    // extract game size selection from user
    var player1name = $("#player1name").val();
    var player2name = $("#player2name").val();
    var players = [player1name,player2name]; // TODO
    // var players = $("#newGamePlayers").val(); 

    // fetch the game board array from the server
    $.post("http://localhost:8000/new?players=" + players.join("%2C"), function (response) {
        if(response.status == 200) {
            restoreGame();
        }
    });
}

function restoreGame() {
    // Add code from Part 2.3 here
    // reset the game
    // gameBoardSize = 0;
    // cardsFlipped = 0;

    // fetch the game state from the server 
    $.get("http://localhost:8000/game", function (response) {
        // store game board size
        gameBoardSize = response.length;

        // draw the game board
        drawGameBoard(response);
    });
}

function drawGameBoard(board) {
    // create output
    var output = "";

    // add first player
    output += "<div class=\"playerLabel\">" + board.players[0].name + "</div>";

    // add first player's cards;
    let glyph = "glyphicon glyphicon-cloud";
    let css = "";

    // generate HTML for each card and append to the output
    for (var i = 0; i < board.players[0].cards.length; i++) {
        output += "<div class=\"flipContainer col-xs-3 " + css + "\"><div class=\"cards flip matched\" id=\"" + board.players[0].cards[i].id + "\" onClick=\"playCard(this)\">\
            <div class=\"front\">" + board.players[0].cards[i].name + "</div>\
            <div class=\"back\">" + glyph + "</div>\
            </div></div>";
    }

    output += "<br><br><br><br><br><br>"

    // add qubits
    output += "<div class=\"flipContainer col-xs-3 \"><div class=\"qubitCards\" id=\"" + i + ">\
    <div class=\"front\">" + board.qubits[0].value1 + " + " + board.qubits[0].value2 + "i" + "</div>\
    </div></div>";

    output += "<div class=\"flipContainer col-xs-3 \"><div class=\"qubitCards\" id=\"" + i + ">\
    <div class=\"front\">" + board.qubits[1].value1 + " + " + board.qubits[1].value2 + "i" + "</div>\
    </div></div>";

    
    output += "<br><br><br><br><br><br>"

    // add second player
    output += "<div class=\"playerLabel\">" + board.players[1].name + "</div>";

    // add second player's cards;
    // generate HTML for each card and append to the output
    for (var i = 0; i < board.players[1].cards.length; i++) {
        output += "<div class=\"flipContainer col-xs-3 " + css + "\"><div class=\"cards flip matched\" id=\"" + board.players[1].cards[i].id + "\" onClick=\"playCard(this)\">\
            <div class=\"front\">" + board.players[1].cards[i].name + "</div>\
            <div class=\"back\">" + glyph + "</div>\
            </div></div>";
    }

    // place the output on the page
    $("#game-board").html(output);
}

function playCard(card) {

    // only allow the user to select two cards at a time
    if (selectedCards.length < 2) {

        // check if this is the first card selection or the second
        if (true) { // TODO change this selectedCards.length == 0
            // store the first card selection
            selectedCards.push(card);

            // post this play to the server and get the qubit's resulting value
            $.ajax({
                url: "http://localhost:8000/play?card_id=" + card.id//TODO: FIX // + selectedCards[0] 
                    + "&qubit_index=" + "0"
                    + "&player_id=" + playerTurn, // TODO: FIX
                type: 'PUT',
                success: function (response) {

                }
            });
            restoreGame();
        }
    }
}

// glyphicon value map
var valuesMap = [
    {
        "value": "0",
        "glyphicon": "glyphicon glyphicon-cloud"
    },
    {
        "value": "1",
        "glyphicon": "glyphicon glyphicon-heart"
    },
    {
        "value": "2",
        "glyphicon": "glyphicon glyphicon-star"
    },
    {
        "value": "3",
        "glyphicon": "glyphicon glyphicon-home"
    },
    {
        "value": "4",
        "glyphicon": "glyphicon glyphicon-glass"
    },
    {
        "value": "5",
        "glyphicon": "glyphicon glyphicon-music"
    },
    {
        "value": "6",
        "glyphicon": "glyphicon glyphicon-fire"
    },
    {
        "value": "7",
        "glyphicon": "glyphicon glyphicon-globe"
    },
    {
        "value": "8",
        "glyphicon": "glyphicon glyphicon-tree-conifer"
    }
];

// get gylphicon for value
function lookUpGlyphicon(value) {
    for (var i = 0; i < valuesMap.length; i++) {
        if (valuesMap[i].value == value) {
            return "<span class=\"" + valuesMap[i].glyphicon + "\"></span>";
        }
    }

    return value;
}