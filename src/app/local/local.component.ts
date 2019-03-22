import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import { PIECE, INPUT_EVENT_TYPE, MOVE_INPUT_MODE, COLOR, MARKER_TYPE, Chessboard } from 'cm-chessboard';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css'],
  encapsulation: ViewEncapsulation.None,
  template: `<div width="100%" height="100%" #board></div>`,
})

export class LocalComponent implements AfterViewInit {
@ViewChild('board') board: ElementRef;
    ngAfterViewInit() {
        var tab = {
            board: new Chessboard(this.board.nativeElement,
                {
                    position: "start",
                    orientation: COLOR.white,
                    style: {
                        cssClass: "default",
                        showCoordinates: false,
                        showBorder: false,
                    },
                    responsive: true,
                    animationDuration: 300,
                    moveInputMode: MOVE_INPUT_MODE.dragPiece,
                }),
            chess: new Chess()
        }
        tab.board.enableMoveInput((event) => {
            switch (event.type) {
                case INPUT_EVENT_TYPE.moveStart:
                    if (tab.chess.moves({square: event.square, verbose: true})[0])
                        return true
                    else
                        return false
                case INPUT_EVENT_TYPE.moveDone:
                    return (moveDone(event, tab));
                case INPUT_EVENT_TYPE.moveCanceled:
                    console.log(`moveCanceled`)
            }
        });
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
        return true
    }
    else
        return (checkPromotion(tab, event, posB, posW));
}

function checkMate(tab, posB, posW) {
    if (tab.chess.in_checkmate() == true)
        console.log("ECHEC ET MAT MON BRO !");
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
    turn == 'b' ? turn = 'w' : 'b';
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
