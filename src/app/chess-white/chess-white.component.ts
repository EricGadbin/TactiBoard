import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { PIECE, INPUT_EVENT_TYPE, MOVE_INPUT_MODE, COLOR, MARKER_TYPE, Chessboard } from 'cm-chessboard';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from "jquery";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chess-white',
  templateUrl: './chess-white.component.html',
  styleUrls: ['./chess-white.component.css'],
  encapsulation: ViewEncapsulation.None,
  template: `<div width="100%" height="100%" id="board" #board></div>
             <div id="game_over_back"></div>
             <div id="game_over_msg">
                <p style="margin: 10px">Les {{ color }} ont gagnés</p>
                <div id="buttons">
                    <button mat-raised-button (click)="Reload()" color="primary"> Rejouer </button>
                    <br />
                    <button mat-raised-button routerLink="../chess" color="warn" style="margin: 25px"> Sortir </button>
                </div>
             </div>`,
})

export class ChessWhiteComponent implements AfterViewInit {
@ViewChild('board') board: ElementRef;
constructor(private router: Router, private http: HttpClient) { }
    color = "";
    tab: any;
    response: any;
        ngAfterViewInit() {
        this.response = apiReset();
        console.log(this.response);
        this.tab = {
            board: new Chessboard(this.board.nativeElement,
                {
                    position: "start",
                    orientation: COLOR.white,
                    style: {
                        cssClass: "default",
                        showCoordinates: true,
                        showBorder: true,
                    },
                    responsive: true,
                    animationDuration: 300,
                    moveInputMode: MOVE_INPUT_MODE.dragPiece,
                }),
            chess: new Chess(),
            mov: 0
        }
        var tab = this.tab;
        tab.board.enableMoveInput((event) => {
            if (tab.chess.turn() == 'b')
                this.color = "blancs";
            else
                this.color = "noirs";
            switch (event.type) {
                case INPUT_EVENT_TYPE.moveStart:
                    tab.mov = tab.chess.moves({square: event.square, verbose: true});
                    if (tab.chess.moves({square: event.square, verbose: true})[0])
                        return true
                    else
                        return false
                case INPUT_EVENT_TYPE.moveDone:
                    return (moveDone(event, tab));
                case INPUT_EVENT_TYPE.moveCanceled:
                    console.log(`moveCanceled`)
            }
        }, COLOR.white);
    }
    Reload() {
        this.tab.board.setPosition("start");
        $("#game_over_back").css("display", "none");
        $("#game_over_msg").css("display", "none");
        this.tab.board.removeMarkers(null, MARKER_TYPE.emphasize)
        this.tab.chess = new Chess();
    }
}

declare var Chess: any;

function moveDone(event, tab) {
    for (var i = 0; i < tab.chess.SQUARES.length; i++) {
        var pos = tab.chess.get(tab.chess.SQUARES[i]);
        if (pos != null && pos.type == 'k' && pos.color == 'w')
            var posW = tab.chess.SQUARES[i]
        if (pos != null && pos.type == 'k' && pos.color == 'b')
            var posB = tab.chess.SQUARES[i]
    }
    if (tab.chess.move({from: event.squareFrom, to: event.squareTo})) {
        checkMate(tab, posB, posW);
        checkRoque(tab, event);
        checkPassant(tab, event);
        return true
    }
    else
        return (checkPromotion(tab, event, posB, posW));
}

function checkPassant(tab, event) {
    for (var i = 0; i < tab.mov.length; i += 1) {
        if (tab.mov[i].flags == "e" && tab.mov[i].from == event.squareFrom && tab.mov[i].to == event.squareTo && tab.mov[i].color == "w") {
            setTimeout(function() {
                tab.board.setPiece(event.squareTo[0] + (Number(event.squareTo[1]) - 1), null);
            }, 350);
        }
        else if (tab.mov[i].flags == "e" && tab.mov[i].from == event.squareFrom && tab.mov[i].to == event.squareTo && tab.mov[i].color == "b") {
            setTimeout(function() {
                tab.board.setPiece(event.squareTo[0] + (Number(event.squareTo[1]) + 1), null);
            }, 350);
        }
    }
}

function checkRoque(tab, event) {
    for (var i = 0; i < tab.mov.length; i += 1) {
        if (tab.mov[i].san == "O-O" && tab.mov[i].from == event.squareFrom && tab.mov[i].to == event.squareTo && tab.mov[i].color == "w") {
            setTimeout(function() {
                tab.board.setPiece("f1", "wr");
                tab.board.setPiece("h1", null);
            }, 350);
        }
        if (tab.mov[i].san == "O-O" && tab.mov[i].from == event.squareFrom && tab.mov[i].to == event.squareTo && tab.mov[i].color == "b") {
            setTimeout(function() {
                tab.board.setPiece("f8", "br");
                tab.board.setPiece("h8", null);
            }, 350);
        }
        if (tab.mov[i].san == "O-O-O" && tab.mov[i].from == event.squareFrom && tab.mov[i].to == event.squareTo && tab.mov[i].color == "w") {
            setTimeout(function() {
                tab.board.setPiece("d1", "wr");
                tab.board.setPiece("a1", null);
            }, 350);
        }
        if (tab.mov[i].san == "O-O-O" && tab.mov[i].from == event.squareFrom && tab.mov[i].to == event.squareTo && tab.mov[i].color == "b") {
            setTimeout(function() {
                tab.board.setPiece("d8", "br");
                tab.board.setPiece("a8", null);
            }, 350);
        }
    }
}

function checkMate(tab, posB, posW) {
    if (tab.chess.in_checkmate() == true) {
        $("#game_over_back").css("display", "block");
        $("#game_over_msg").css("display", "block");
    }
    if (tab.chess.in_check() == true) {
        if (tab.chess.turn() == 'b')
            tab.board.addMarker(posB, MARKER_TYPE.emphasize)
        else
            tab.board.addMarker(posW, MARKER_TYPE.emphasize)
    }
    else if (tab.chess.in_check() == false) {
        if (tab.chess.turn() == 'w') {
            tab.board.removeMarkers(posB, MARKER_TYPE.emphasize)
        } else {
            tab.board.removeMarkers(posW, MARKER_TYPE.emphasize)
        }
    }

}

function checkPromotion(tab, event, posB, posW) {
    var turn = tab.chess.turn();
    if (tab.chess.move({from: event.squareFrom, to: event.squareTo, promotion: 'q'})) {
        setTimeout(function() {
            tab.board.setPiece(event.squareTo, turn + 'q');
        }, 350);
        checkMate(tab, posB, posW);
        return true;
    } else {
        checkMate(tab, posB, posW);
        return false;
    }
}

function apiReset() {
    var response = $.ajax({
        "url": "http://10.101.53.76:5000/reset",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin':'*',
        },
        async: false,
    }).responseText;
    return (JSON.parse(response));
}

function apiTurn() {
    var settings = {
        "url": "http://10.101.53.76:5000/turn",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin':'*'
        }
    };
    $.ajax(settings).done(function (response) {
        return(JSON.parse(response));
    });
}

function apiBoard() {
    var settings = {
        "url": "http://10.101.53.76:5000/board",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin':'*'
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(JSON.parse(response));
    });
}

function apiMove(move1, move2) {
    var settings = {
        "url": `http://10.101.53.76:5000/move?begin=${move1}&end=${move2}`,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            'Access-Control-Allow-Origin':'*'
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(JSON.parse(response));
    });
}
